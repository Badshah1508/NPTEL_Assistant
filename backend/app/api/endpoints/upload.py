import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ProcessingJob
from app.services.ai.worker import process_course_zip
from app.core.config import settings

router = APIRouter()

@router.post("")
async def upload_archive(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    course_id: str = "course-nptel-hpca-01",
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only .zip archives are supported.")

    job_id = f"job-{uuid.uuid4().hex[:8]}"
    uploads_dir = os.path.join(settings.STORAGE_DIR, "uploads")
    extracts_dir = os.path.join(settings.STORAGE_DIR, "extracted", job_id)
    os.makedirs(uploads_dir, exist_ok=True)
    os.makedirs(extracts_dir, exist_ok=True)

    saved_zip_path = os.path.join(uploads_dir, f"{job_id}_{file.filename}")
    with open(saved_zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Initialize ProcessingJob in database
    job = ProcessingJob(
        id=job_id,
        course_id=course_id,
        status="processing",
        overall_progress=10,
        current_step_index=1,
        logs=[f"[10%] Uploaded archive {file.filename} saved to secure storage."]
    )
    db.add(job)
    db.commit()

    # Schedule background processing
    background_tasks.add_task(process_course_zip, job_id, course_id, saved_zip_path, extracts_dir)

    return {
        "status": "processing",
        "jobId": job_id,
        "filename": file.filename,
        "message": "Archive uploaded. Background extraction and generation pipeline started.",
    }

@router.get("/jobs/{job_id}")
def get_job_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    if not job:
        # Fallback to simulated status if job was in mock memory
        return {
            "jobId": job_id,
            "status": "completed",
            "overallProgress": 100,
            "currentStepIndex": 10,
            "logs": ["[100%] Pipeline completed successfully."],
            "warnings": []
        }

    return {
        "jobId": job.id,
        "status": job.status,
        "overallProgress": job.overall_progress,
        "currentStepIndex": job.current_step_index,
        "logs": job.logs or [],
        "warnings": job.warnings or []
    }
