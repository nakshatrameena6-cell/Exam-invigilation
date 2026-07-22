from pathlib import Path

# ---------------------------------------------------
# PROJECT PATHS
# ---------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_DIR = BASE_DIR / "input"
OUTPUT_DIR = BASE_DIR / "output"
WEIGHTS_DIR = BASE_DIR / "weights"

# ---------------------------------------------------
# MODEL FILES
# ---------------------------------------------------

YOLO_N_MODEL = WEIGHTS_DIR / "yolov26n.pt"
YOLO_S_MODEL = WEIGHTS_DIR / "yolov26s.pt"

# ---------------------------------------------------
# VIDEO FILES
# ---------------------------------------------------

INPUT_VIDEO = INPUT_DIR / "BACKVIEW.mp4"
OUTPUT_VIDEO = OUTPUT_DIR / "output_v2.mp4"

# ---------------------------------------------------
# DETECTION PARAMETERS
# ---------------------------------------------------

CONFIDENCE = 0.07
IOU = 0.30

TILE_ROWS = 3
TILE_COLS = 4
OVERLAP = 0.40

MAX_LOST = 90
TRACK_IOU = 0.22

SMOOTH_WINDOW = 4