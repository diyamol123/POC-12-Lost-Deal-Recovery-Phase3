"""Approved deterministic query functions for the Phase 3 assistant.

This module intentionally contains no LLM calls, arbitrary SQL, executable
user input, or unrestricted data access. Every query reads only the approved
Track A intelligence package exposed by the existing Post #4 backend loader.
"""

from __future__ import annotations

from typing import Any

from backend.main import _load_intelligence_package

from .errors import (
    AssistantNotFoundError,
    AssistantValidationError,
)

MAX_RESULTS = 25
MAX_EVIDENCE_REFS = 10
MAX_EVIDENCE_EXCERPT = 300
APPROVED_TRACK = "Track A — Comparative Intelligence"


def _package() -> tuple[list[dict[str, Any]], dict[str, Any], dict[str, Any]]:
    results, summary, validation = _load_intelligence_package()

    if summary.get("approved_track") != APPROVED_TRACK:
        raise AssistantValidationError("Unsupported analytical track.")
    if validation.get("validation_result") != "PASS" or validation.get("passed") is not True:
        raise AssistantValidationError("Validation output is not approved.")
    if summary.get("data_version") != validation.get("data_version"):
        raise AssistantValidationError("Data version mismatch.")
    if summary.get("method_version") != validation.get("method_version"):
        raise AssistantValidationError("Method version mismatch.")

    return results, summary, validation


def _metadata(summary: dict[str, Any], validation: dict[str, Any]) -> dict[str, Any]:
    return {
        "data_version": summary["data_version"],
        "method_version": summary["method_version"],
        "generated_at": summary["generated_at"],
        "quality_status": "validated" if validation.get("passed") else "invalid",
        "approved_track": summary["approved_track"],
    }


def _evidence(result: dict[str, Any]) -> dict[str, Any]:
    source = result["evidence"]
    record_ids = list(source.get("record_ids", []))[:MAX_EVIDENCE_REFS]
    return {
        "record_count": source["record_count"],
        "average_deal_value": source["average_deal_value"],
        "contribution_pct": source["contribution_pct"],
        "record_ids": record_ids,
        "reference": result["result_id"],
    }


def _result_payload(result: dict[str, Any]) -> dict[str, Any]:
    return {
        "result_id": result["result_id"],
        "group_key": result["group_key"],
        "result_value": result["result_value"],
        "result_unit": result["result_unit"],
        "result_category": result["result_category"],
        "priority_rank": result["priority_rank"],
        "finding": result["finding"],
        "evidence": _evidence(result),
        "limitation": result["limitation"],
    }


def _normalise_group(group_key: str) -> str:
    if not isinstance(group_key, str):
        raise AssistantValidationError("group_key must be text.")
    value = " ".join(group_key.strip().split())
    if not value or len(value) > 100:
        raise AssistantValidationError("group_key is invalid.")
    return value.casefold()


def _find_group(results: list[dict[str, Any]], group_key: str) -> dict[str, Any]:
    target = _normalise_group(group_key)
    for result in results:
        if result["group_key"].casefold() == target:
            return result
    raise AssistantNotFoundError(f"Supported category not found: {group_key}")


def _validate_limit(limit: int) -> int:
    if isinstance(limit, bool) or not isinstance(limit, int):
        raise AssistantValidationError("limit must be an integer.")
    if limit < 1 or limit > MAX_RESULTS:
        raise AssistantValidationError(f"limit must be between 1 and {MAX_RESULTS}.")
    return limit


def get_top_category() -> dict[str, Any]:
    results, summary, validation = _package()
    ordered = sorted(results, key=lambda item: (item["priority_rank"], item["group_key"]))
    if not ordered:
        raise AssistantNotFoundError("No approved intelligence results are available.")
    result = ordered[0]
    return {
        "intent": "top_category",
        "parameters": {},
        "result": _result_payload(result),
        "evidence": [_evidence(result)],
        "metadata": _metadata(summary, validation),
        "limitation": result["limitation"],
    }


def get_top_categories(limit: int = 5) -> dict[str, Any]:
    limit = _validate_limit(limit)
    results, summary, validation = _package()
    ordered = sorted(results, key=lambda item: (item["priority_rank"], item["group_key"]))[:limit]
    payload = [_result_payload(result) for result in ordered]
    return {
        "intent": "top_categories",
        "parameters": {"limit": limit},
        "results": payload,
        "evidence": [_evidence(result) for result in ordered[:MAX_EVIDENCE_REFS]],
        "metadata": _metadata(summary, validation),
        "limitation": summary["important_limitations"][-1],
    }


def get_category_rank(group_key: str) -> dict[str, Any]:
    results, summary, validation = _package()
    result = _find_group(results, group_key)
    return {
        "intent": "category_rank",
        "parameters": {"group_key": result["group_key"]},
        "result": _result_payload(result),
        "evidence": [_evidence(result)],
        "metadata": _metadata(summary, validation),
        "limitation": result["limitation"],
    }


def get_category_explanation(group_key: str) -> dict[str, Any]:
    results, summary, validation = _package()
    result = _find_group(results, group_key)
    return {
        "intent": "category_explanation",
        "parameters": {"group_key": result["group_key"]},
        "result": {
            "group_key": result["group_key"],
            "priority_rank": result["priority_rank"],
            "result_value": result["result_value"],
            "contribution_pct": result["evidence"]["contribution_pct"],
            "record_count": result["evidence"]["record_count"],
            "finding": result["finding"],
        },
        "evidence": [_evidence(result)],
        "metadata": _metadata(summary, validation),
        "limitation": result["limitation"],
    }


def get_category_evidence(group_key: str) -> dict[str, Any]:
    results, summary, validation = _package()
    result = _find_group(results, group_key)
    return {
        "intent": "category_evidence",
        "parameters": {"group_key": result["group_key"]},
        "result": _result_payload(result),
        "evidence": [_evidence(result)],
        "metadata": _metadata(summary, validation),
        "limitation": result["limitation"],
    }


def compare_categories(group_key_a: str, group_key_b: str) -> dict[str, Any]:
    results, summary, validation = _package()
    first = _find_group(results, group_key_a)
    second = _find_group(results, group_key_b)

    if first["group_key"].casefold() == second["group_key"].casefold():
        raise AssistantValidationError("Comparison requires two different categories.")

    ordered = sorted(
        [first, second],
        key=lambda item: (item["priority_rank"], item["group_key"]),
    )
    return {
        "intent": "compare_categories",
        "parameters": {
            "group_key_a": first["group_key"],
            "group_key_b": second["group_key"],
        },
        "results": [_result_payload(result) for result in ordered],
        "evidence": [_evidence(first), _evidence(second)],
        "metadata": _metadata(summary, validation),
        "limitation": summary["important_limitations"][-1],
    }


def get_analysis_limitations() -> dict[str, Any]:
    _, summary, validation = _package()
    limitations = list(summary.get("important_limitations", []))
    return {
        "intent": "analysis_limitations",
        "parameters": {},
        "results": limitations,
        "evidence": [],
        "metadata": _metadata(summary, validation),
        "limitation": "These are the documented limitations of the approved descriptive analysis.",
    }


def get_package_versions() -> dict[str, Any]:
    _, summary, validation = _package()
    return {
        "intent": "package_versions",
        "parameters": {},
        "result": {
            "data_version": summary["data_version"],
            "method_version": summary["method_version"],
            "generated_at": summary["generated_at"],
            "quality_status": "validated" if validation.get("passed") else "invalid",
            "approved_track": summary["approved_track"],
        },
        "evidence": [],
        "metadata": _metadata(summary, validation),
        "limitation": "Version metadata describes the approved intelligence package currently loaded.",
    }


def get_validation_status() -> dict[str, Any]:
    _, summary, validation = _package()
    return {
        "intent": "validation_status",
        "parameters": {},
        "result": {
            "validation_result": validation["validation_result"],
            "passed": validation["passed"],
            "record_count": validation.get("record_count"),
            "primary_group_count": validation.get("primary_group_count"),
            "minimum_group_size": validation.get("minimum_group_size"),
            "contribution_total_percent": validation.get("contribution_total_percent"),
            "small_groups_at_threshold": validation.get("small_groups_at_threshold", []),
        },
        "evidence": [],
        "metadata": _metadata(summary, validation),
        "limitation": "Validation status describes the approved deterministic intelligence package; it does not establish causality.",
    }
