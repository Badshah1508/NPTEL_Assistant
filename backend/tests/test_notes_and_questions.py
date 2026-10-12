import pytest
from app.services.notes_generation.generator import WeeklyNotesGeneratorService
from app.services.question_generation.generator import QuestionGeneratorService
from app.services.document_processing.parsers import DocumentChunk

def test_weekly_notes_concept_inventory_and_coverage():
    chunks = [
        DocumentChunk(
            document_name="Week1_Lecture01_Fundamentals.pdf",
            lecture_number=1,
            slide_number=8,
            page_number=8,
            section_heading="Clock Period",
            content_text="Clock period is determined by maximum stage delay plus register overhead."
        ),
        DocumentChunk(
            document_name="Week1_Lecture02_Hazards.pptx",
            lecture_number=2,
            slide_number=27,
            page_number=None,
            section_heading="Load-Use Hazard",
            content_text="Load-use hazard requires a 1 cycle stall even with forwarding hardware."
        ),
    ]

    notes = WeeklyNotesGeneratorService.generate_weekly_notes(
        course_id="course-test-01",
        week_number=1,
        week_title="Pipelining, ILP, Hazards & Amdahl’s Law",
        chunks=chunks
    )

    assert notes["weekNumber"] == 1
    assert len(notes["sections"]) >= 5
    assert notes["coverageReport"]["notesCoveragePercentage"] == 100.0
    assert len(notes["coverageReport"]["inventory"]) >= 10
    # Verify KaTeX formulas are present in sections
    has_formula = any("$$" in s["contentMarkdown"] for s in notes["sections"])
    assert has_formula is True

def test_question_generator_targets_50_questions():
    doc_names = [
        "Week1_Lecture01_Fundamentals_of_Pipelining.pdf",
        "Week1_Lecture02_Hazards_and_Forwarding.pptx",
        "Week1_Lecture03_Amdahls_Law_and_Speedup.pdf",
        "Week1_Lecture04_Dynamic_Branch_Prediction.docx",
    ]
    chunks = [
        DocumentChunk(
            document_name=doc,
            lecture_number=lec + 1,
            slide_number=s,
            page_number=s,
            section_heading=f"Topic {s}",
            content_text="Detailed comprehensive high-performance computer architecture lecture content discussing pipelining, hazards, and Amdahl's Law." * 10
        )
        for lec, doc in enumerate(doc_names) for s in range(1, 50)
    ]

    questions, shortage = QuestionGeneratorService.generate_50_weekly_questions(
        course_id="course-test-01",
        week_number=1,
        chunks=chunks
    )

    # Exactly 50 questions target
    assert len(questions) == 50

    easy_q = [q for q in questions if q["difficulty"] == "easy"]
    medium_q = [q for q in questions if q["difficulty"] == "medium"]
    advanced_q = [q for q in questions if q["difficulty"] == "advanced"]

    assert len(easy_q) == 10
    assert len(medium_q) == 25
    assert len(advanced_q) == 15

    # Every question must have sourceReference and explanation
    for q in questions:
        assert "sourceReference" in q
        assert "documentName" in q["sourceReference"]
        assert len(q["explanation"]) > 10
        assert q["isSlideOnlyGrounded"] is True

def test_shortage_warning_on_empty_slides():
    empty_chunks = [
        DocumentChunk(
            document_name="Brief.pdf",
            lecture_number=1,
            slide_number=1,
            page_number=1,
            section_heading="Title",
            content_text="Short"
        )
    ]

    questions, shortage = QuestionGeneratorService.generate_50_weekly_questions(
        course_id="course-test-01",
        week_number=1,
        chunks=empty_chunks
    )

    assert shortage is not None
    assert "Insufficient slide material" in shortage
