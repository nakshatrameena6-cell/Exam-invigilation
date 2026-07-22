import cv2
import torch
import numpy as np
from ultralytics import YOLO

from config import (
    YOLO_N_MODEL,
    YOLO_S_MODEL,
    CONFIDENCE,
    IOU,
    TILE_ROWS,
    TILE_COLS,
    OVERLAP,
)

# ---------------------------------------------------------------
# GPU CHECK
# ---------------------------------------------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using Device:", device)

# ---------------------------------------------------------------
# LOAD MODELS
# ---------------------------------------------------------------
try:
    print("Loading primary model:", YOLO_N_MODEL)
    model_n = YOLO(str(YOLO_N_MODEL))
except Exception as e:
    print(f"Warning: Failed to load {YOLO_N_MODEL} ({e}). Falling back to yolov8n.pt")
    model_n = YOLO("yolov8n.pt")

try:
    print("Loading secondary model:", YOLO_S_MODEL)
    model_s = YOLO(str(YOLO_S_MODEL))
except Exception as e:
    print(f"Warning: Failed to load {YOLO_S_MODEL} ({e}). Falling back to yolov8s.pt")
    model_s = YOLO("yolov8s.pt")


# ---------------------------------------------------------------
# SINGLE MODEL PREDICT
# ---------------------------------------------------------------
def predict_one(model, source, conf, iou, imgsz, device):
    """Run one model prediction, return list of (x1,y1,x2,y2,conf,cls)."""

    res = model.predict(
        source,
        conf=conf,
        iou=iou,
        imgsz=imgsz,
        classes=[0, 63, 67, 73],
        device=device,
        verbose=False,
    )[0]

    boxes = []

    if res.boxes is not None:
        for box in res.boxes:

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            bc = float(box.conf[0])
            cls = int(box.cls[0])

            boxes.append((x1, y1, x2, y2, bc, cls))

    return boxes


# ---------------------------------------------------------------
# EDGE STRIP TILES
# ---------------------------------------------------------------
def get_edge_tiles(frame):

    """
    Returns list of (tile_img, x_offset, y_offset)
    """

    H, W = frame.shape[:2]

    tiles = []

    left_w = int(W * 0.30)
    right_w = int(W * 0.30)

    top_h = int(H * 0.35)
    bot_h = int(H * 0.35)

    tiles.append((frame[:, :left_w], 0, 0))
    tiles.append((frame[:, W-right_w:], W-right_w, 0))

    tiles.append((frame[:top_h, :], 0, 0))
    tiles.append((frame[H-bot_h:, :], 0, H-bot_h))

    tiles.append((frame[:top_h, :left_w], 0, 0))
    tiles.append((frame[:top_h, W-right_w:], W-right_w, 0))
    tiles.append((frame[H-bot_h:, :left_w], 0, H-bot_h))
    tiles.append((frame[H-bot_h:, W-right_w:], W-right_w, H-bot_h))

    return tiles


# ---------------------------------------------------------------
# ENSEMBLE TILED INFERENCE
# ---------------------------------------------------------------
def run_ensemble_tiled(
        frame,
        model_n=model_n,
        model_s=model_s,
        device=device,
        tile_rows=TILE_ROWS,
        tile_cols=TILE_COLS,
        overlap=OVERLAP,
        conf=CONFIDENCE,
        iou=IOU):

    H, W = frame.shape[:2]

    tile_h = int(H / (tile_rows - overlap * (tile_rows - 1)))
    tile_w = int(W / (tile_cols - overlap * (tile_cols - 1)))

    stride_h = int(tile_h * (1-overlap))
    stride_w = int(tile_w * (1-overlap))

    all_boxes = []

    # -------------------------------------------------------
    # GRID TILES
    # -------------------------------------------------------
    for row in range(tile_rows):

        for col in range(tile_cols):

            y1_t = min(row * stride_h, H - tile_h)
            x1_t = min(col * stride_w, W - tile_w)

            y2_t = y1_t + tile_h
            x2_t = x1_t + tile_w

            tile = frame[y1_t:y2_t, x1_t:x2_t]

            for model in [model_n, model_s]:

                for b in predict_one(
                        model,
                        tile,
                        conf,
                        iou,
                        640,
                        device):

                    all_boxes.append((
                        b[0] + x1_t,
                        b[1] + y1_t,
                        b[2] + x1_t,
                        b[3] + y1_t,
                        b[4],
                        b[5]
                    ))

    # -------------------------------------------------------
    # EDGE STRIPS
    # -------------------------------------------------------
    for tile_img, x_off, y_off in get_edge_tiles(frame):

        for model in [model_n, model_s]:

            for b in predict_one(
                    model,
                    tile_img,
                    conf,
                    iou,
                    640,
                    device):

                all_boxes.append((
                    b[0] + x_off,
                    b[1] + y_off,
                    b[2] + x_off,
                    b[3] + y_off,
                    b[4],
                    b[5]
                ))

    # -------------------------------------------------------
    # FULL FRAME
    # -------------------------------------------------------
    for model, imgsz in [
        (model_n, 1280),
        (model_s, 1280)
    ]:

        for b in predict_one(
                model,
                frame,
                conf,
                iou,
                imgsz,
                device):

            all_boxes.append(b)

    return all_boxes


# ---------------------------------------------------------------
# NMS
# ---------------------------------------------------------------
def nms_boxes(boxes, iou_thresh=0.45):

    if not boxes:
        return []

    boxes_arr = np.array(
        [[b[0], b[1], b[2], b[3]] for b in boxes],
        dtype=np.float32
    )

    scores_arr = np.array(
        [b[4] for b in boxes],
        dtype=np.float32
    )

    indices = cv2.dnn.NMSBoxes(
        boxes_arr.tolist(),
        scores_arr.tolist(),
        0.05,
        iou_thresh
    )

    if len(indices) == 0:
        return []

    return [boxes[i] for i in indices.flatten()]