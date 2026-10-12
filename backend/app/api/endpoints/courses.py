from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.services.mockData import MOCK_COURSE_DATA

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_courses():
    return [MOCK_COURSE_DATA]

@router.get("/{course_id}", response_model=Dict[str, Any])
def get_course(course_id: str):
    return MOCK_COURSE_DATA
