import pytest
from app.services.ai.provider import get_llm_provider, MockLLMProvider
from app.services.ai.orchestrator import ContentGenerationOrchestrator
from app.services.document_processing.parsers import DocumentChunk

@pytest.mark.asyncio
async def test_ai_provider_resolution():
    provider = get_llm_provider()
    assert provider is not None

@pytest.mark.asyncio
async def test_concept_extraction_orchestration():
    chunks = [
        DocumentChunk(
            document_name="Week1_Lecture01_Fundamentals.pdf",
            lecture_number=1,
            slide_number=6,
            page_number=6,
            section_heading="RISC Stages",
            content_text="Five stages of pipelining: IF, ID, EX, MEM, WB."
        )
    ]
    inventory = await ContentGenerationOrchestrator.extract_concepts(1, chunks)
    assert len(inventory) >= 5
    assert any("Pipeline" in c["name"] for c in inventory)

@pytest.mark.asyncio
async def test_notes_generation_orchestration():
    notes = await ContentGenerationOrchestrator.generate_weekly_notes(
        course_id="c-test",
        week_number=1,
        week_title="Pipelining & Hazards",
        chunks=[]
    )
    assert notes["weekNumber"] == 1
    assert len(notes["sections"]) >= 4
    assert notes["coverageReport"]["notesCoveragePercentage"] == 100.0

@pytest.mark.asyncio
async def test_50_questions_orchestration():
    questions, shortage = await ContentGenerationOrchestrator.generate_50_questions(
        course_id="c-test",
        week_number=1,
        chunks=None
    )
    assert len(questions) == 50
    assert len([q for q in questions if q["difficulty"] == "easy"]) == 10
    assert len([q for q in questions if q["difficulty"] == "medium"]) == 25
    assert len([q for q in questions if q["difficulty"] == "advanced"]) == 15
