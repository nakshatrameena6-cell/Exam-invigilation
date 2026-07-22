import uuid
import json
from pathlib import Path
from typing import Dict, Any

from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

BASE_DIR = Path(__file__).resolve().parent

from app.video_processor import process_video, create_dummy_video
from app.config import INPUT_DIR, OUTPUT_DIR

app = FastAPI(
    title="AI Exam Invigilation API",
    description="Backend API for student detection, tracking, and exam violation monitoring",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database to store task statuses
tasks_db: Dict[str, Dict[str, Any]] = {}

def run_invigilation_task(task_id: str, input_path: Path, output_path: Path):
    """Background runner for video invigilation process."""
    tasks_db[task_id] = {
        "task_id": task_id,
        "video_name": input_path.name,
        "progress": 0.0,
        "status": "processing",
        "active_students": 0,
        "violations_count": 0,
        "frame": 0,
        "total_frames": 0,
        "error": None,
        "results": None
    }
    
    def progress_hook(data: dict):
        if data.get("status") == "processing":
            tasks_db[task_id].update({
                "progress": data["progress"],
                "active_students": data.get("active_students", 0),
                "violations_count": data.get("violations_count", 0),
                "frame": data.get("frame", 0),
                "total_frames": data.get("total_frames", 0)
            })
        elif data.get("status") == "completed":
            tasks_db[task_id].update({
                "progress": 100.0,
                "status": "completed",
                "results": data.get("results")
            })

    try:
        # Run processing
        process_video(
            input_video=input_path,
            output_video=output_path,
            task_id=task_id,
            progress_callback=progress_hook
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        tasks_db[task_id].update({
            "status": "failed",
            "progress": 0.0,
            "error": str(e)
        })


@app.get("/")
def read_root():
    return {
        "service": "AI Exam Invigilation System",
        "status": "online",
        "version": "1.0.0"
    }


@app.post("/api/upload")
def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Uploads an exam video and kicks off background invigilation."""
    # Ensure input and output directories exist
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    task_id = str(uuid.uuid4())
    file_ext = Path(file.filename).suffix or ".mp4"
    input_path = INPUT_DIR / f"{task_id}{file_ext}"
    output_path = OUTPUT_DIR / f"{task_id}_processed.mp4"
    
    # Save the uploaded file
    try:
        with open(input_path, "wb") as buffer:
            buffer.write(file.file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")
        
    # Start task in background thread
    background_tasks.add_task(run_invigilation_task, task_id, input_path, output_path)
    
    return {
        "task_id": task_id,
        "status": "queued",
        "video_name": file.filename
    }


@app.post("/api/test-invigilation")
def test_invigilation(background_tasks: BackgroundTasks):
    """Triggers invigilation on the default simulated classroom video."""
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    task_id = "test-sim-session"
    input_path = INPUT_DIR / "BACKVIEW.mp4"
    output_path = OUTPUT_DIR / f"{task_id}_processed.mp4"
    
    # Start task in background thread
    background_tasks.add_task(run_invigilation_task, task_id, input_path, output_path)
    
    return {
        "task_id": task_id,
        "status": "queued",
        "video_name": "BACKVIEW.mp4 (Simulation)"
    }


@app.get("/api/tasks")
def list_tasks():
    """Lists current state of all tasks."""
    return tasks_db


@app.get("/api/status/{task_id}")
def get_status(task_id: str):
    """Gets real-time progress / status of a specific invigilation task."""
    if task_id not in tasks_db:
        # Check if report files already exist on disk (offline lookup)
        report_json = OUTPUT_DIR / f"{task_id}_processed_report.json"
        if report_json.exists():
            try:
                with open(report_json, "r") as f:
                    data = json.load(f)
                return {
                    "task_id": task_id,
                    "status": "completed",
                    "progress": 100.0,
                    "results": data
                }
            except:
                pass
        raise HTTPException(status_code=404, detail="Invigilation task not found")
    return tasks_db[task_id]


@app.get("/api/results/{task_id}")
def get_results(task_id: str):
    """Retrieves full invigilation results and violation metrics."""
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task = tasks_db[task_id]
    if task["status"] != "completed":
        return JSONResponse(
            status_code=202,
            content={"status": task["status"], "progress": task["progress"]}
        )
        
    return task["results"]


@app.get("/api/video/{task_id}")
def get_processed_video(task_id: str):
    """Streams/downloads the annotated output video."""
    video_path = OUTPUT_DIR / f"{task_id}_processed.mp4"
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Processed video file not found")
    return FileResponse(video_path, media_type="video/mp4")


@app.get("/api/report/{task_id}/download")
def download_text_report(task_id: str):
    """Downloads the formatted textual classroom invigilation report."""
    report_path = OUTPUT_DIR / f"{task_id}_processed_report.txt"
    if not report_path.exists():
        raise HTTPException(status_code=404, detail="Text report file not found")
    return FileResponse(
        report_path, 
        media_type="text/plain", 
        filename=f"exam_report_{task_id}.txt"
    )


if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI Backend Server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)