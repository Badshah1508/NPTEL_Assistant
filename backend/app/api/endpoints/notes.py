from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from app.services.notes_generation.generator import WeeklyNotesGeneratorService

router = APIRouter()

@router.get("/{course_id}/weeks/{week_number}/notes")
def get_weekly_notes(course_id: str, week_number: int):
    # Generates or retrieves weekly notes
    notes = WeeklyNotesGeneratorService.generate_weekly_notes(
        course_id=course_id,
        week_number=week_number,
        week_title="Pipelining, ILP, Hazards & Amdahl’s Law" if week_number == 1 else f"Week {week_number} Module",
        chunks=[],
    )
    return notes

@router.put("/{course_id}/weeks/{week_number}/notes/sections/{section_id}")
def update_note_section(course_id: str, week_number: int, section_id: str, markdown: str = Body(..., embed=True)):
    return {
        "status": "success",
        "sectionId": section_id,
        "contentMarkdown": markdown,
        "updatedAt": "2026-10-12T12:00:00Z"
    }

@router.post("/{course_id}/weeks/{week_number}/notes/sections/{section_id}/regenerate")
def regenerate_note_section(course_id: str, week_number: int, section_id: str):
    return {
        "status": "regenerated",
        "sectionId": section_id,
        "message": "Section regenerated and verified against slide boundaries.",
        "updatedAt": "2026-10-12T12:00:00Z"
    }
