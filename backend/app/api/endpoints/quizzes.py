from fastapi import APIRouter, Body
from typing import Dict, Any

router = APIRouter()

@router.post("/{course_id}/weeks/{week_number}/attempts")
def create_quiz_attempt(course_id: str, week_number: int, is_timed: bool = False):
    return {
        "id": "attempt-srv-01",
        "courseId": course_id,
        "weekNumber": week_number,
        "isTimed": is_timed,
        "timeLimitMinutes": 60,
        "isCompleted": False,
        "score": 0,
        "responses": {}
    }

@router.post("/{course_id}/weeks/{week_number}/attempts/{attempt_id}/submit")
def submit_quiz_attempt(course_id: str, week_number: int, attempt_id: str):
    return {
        "id": attempt_id,
        "isCompleted": True,
        "score": 44,
        "totalQuestions": 50,
        "accuracyPercentage": 88.0,
        "easyCorrect": 10,
        "mediumCorrect": 22,
        "advancedCorrect": 12,
        "completedAt": "2026-10-12T12:00:00Z"
    }
