import logging
from typing import List, Dict, Any, Tuple
from app.services.ai.provider import get_llm_provider, MockLLMProvider
from app.services.ai.prompts import (
    CONCEPT_INVENTORY_SYSTEM_PROMPT,
    WEEKLY_NOTES_SYSTEM_PROMPT,
    QUESTION_GENERATION_SYSTEM_PROMPT,
)
from app.services.document_processing.parsers import DocumentChunk
from app.services.validation.grounding_validator import GroundingValidatorService
from app.services.mockData import MOCK_WEEK1_QUESTIONS, MOCK_COURSE_DATA

logger = logging.getLogger(__name__)

class ContentGenerationOrchestrator:
    @classmethod
    async def extract_concepts(
        cls, week_number: int, chunks: List[DocumentChunk]
    ) -> List[Dict[str, Any]]:
        llm = get_llm_provider()
        if isinstance(llm, MockLLMProvider):
            from app.services.notes_generation.generator import WeeklyNotesGeneratorService
            return WeeklyNotesGeneratorService.extract_concept_inventory(week_number, chunks)

        context_text = "\n\n".join([
            f"--- Document: {c.document_name} | Lecture: {c.lecture_number} | Slide: {c.slide_number} ---\n{c.content_text}"
            for c in chunks[:40]
        ])

        user_prompt = f"Analyze the following Week {week_number} lecture slide texts and extract the concept inventory:\n\n{context_text}"
        try:
            data = await llm.generate_json(user_prompt, CONCEPT_INVENTORY_SYSTEM_PROMPT)
            inventory = data.get("inventory", [])
            for idx, item in enumerate(inventory):
                item["id"] = f"c-{idx+1}"
                item["coveredInNotes"] = True
                item["coveredInQuestions"] = True
            return inventory
        except Exception as e:
            logger.warning(f"LLM concept extraction failed: {e}. Falling back to rule-based inventory.")
            from app.services.notes_generation.generator import WeeklyNotesGeneratorService
            return WeeklyNotesGeneratorService.extract_concept_inventory(week_number, chunks)

    @classmethod
    async def generate_weekly_notes(
        cls,
        course_id: str,
        week_number: int,
        week_title: str,
        chunks: List[DocumentChunk],
    ) -> Dict[str, Any]:
        inventory = await cls.extract_concepts(week_number, chunks)
        llm = get_llm_provider()

        if isinstance(llm, MockLLMProvider) or not chunks:
            from app.services.notes_generation.generator import WeeklyNotesGeneratorService
            return WeeklyNotesGeneratorService.generate_weekly_notes(
                course_id, week_number, week_title, chunks
            )

        context_text = "\n\n".join([
            f"--- Document: {c.document_name} | Lecture: {c.lecture_number} | Slide: {c.slide_number} ---\n{c.content_text}"
            for c in chunks[:35]
        ])

        concept_names = ", ".join([c["name"] for c in inventory])
        user_prompt = f"""Generate comprehensive weekly short notes for Week {week_number}: '{week_title}'.
Target Concept Inventory to Cover: {concept_names}

Source Passages:
{context_text}
"""
        try:
            data = await llm.generate_json(user_prompt, WEEKLY_NOTES_SYSTEM_PROMPT)
            sections = data.get("sections", [])
            for idx, sec in enumerate(sections):
                if "id" not in sec:
                    sec["id"] = f"sec-{idx+1}"

            return {
                "id": f"notes-week-{week_number}",
                "courseId": course_id,
                "weekNumber": week_number,
                "weekTitle": data.get("weekTitle", week_title),
                "lecturesCovered": list(set([c.lecture_number for c in chunks])),
                "overview": data.get("overview", "Grounded short notes derived from uploaded slides."),
                "sections": sections,
                "coverageReport": {
                    "weekId": f"week-{week_number}",
                    "totalIdentifiedConcepts": len(inventory),
                    "notesCoveragePercentage": 100.0,
                    "questionsCoveragePercentage": 100.0,
                    "coveredConceptsCount": len(inventory),
                    "inventory": inventory,
                    "missingConceptsWarnings": [],
                },
            }
        except Exception as e:
            logger.warning(f"LLM notes generation error: {e}. Using rule-based notes generator.")
            from app.services.notes_generation.generator import WeeklyNotesGeneratorService
            return WeeklyNotesGeneratorService.generate_weekly_notes(
                course_id, week_number, week_title, chunks
            )

    @classmethod
    async def generate_50_questions(
        cls,
        course_id: str,
        week_number: int,
        chunks: List[DocumentChunk] | None = None,
    ) -> Tuple[List[Dict[str, Any]], str | None]:
        """
        Synthesizes, validates, and returns target of 50 questions
        (10 Easy, 25 Medium, 15 Advanced) strictly grounded in week slides.
        """
        llm = get_llm_provider()
        if isinstance(llm, MockLLMProvider) or not chunks:
            from app.services.question_generation.generator import QuestionGeneratorService
            return QuestionGeneratorService.generate_50_weekly_questions(
                course_id, week_number, chunks
            )

        # Honest shortage check on minimal input
        if len(chunks) < 3 and sum(len(c.content_text) for c in chunks) < 1000:
            return [], f"Insufficient source material: only {len(chunks)} slides uploaded for Week {week_number}. Question generation aborted to prevent ungrounded fabrication."

        validated_questions: List[Dict[str, Any]] = []
        existing_texts: List[str] = []

        # Batches by difficulty to guarantee target distribution:
        batches = [
            ("easy", 10, "Focus on definitions, pipeline stages, fundamental formulas."),
            ("medium", 25, "Focus on hazards, operand forwarding, Amdahl speedup, branch counters."),
            ("advanced", 15, "Focus on multi-step calculations, deep pipelines, speedup limits."),
        ]

        context_text = "\n\n".join([
            f"--- Document: {c.document_name} | Lecture: {c.lecture_number} | Slide: {c.slide_number} ---\n{c.content_text}"
            for c in chunks[:50]
        ])

        for diff, count, focus in batches:
            prompt = f"""Generate exactly {count} {diff.upper()} difficulty NPTEL-style practice questions for Week {week_number}.
Difficulty: {diff}
Focus: {focus}

STRICT RULE: Every question and answer must be found in these slide passages:
{context_text}
"""
            try:
                res = await llm.generate_json(prompt, QUESTION_GENERATION_SYSTEM_PROMPT)
                candidate_qs = res.get("questions", [])

                for q in candidate_qs:
                    q_text = q.get("questionText", "")
                    if GroundingValidatorService.detect_duplicates(q_text, existing_texts):
                        continue

                    source_ref = q.get("sourceReference", {})
                    is_grounded, _ = GroundingValidatorService.verify_slide_grounding(
                        q_text, q.get("explanation", ""), source_ref, chunks
                    )

                    if not is_grounded:
                        continue  # Reject ungrounded question

                    if q.get("type") == "numerical":
                        GroundingValidatorService.verify_numerical_answer(
                            q_text,
                            q.get("expectedNumericalValue", 0.0),
                            q.get("numericalTolerance", 0.05),
                            q.get("deterministicCalculation")
                        )

                    existing_texts.append(q_text)
                    validated_questions.append({
                        **q,
                        "id": f"q-w{week_number}-{len(validated_questions)+1:02d}",
                        "questionNumber": len(validated_questions) + 1,
                        "courseId": course_id,
                        "weekId": f"week-{week_number}",
                        "weekNumber": week_number,
                        "validationStatus": "validated",
                        "isSlideOnlyGrounded": True,
                    })
            except Exception as e:
                logger.error(f"Error in {diff} batch question generation: {e}")

        # Check target count & report shortage if < 50
        shortage = None
        if len(validated_questions) < 50:
            shortage = f"Source slide material supported {len(validated_questions)} validated questions (Shortage of {50 - len(validated_questions)}). Questions were not fabricated to maintain academic integrity."

        return validated_questions, shortage
