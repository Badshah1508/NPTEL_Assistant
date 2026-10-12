from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.services.question_generation.generator import QuestionGeneratorService

router = APIRouter()

@router.get("/{course_id}/weeks/{week_number}/questions")
def get_practice_questions(
    course_id: str,
    week_number: int,
    difficulty: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
):
    questions, shortage = QuestionGeneratorService.generate_50_weekly_questions(
        course_id=course_id,
        week_number=week_number,
    )

    if difficulty and difficulty != "all":
        questions = [q for q in questions if q.get("difficulty") == difficulty]

    if type and type != "all":
        questions = [q for q in questions if q.get("type") == type]

    return questions
