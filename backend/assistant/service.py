"""Grounded deterministic assistant service.

Execution order:
scope validation -> deterministic intent routing -> approved query
function -> grounded response contract.

No LLM calls, arbitrary SQL, arbitrary code execution, or unrestricted
record access are permitted here.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from .errors import AssistantNotFoundError, AssistantValidationError
from .queries import (
    compare_categories,
    get_analysis_limitations,
    get_category_evidence,
    get_category_explanation,
    get_category_rank,
    get_package_versions,
    get_top_categories,
    get_top_category,
    get_validation_status,
)
from .router import classify_question
from .gemini_explanation import GeminiExplanationError, explain_deterministic_result

QUERY_FUNCTIONS = {
    "top_category": get_top_category,
    "top_categories": get_top_categories,
    "category_rank": get_category_rank,
    "category_explanation": get_category_explanation,
    "category_evidence": get_category_evidence,
    "compare_categories": compare_categories,
    "analysis_limitations": get_analysis_limitations,
    "package_versions": get_package_versions,
    "validation_status": get_validation_status,
}


def _build_answer(result: dict[str, Any]) -> str:
    """Build a grounded answer using only deterministic query output."""

    nested = result.get("result")
    if isinstance(nested, dict) and "finding" in nested:
        return str(nested["finding"])

    if "finding" in result:
        return str(result["finding"])

    if "results" in result:
        return "The requested comparative intelligence results are shown in the evidence and key values."

    if "limitation" in result and result.get("result_category") == "limitations":
        return str(result["limitation"])

    if "result_value" in result:
        value = result["result_value"]
        unit = result.get("result_unit", "")
        category = result.get("result_category", "")
        if category:
            return f"{category}: {value}{unit}"
        return f"{value}{unit}"

    if "validation_result" in result:
        return str(result["validation_result"])

    return "The requested grounded intelligence result is available in the evidence package."


def _extract_key_values(result: dict[str, Any]) -> dict[str, Any]:
    """Expose only values already returned by the deterministic query."""

    allowed = (
        "result_id",
        "group_key",
        "result_value",
        "result_unit",
        "result_category",
        "priority_rank",
        "record_count",
        "average_deal_value",
        "contribution_pct",
        "data_version",
        "method_version",
        "validation_result",
        "quality_status",
    )

    return {
        key: result[key]
        for key in allowed
        if key in result
    }


def _extract_evidence_references(result: dict[str, Any]) -> list[Any]:
    """Return deterministic evidence references without inventing references."""

    evidence = result.get("evidence", [])

    if not isinstance(evidence, list):
        return []

    references: list[Any] = []

    for item in evidence[:10]:
        if isinstance(item, dict):
            reference = item.get("reference") or item.get("record_ids")
            if reference is not None:
                references.append(reference)
        elif isinstance(item, str):
            references.append(item)

    return references


def _extract_follow_ups(intent: str) -> list[str]:
    """Return bounded deterministic follow-up suggestions."""

    follow_ups = {
        "top_category": [
            "Ask for the top lost-deal categories.",
            "Ask why the top category has its current rank.",
            "Ask what evidence supports the result."
        ],
        "top_categories": [
            "Compare two categories.",
            "Ask for the ranking of a category.",
            "Ask what limitations apply."
        ],
        "category_rank": [
            "Ask why the category has this rank.",
            "Ask for evidence supporting the category.",
            "Compare it with another category."
        ],
        "category_explanation": [
            "Ask for the evidence supporting the category.",
            "Compare the category with another category.",
            "Ask about the analysis limitations."
        ],
        "category_evidence": [
            "Ask for the category ranking.",
            "Ask why the category has its current rank.",
            "Compare it with another category."
        ],
        "compare_categories": [
            "Ask for the ranking of either category.",
            "Ask for evidence supporting a category.",
            "Ask about the analysis limitations."
        ],
        "analysis_limitations": [
            "Ask for the current data and method versions.",
            "Ask for the validation status.",
            "Ask for the top lost-deal category."
        ],
        "package_versions": [
            "Ask for the validation status.",
            "Ask about the analysis limitations.",
            "Ask for the top lost-deal category."
        ],
        "validation_status": [
            "Ask for the current data and method versions.",
            "Ask about the analysis limitations.",
            "Ask for the top lost-deal category."
        ],
    }

    return follow_ups.get(intent, [])[:3]


def _numeric_values(value: Any) -> set[float]:
    """Extract numeric values from grounded data for fidelity checking."""

    import re

    if isinstance(value, bool) or value is None:
        return set()

    if isinstance(value, (int, float)):
        return {float(value)}

    if isinstance(value, dict):
        numbers: set[float] = set()
        for item in value.values():
            numbers.update(_numeric_values(item))
        return numbers

    if isinstance(value, (list, tuple)):
        numbers: set[float] = set()
        for item in value:
            numbers.update(_numeric_values(item))
        return numbers

    if isinstance(value, str):
        numbers: set[float] = set()
        for match in re.findall(r"(?<![A-Za-z])[-+]?\d[\d,]*(?:\.\d+)?", value):
            try:
                numbers.add(float(match.replace(",", "")))
            except ValueError:
                continue
        return numbers

    return set()


def _has_numeric_fidelity(
    explanation: str,
    *,
    result: dict[str, Any],
    metadata: dict[str, Any],
    limitation: str,
) -> bool:
    """Reject explanations containing numeric values absent from grounded data."""

    allowed_numbers = (
        _numeric_values(result)
        | _numeric_values(metadata)
        | _numeric_values(limitation)
    )

    explanation_numbers = _numeric_values(explanation)

    return all(
        any(abs(number - allowed) <= max(1e-9, abs(allowed) * 1e-9) for allowed in allowed_numbers)
        for number in explanation_numbers
    )


def answer_question(question: str) -> dict[str, Any]:
    """Return a grounded response that follows the approved response contract."""

    match = classify_question(question)

    query_function = QUERY_FUNCTIONS.get(match.intent)
    if query_function is None:
        raise AssistantValidationError(
            "This question is outside the approved assistant question catalog."
        )

    result = query_function(**match.parameters)

    if not isinstance(result, dict):
        raise AssistantValidationError(
            "The deterministic query returned an invalid response package."
        )

    metadata = result.get("metadata", {})
    if not isinstance(metadata, dict):
        raise AssistantValidationError(
            "The deterministic query returned invalid metadata."
        )

    limitation = str(
        result.get(
            "limitation",
            "Results are descriptive and subject to the limitations of the approved intelligence package.",
        )
    )

    try:
        gemini_explanation = explain_deterministic_result(
            question=question,
            intent=match.intent,
            result=result,
            evidence_references=_extract_evidence_references(result),
            metadata=metadata,
            limitation=limitation,
        )
        if not _has_numeric_fidelity(
            gemini_explanation,
            result=result,
            metadata=metadata,
            limitation=limitation,
        ):
            raise GeminiExplanationError(
                "Gemini explanation failed numeric grounding validation."
            )

        explanation_status = "AVAILABLE"
    except GeminiExplanationError:
        gemini_explanation = (
            "Gemini explanation is currently unavailable. "
            "The deterministic result remains authoritative."
        )
        explanation_status = "UNAVAILABLE"

    return {
        "answer_id": f"assistant-{uuid4().hex}",
        "status": "SUPPORTED",
        "intent": match.intent,
        "answer": _build_answer(result),
        "evidence_references": _extract_evidence_references(result),
        "key_values": _extract_key_values(result),
        "metadata": metadata,
        "limitation": str(limitation),
        "gemini_explanation": gemini_explanation,
        "explanation_status": explanation_status,
        "suggested_follow_ups": _extract_follow_ups(match.intent),
        "parameters": match.parameters,
        "result": result if "results" not in result else None,
        "results": result.get("results"),
        "scope_status": "SUPPORTED",
        "confidence": match.confidence,
    }


__all__ = [
    "QUERY_FUNCTIONS",
    "answer_question",
    "AssistantNotFoundError",
    "AssistantValidationError",
]
