from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/{course_id}")
def get_analytics(course_id: str):
    return {
        "totalQuizzesTaken": 4,
        "averageScorePercentage": 85.0,
        "totalQuestionsAttempted": 180,
        "overallAccuracyPercentage": 85.0,
        "accuracyByDifficulty": {
            "easy": 95.0,
            "medium": 84.0,
            "advanced": 76.0
        },
        "weakTopics": [
            {
                "topic": "Load-Use Data Hazard & Inevitable Stalls",
                "accuracyPercentage": 62.5,
                "recommendedWeek": 1,
                "missedQuestionsCount": 4
            },
            {
                "topic": "Amdahl's Law Multi-core Speedup Calculation",
                "accuracyPercentage": 70.0,
                "recommendedWeek": 1,
                "missedQuestionsCount": 3
            }
        ]
    }
