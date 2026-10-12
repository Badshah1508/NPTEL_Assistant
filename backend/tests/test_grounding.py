import pytest
from app.services.validation.grounding_validator import GroundingValidatorService
from app.services.document_processing.parsers import DocumentChunk

def test_verify_slide_grounding_valid():
    chunk = DocumentChunk(
        document_name="Week1_Lecture01_Fundamentals.pdf",
        lecture_number=1,
        slide_number=7,
        page_number=7,
        section_heading="Instruction Fetch",
        content_text="The Instruction Fetch (IF) stage reads instructions from memory using PC and updates PC = PC + 4."
    )

    source_ref = {
        "documentName": "Week1_Lecture01_Fundamentals.pdf",
        "lectureNumber": 1,
        "slideNumber": 7,
        "excerptSnippet": "IF Stage reads instruction from memory."
    }

    is_grounded, msg = GroundingValidatorService.verify_slide_grounding(
        question_text="Which stage reads instruction from memory in 5-stage RISC pipeline?",
        explanation="The IF stage fetches instruction from memory.",
        source_reference=source_ref,
        weekly_chunks=[chunk]
    )

    assert is_grounded is True
    assert "Verified Grounded" in msg

def test_verify_slide_grounding_rejects_missing_document():
    chunk = DocumentChunk(
        document_name="Week1_Lecture01_Fundamentals.pdf",
        lecture_number=1,
        slide_number=7,
        page_number=7,
        section_heading="Instruction Fetch",
        content_text="Some text"
    )

    # Document from a different week or external source
    source_ref = {
        "documentName": "External_Textbook_Chapter_4.pdf",
        "lectureNumber": 4,
        "slideNumber": 10,
        "excerptSnippet": "External facts."
    }

    is_grounded, msg = GroundingValidatorService.verify_slide_grounding(
        question_text="External question?",
        explanation="External explanation.",
        source_reference=source_ref,
        weekly_chunks=[chunk]
    )

    assert is_grounded is False
    assert "Violation" in msg

def test_verify_numerical_answer_deterministic():
    # Amdahl speedup: 1 / (0.25 + 0.75 / 6) = 2.6667
    is_valid, msg = GroundingValidatorService.verify_numerical_answer(
        question_text="What is speedup on 6 cores with p = 0.75?",
        expected_val=2.67,
        tolerance=0.03,
        calculation_formula="1.0 / (0.25 + 0.75 / 6.0)"
    )

    assert is_valid is True

def test_duplicate_detection():
    existing = [
        "What is the ideal Cycles Per Instruction (CPI) of an in-order scalar pipeline?",
        "Explain Amdahl's Law speedup."
    ]

    is_dup = GroundingValidatorService.detect_duplicates(
        "What is the ideal Cycles Per Instruction (CPI) of an in-order scalar pipeline?",
        existing
    )
    assert is_dup is True

    is_not_dup = GroundingValidatorService.detect_duplicates(
        "What is Gustafson's Law?",
        existing
    )
    assert is_not_dup is False
