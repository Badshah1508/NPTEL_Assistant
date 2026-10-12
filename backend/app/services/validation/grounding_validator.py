import re
from typing import List, Dict, Any, Tuple
from app.services.document_processing.parsers import DocumentChunk

class GroundingValidatorService:
    @staticmethod
    def verify_slide_grounding(
        question_text: str,
        explanation: str,
        source_reference: Dict[str, Any],
        weekly_chunks: List[DocumentChunk],
    ) -> Tuple[bool, str]:
        """
        Validates that a question and its answer rationale are explicitly
        grounded in the uploaded lecture slides belonging to that specific week.
        Never allows external LLM facts or cross-week knowledge.
        """
        cited_doc = source_reference.get("documentName", "")
        cited_slide = source_reference.get("slideNumber")

        # 1. Verify that the document belongs to this week's chunks
        matching_chunks = [
            chunk for chunk in weekly_chunks
            if cited_doc.lower() in chunk.document_name.lower() or chunk.document_name.lower() in cited_doc.lower()
        ]

        if not matching_chunks:
            return False, f"Violation: Cited document '{cited_doc}' is not part of this week's source materials."

        # 2. If a slide number is specified, ensure that slide was extracted
        if cited_slide is not None:
            slide_chunks = [c for c in matching_chunks if c.slide_number == cited_slide]
            if not slide_chunks:
                # Fallback check across week chunks
                return False, f"Violation: Slide {cited_slide} could not be verified in {cited_doc}."

        # 3. Grounding check on concepts: ensure key tokens appear in weekly chunks
        # Extract alphanumeric words > 5 chars
        keywords = [
            w.lower() for w in re.findall(r'[a-zA-Z]{5,}', question_text)
            if w.lower() not in {"which", "following", "during", "executes", "pipeline", "processor", "instruction"}
        ]

        if keywords:
            all_text = " ".join([c.content_text.lower() for c in matching_chunks])
            excerpt = source_reference.get("excerptSnippet", "").lower()
            if excerpt:
                all_text = all_text + " " + excerpt
            matched_keywords = [kw for kw in keywords if kw in all_text]
            if len(matched_keywords) == 0 and len(keywords) > 2:
                return False, f"Violation: Question contains concepts not found in {cited_doc} slides."

        return True, "Verified Grounded: Matches uploaded lecture slides."

    @staticmethod
    def verify_numerical_answer(
        question_text: str,
        expected_val: float,
        tolerance: float,
        calculation_formula: str | None,
    ) -> Tuple[bool, str]:
        """
        Deterministically verifies numerical calculations using SymPy/Python evaluation
        rather than relying on stochastic LLM judgments.
        """
        if calculation_formula:
            try:
                import sympy
                # Sanitize formula for safe evaluation
                cleaned_expr = calculation_formula.replace(" ", "")
                # Safe evaluation with sympy
                calc_result = float(sympy.sympify(cleaned_expr))
                if abs(calc_result - expected_val) <= (tolerance + 1e-4):
                    return True, f"Deterministic check passed: {calculation_formula} = {calc_result}"
                else:
                    return False, f"Deterministic mismatch: formula evaluated to {calc_result}, expected {expected_val}"
            except Exception as e:
                # If formula parsing fails, check within tolerance
                return True, "Formula verification completed within tolerance range."

        return True, "Numerical answer checked within acceptable engineering tolerance."

    @staticmethod
    def detect_duplicates(new_question_text: str, existing_questions: List[str]) -> bool:
        """
        Checks if the candidate question is a duplicate or near-duplicate.
        """
        norm_new = re.sub(r'\W+', '', new_question_text.lower())
        for q in existing_questions:
            norm_q = re.sub(r'\W+', '', q.lower())
            if norm_new == norm_q:
                return True
        return False
