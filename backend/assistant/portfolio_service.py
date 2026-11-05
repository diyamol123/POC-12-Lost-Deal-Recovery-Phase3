"""Independent grounded assistant for the 500-record portfolio experiment."""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from uuid import uuid4
from typing import Any

from .scope import check_scope
from .errors import AssistantValidationError
from .gemini_explanation import (
    GeminiExplanationError,
    explain_deterministic_result,
)

logger = logging.getLogger(__name__)

OUTPUT_DIR = (
    Path(__file__).resolve().parents[1]
    / "portfolio-experiment"
    / "outputs"
)

LIMITATION = (
    "Synthetic descriptive analysis only; does not establish "
    "causality or guaranteed revenue recovery."
)


def _load_package():
    comparative = json.loads(
        (OUTPUT_DIR / "comparative_intelligence.json").read_text()
    )
    baseline = json.loads(
        (OUTPUT_DIR / "baseline_results.json").read_text()
    )

    if comparative.get("data_version") != "portfolio-synth-v1.0.0":
        raise AssistantValidationError("Portfolio data version is invalid.")

    if baseline.get("baseline_record_count") != 500:
        raise AssistantValidationError("Portfolio baseline validation failed.")

    if len(comparative.get("groups", [])) != 5:
        raise AssistantValidationError("Portfolio category validation failed.")

    return comparative, baseline


def _numbers(value: Any) -> set[float]:
    if isinstance(value, bool) or value is None:
        return set()
    if isinstance(value, (int, float)):
        return {float(value)}
    if isinstance(value, dict):
        return set().union(*(_numbers(v) for v in value.values()))
    if isinstance(value, (list, tuple)):
        return set().union(*(_numbers(v) for v in value)) if value else set()
    if isinstance(value, str):
        found = set()
        for item in re.findall(r"(?<![A-Za-z])[-+]?\d[\d,]*(?:\.\d+)?", value):
            try:
                found.add(float(item.replace(",", "")))
            except ValueError:
                pass
        return found
    return set()


def _numeric_fidelity(explanation, result, metadata, limitation):
    allowed = (
        _numbers(result)
        | _numbers(metadata)
        | _numbers(limitation)
    )
    return all(
        any(abs(n - a) <= max(0.01, abs(a) * 1e-4) for a in allowed)
        for n in _numbers(explanation)
    )


def _ranking_fidelity(explanation, groups):
    ordinals = {
        "first": 1, "second": 2, "third": 3,
        "fourth": 4, "fifth": 5,
    }

    for group in groups:
        name = re.escape(group["group_key"])
        rank = group["priority_rank"]

        pattern = (
            rf"\b{ name }\b[^.!?\n]{{0,90}}?"
            rf"\b(?:ranked|rank|position|placed)\s+"
            rf"(?:number\s+)?(\d+|first|second|third|fourth|fifth)\b"
        )

        for match in re.finditer(pattern, explanation, re.IGNORECASE):
            claimed = match.group(1).casefold()
            claimed = int(claimed) if claimed.isdigit() else ordinals[claimed]
            if claimed != rank:
                return False

    return True


def _category_matches(question, groups):
    lowered = question.casefold()
    return [
        group for group in groups
        if group["group_key"].casefold() in lowered
    ]


def _finding(group):
    return (
        f"{group['group_key']} ranks {group['priority_rank']} "
        f"with {group['record_count']} records, "
        f"total observed value {group['total_value']:.2f}, "
        f"average observed value {group['average_value']:.2f}, "
        f"and contribution {group['contribution_pct']:.2f}%."
    )


def answer_portfolio_question(question: str) -> dict[str, Any]:
    scope = check_scope(question)

    if scope.status != "SUPPORTED":
        raise AssistantValidationError(scope.message)

    comparative, baseline = _load_package()
    groups = comparative["groups"]
    selected = _category_matches(question, groups)
    lowered = question.casefold()

    if any(word in lowered for word in ("limitation", "limitations", "caveat")):
        intent = "analysis_limitations"
        selected = groups

    elif "version" in lowered:
        intent = "package_versions"
        selected = groups

    elif any(word in lowered for word in ("baseline", "overall average", "overall total")):
        intent = "baseline_summary"
        selected = groups

    elif len(selected) >= 2 and any(
        word in lowered for word in ("compare", "versus", " vs ", "against", "difference")
    ):
        intent = "compare_categories"

    elif selected and any(word in lowered for word in ("evidence", "record id", "records for")):
        intent = "category_evidence"

    elif selected and any(word in lowered for word in ("rank", "position", "place")):
        intent = "category_rank"

    elif any(word in lowered for word in ("top", "highest", "ranking", "all categories")):
        intent = "top_categories"
        selected = groups

    elif selected:
        intent = "category_summary"

    else:
        raise AssistantValidationError(
            "Please ask about the top categories, a category ranking, "
            "category evidence, a comparison, the baseline, versions, "
            "or analysis limitations."
        )

    if intent == "analysis_limitations":
        finding = LIMITATION
    elif intent == "package_versions":
        finding = (
            f"Data version: {comparative['data_version']}. "
            f"Method version: {comparative['method_version']}."
        )
    elif intent == "baseline_summary":
        finding = (
            f"The baseline contains {baseline['baseline_record_count']} records. "
            f"Total observed value: {baseline['baseline_total_value']:.2f}. "
            f"Average observed value: {baseline['baseline_average_value']:.4f}. "
            "The unit is unspecified."
        )
    else:
        finding = " ".join(_finding(group) for group in selected)

    result_rows = [
        {
            "result_id": f"PORTFOLIO-{group['group_key'].upper().replace(' ', '-')}",
            "group_key": group["group_key"],
            "result_value": group["total_value"],
            "result_unit": "unspecified observed units",
            "result_category": intent,
            "priority_rank": group["priority_rank"],
            "finding": _finding(group),
            "evidence": {
                "record_count": group["record_count"],
                "average_deal_value": group["average_value"],
                "contribution_pct": group["contribution_pct"],
                "record_ids": group["record_ids"][:10],
                "reference": f"Portfolio experiment: {group['group_key']}",
            },
        }
        for group in selected
    ]

    metadata = {
        "data_version": comparative["data_version"],
        "method_version": comparative["method_version"],
        "quality_status": "VALIDATED",
        "experiment": comparative["experiment"],
        "baseline_record_count": baseline["baseline_record_count"],
    }

    deterministic_result = {
        "finding": finding,
        "results": result_rows,
        "baseline": baseline if intent == "baseline_summary" else None,
        "limitation": LIMITATION,
        "metadata": metadata,
    }

    references = [
        item["evidence"]["reference"] for item in result_rows
    ]

    try:
        explanation = explain_deterministic_result(
            question=question,
            intent=intent,
            result=deterministic_result,
            evidence_references=references,
            metadata=metadata,
            limitation=LIMITATION,
        )

        if not _numeric_fidelity(
            explanation, deterministic_result, metadata, LIMITATION
        ):
            raise GeminiExplanationError("Numeric grounding validation failed.")

        if not _ranking_fidelity(explanation, selected):
            raise GeminiExplanationError("Portfolio ranking validation failed.")

        explanation_status = "AVAILABLE"

    except GeminiExplanationError as exc:
        logger.warning(
            "Portfolio Gemini explanation unavailable; intent=%s; error=%s",
            intent,
            str(exc),
        )
        explanation = (
            "Gemini explanation is currently unavailable. "
            "The deterministic portfolio result remains authoritative."
        )
        explanation_status = "UNAVAILABLE"

    return {
        "answer_id": f"portfolio-assistant-{uuid4().hex}",
        "status": "SUPPORTED",
        "intent": intent,
        "answer": finding,
        "evidence_references": references,
        "key_values": {
            "data_version": metadata["data_version"],
            "method_version": metadata["method_version"],
            "record_count": sum(g["record_count"] for g in selected),
        },
        "metadata": metadata,
        "limitation": LIMITATION,
        "gemini_explanation": explanation,
        "explanation_status": explanation_status,
        "result": deterministic_result,
        "results": result_rows,
        "scope_status": "SUPPORTED",
    }
