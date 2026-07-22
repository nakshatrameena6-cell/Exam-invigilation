import cv2
import numpy as np
from collections import defaultdict

from .config import SMOOTH_WINDOW

# ---------------------------------------------------------------
# BOX SMOOTHING
# ---------------------------------------------------------------

box_history = defaultdict(list)


def smooth_box(track_id, new_box):
    h = box_history[track_id]

    h.append(new_box)

    if len(h) > SMOOTH_WINDOW:
        h.pop(0)

    return tuple(np.array(h).mean(axis=0).astype(int))


# ---------------------------------------------------------------
# TRACK COLOR
# ---------------------------------------------------------------

def id_color(tid):
    s = tid * 37 % 256

    return (
        int(s * 91 % 256),
        int(s * 53 % 256),
        int(s * 173 % 256),
    )


# ---------------------------------------------------------------
# DRAW DETECTIONS
# ---------------------------------------------------------------

def draw_detections(frame, tracked):

    for (x1, y1, x2, y2, conf, tid) in tracked:

        # Ignore very small detections
        if (x2 - x1) < 12 or (y2 - y1) < 16:
            continue

        x1, y1, x2, y2 = smooth_box(
            tid,
            (x1, y1, x2, y2)
        )

        color = id_color(tid)

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            color,
            2,
        )

        label = f"ID:{tid}  {conf:.2f}"

        (lw, lh), _ = cv2.getTextSize(
            label,
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            2,
        )

        cv2.rectangle(
            frame,
            (x1, y1 - lh - 10),
            (x1 + lw + 6, y1),
            color,
            -1,
        )

        cv2.putText(
            frame,
            label,
            (x1 + 3, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )

    return frame


# ---------------------------------------------------------------
# DRAW FOOTER
# ---------------------------------------------------------------

def draw_footer(frame, frame_count, people_count):

    h = frame.shape[0]

    cv2.putText(
        frame,
        f"Frame:{frame_count}  People:{people_count}",
        (10, h - 12),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (200, 200, 200),
        2,
        cv2.LINE_AA,
    )

    return frame