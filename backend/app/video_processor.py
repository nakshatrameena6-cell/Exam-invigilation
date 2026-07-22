import cv2

from config import (
    INPUT_VIDEO,
    OUTPUT_VIDEO,
    TILE_ROWS,
    TILE_COLS,
    OVERLAP,
    CONFIDENCE,
    IOU
)

from detector import (
    model_n,
    model_s,
    device,
    run_ensemble_tiled,
    nms_boxes
)

from tracker import SimpleTracker

from drawing import (
    draw_detections,
    draw_footer
)


def process_video(input_video=INPUT_VIDEO, output_video=OUTPUT_VIDEO):

    cap = cv2.VideoCapture(str(input_video))

    if not cap.isOpened():
        raise RuntimeError("Cannot open video file")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30

    ORIG_W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    ORIG_H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    out = cv2.VideoWriter(
        str(output_video),
        fourcc,
        fps,
        (ORIG_W, ORIG_H)
    )

    print(f"Video: {ORIG_W}x{ORIG_H} @ {fps:.1f}fps")

    tracker = SimpleTracker(
        max_lost=90,
        iou_thresh=0.22
    )

    frame_count = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        raw_boxes = run_ensemble_tiled(
            frame,
            model_n,
            model_s,
            device,
            tile_rows=TILE_ROWS,
            tile_cols=TILE_COLS,
            overlap=OVERLAP,
            conf=CONFIDENCE,
            iou=IOU
        )

        merged = nms_boxes(
            raw_boxes,
            iou_thresh=0.45
        )

        tracked = tracker.update(
            merged
        )

        frame = draw_detections(
            frame,
            tracked
        )

        frame = draw_footer(
            frame,
            frame_count,
            len(tracked)
        )

        out.write(frame)

    cap.release()

    out.release()

    print(
        f"Done! {frame_count} frames | Saved as {output_video}"
    )