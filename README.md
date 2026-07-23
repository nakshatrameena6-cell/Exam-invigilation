import cv2
import torch
import numpy as np
from collections import defaultdict
from ultralytics import YOLO

# -------------------------------
# GPU CHECK
# -------------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using Device:", device)

# -------------------------------
# TWO-MODEL ENSEMBLE
# -------------------------------
model_n = YOLO("yolo26n.pt")
model_s = YOLO("yolo26s.pt")

# -------------------------------
# INPUT / OUTPUT
# -------------------------------
input_video  = "BACKVIEW.mp4"
output_video = "output_v2.mp4"

cap = cv2.VideoCapture(input_video)
if not cap.isOpened():
    raise RuntimeError("Cannot open video file")

fps    = cap.get(cv2.CAP_PROP_FPS) or 30
ORIG_W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
ORIG_H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out    = cv2.VideoWriter(output_video, fourcc, fps, (ORIG_W, ORIG_H))

print(f"Video: {ORIG_W}x{ORIG_H} @ {fps:.1f}fps")


# ---------------------------------------------------------------
# SINGLE MODEL PREDICT
# ---------------------------------------------------------------
def predict_one(model, source, conf, iou, imgsz, device):
    """Run one model prediction, return list of (x1,y1,x2,y2,conf)."""
    res = model.predict(
        source,
        conf=conf,
        iou=iou,
        imgsz=imgsz,
        classes=[0],
        device=device,
        verbose=False,
    )[0]
    boxes = []
    if res.boxes is not None:
        for box in res.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            bc = float(box.conf[0])
            boxes.append((x1, y1, x2, y2, bc))
    return boxes


# ---------------------------------------------------------------
# EDGE STRIP TILES
# FIX: Dedicated crops for left col, right col, top row, bottom row
# These catch students at corners/sides that fall on tile seams
# ---------------------------------------------------------------
def get_edge_tiles(frame):
    """
    Returns list of (tile_img, x_offset, y_offset) for edge strips.
    Covers: left 30%, right 30%, top 35%, bottom 35% of frame.
    """
    H, W = frame.shape[:2]
    tiles = []

    left_w  = int(W * 0.30)
    right_w = int(W * 0.30)
    top_h   = int(H * 0.35)
    bot_h   = int(H * 0.35)

    # Left strip
    tiles.append((frame[:, :left_w],       0,          0))
    # Right strip
    tiles.append((frame[:, W - right_w:],  W - right_w, 0))
    # Top strip
    tiles.append((frame[:top_h, :],        0,          0))
    # Bottom strip
    tiles.append((frame[H - bot_h:, :],    0,          H - bot_h))
    # Four corners explicitly
    tiles.append((frame[:top_h, :left_w],              0,           0))
    tiles.append((frame[:top_h, W - right_w:],         W - right_w, 0))
    tiles.append((frame[H - bot_h:, :left_w],          0,           H - bot_h))
    tiles.append((frame[H - bot_h:, W - right_w:],     W - right_w, H - bot_h))

    return tiles


# ---------------------------------------------------------------
# TILED INFERENCE — grid + edge strips + full frame, both models
# FIX: overlap 0.30→0.40, conf 0.10→0.07
# ---------------------------------------------------------------
def run_ensemble_tiled(frame, model_n, model_s, device,
                       tile_rows=3, tile_cols=4,
                       overlap=0.40,   # FIX: was 0.30
                       conf=0.07,      # FIX: was 0.10 — catches slouchers
                       iou=0.30):

    H, W     = frame.shape[:2]
    tile_h   = int(H / (tile_rows - overlap * (tile_rows - 1)))
    tile_w   = int(W / (tile_cols - overlap * (tile_cols - 1)))
    stride_h = int(tile_h * (1 - overlap))
    stride_w = int(tile_w * (1 - overlap))

    all_boxes = []

    # --- Grid tile passes (both models) ---
    for row in range(tile_rows):
        for col in range(tile_cols):
            y1_t = min(row * stride_h, H - tile_h)
            x1_t = min(col * stride_w, W - tile_w)
            y2_t = y1_t + tile_h
            x2_t = x1_t + tile_w

            tile = frame[y1_t:y2_t, x1_t:x2_t]

            for model in [model_n, model_s]:
                for b in predict_one(model, tile, conf, iou, 640, device):
                    all_boxes.append((
                        b[0] + x1_t, b[1] + y1_t,
                        b[2] + x1_t, b[3] + y1_t,
                        b[4]
                    ))

    # --- FIX: Dedicated edge/corner strip passes ---
    for (tile_img, x_off, y_off) in get_edge_tiles(frame):
        for model in [model_n, model_s]:
            for b in predict_one(model, tile_img, conf, iou, 640, device):
                all_boxes.append((
                    b[0] + x_off, b[1] + y_off,
                    b[2] + x_off, b[3] + y_off,
                    b[4]
                ))

    # --- Full-frame pass at high res (both models) ---
    for model, imgsz in [(model_n, 1280), (model_s, 1280)]:
        for b in predict_one(model, frame, conf, iou, imgsz, device):
            all_boxes.append(b)

    return all_boxes


def nms_boxes(boxes, iou_thresh=0.45):
    """Merge duplicate detections across tiles and models."""
    if not boxes:
        return []
    boxes_arr  = np.array([[b[0],b[1],b[2],b[3]] for b in boxes], dtype=np.float32)
    scores_arr = np.array([b[4] for b in boxes], dtype=np.float32)
    indices    = cv2.dnn.NMSBoxes(
        boxes_arr.tolist(), scores_arr.tolist(), 0.05, iou_thresh
    )
    if len(indices) == 0:
        return []
    return [boxes[i] for i in indices.flatten()]


# ---------------------------------------------------------------
# IoU TRACKER
# FIX: iou_thresh 0.28→0.22 (slouching changes body shape)
# FIX: max_lost 60→90 (re-acquire after fully bent down)
# ---------------------------------------------------------------
class SimpleTracker:
    def __init__(self,
                 max_lost=90,       # FIX: was 60
                 iou_thresh=0.22):  # FIX: was 0.28
        self.next_id    = 1
        self.tracks     = {}
        self.max_lost   = max_lost
        self.iou_thresh = iou_thresh

    def _iou(self, a, b):
        ax1,ay1,ax2,ay2 = a
        bx1,by1,bx2,by2 = b
        ix1 = max(ax1,bx1); iy1 = max(ay1,by1)
        ix2 = min(ax2,bx2); iy2 = min(ay2,by2)
        inter = max(0, ix2-ix1) * max(0, iy2-iy1)
        if inter == 0: return 0.0
        ua = (ax2-ax1)*(ay2-ay1) + (bx2-bx1)*(by2-by1) - inter
        return inter / ua if ua > 0 else 0.0

    def update(self, detections):
        matched_track_ids = set()
        matched_det_ids   = set()
        results           = []
        track_ids         = list(self.tracks.keys())

        if track_ids and detections:
            iou_matrix = np.zeros((len(track_ids), len(detections)))
            for ti, tid in enumerate(track_ids):
                for di, det in enumerate(detections):
                    iou_matrix[ti, di] = self._iou(
                        self.tracks[tid]["box"], det[:4]
                    )
            flat = np.argsort(-iou_matrix.flatten())
            for idx in flat:
                ti = idx // len(detections)
                di = idx  %  len(detections)
                if ti >= len(track_ids): continue
                if iou_matrix[ti, di] < self.iou_thresh: break
                tid = track_ids[ti]
                if tid in matched_track_ids or di in matched_det_ids: continue
                det = detections[di]
                self.tracks[tid].update({
                    "box": det[:4], "conf": det[4], "lost": 0
                })
                self.tracks[tid]["frames"] = self.tracks[tid].get("frames", 0) + 1
                matched_track_ids.add(tid)
                matched_det_ids.add(di)

        for di, det in enumerate(detections):
            if di not in matched_det_ids:
                self.tracks[self.next_id] = {
                    "box": det[:4], "conf": det[4],
                    "lost": 0, "frames": 1
                }
                self.next_id += 1

        for tid in list(self.tracks.keys()):
            if tid not in matched_track_ids:
                self.tracks[tid]["lost"] += 1
                if self.tracks[tid]["lost"] > self.max_lost:
                    del self.tracks[tid]
            else:
                self.tracks[tid].setdefault("frames", 0)

        for tid, t in self.tracks.items():
            # FIX: min_frames 2→3 — compensates for lower conf threshold
            if t.get("frames", 0) >= 3:
                x1,y1,x2,y2 = map(int, t["box"])
                results.append((x1, y1, x2, y2, t["conf"], tid))

        return results


# ---------------------------------------------------------------
# SMOOTHING + COLOR
# ---------------------------------------------------------------
SMOOTH_WINDOW = 4
box_history   = defaultdict(list)

def smooth_box(track_id, new_box):
    h = box_history[track_id]
    h.append(new_box)
    if len(h) > SMOOTH_WINDOW:
        h.pop(0)
    return tuple(np.array(h).mean(axis=0).astype(int))

def id_color(tid):
    s = tid * 37 % 256
    return (int(s*91%256), int(s*53%256), int(s*173%256))


# ---------------------------------------------------------------
# MAIN LOOP
# ---------------------------------------------------------------
tracker     = SimpleTracker(max_lost=90, iou_thresh=0.22)
frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Ensemble tiled inference (grid + edge strips + full frame)
    raw_boxes = run_ensemble_tiled(
        frame, model_n, model_s, device,
        tile_rows=3, tile_cols=4,
        overlap=0.40,
        conf=0.07,
        iou=0.30
    )

    # Merge duplicates from all tiles + both models
    merged  = nms_boxes(raw_boxes, iou_thresh=0.45)

    # Track
    tracked = tracker.update(merged)

    # Draw
    for (x1, y1, x2, y2, conf, tid) in tracked:

        # FIX: Box size min 18→12px width — catches small/far students
        if (x2 - x1) < 12 or (y2 - y1) < 16:
            continue

        x1, y1, x2, y2 = smooth_box(tid, (x1, y1, x2, y2))
        color = id_color(tid)

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        label = f"ID:{tid}  {conf:.2f}"
        (lw, lh), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        cv2.rectangle(frame, (x1, y1 - lh - 10), (x1 + lw + 6, y1), color, -1)
        cv2.putText(
            frame, label, (x1 + 3, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX, 0.55,
            (255, 255, 255), 2, cv2.LINE_AA
        )

    cv2.putText(
        frame, f"Frame:{frame_count}  People:{len(tracked)}",
        (10, ORIG_H - 12),
        cv2.FONT_HERSHEY_SIMPLEX, 0.65,
        (200, 200, 200), 2, cv2.LINE_AA
    )

    out.write(frame)

cap.release()
out.release()
print(f"Done! {frame_count} frames | Saved as output_v2.mp4")
