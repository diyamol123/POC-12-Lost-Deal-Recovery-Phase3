"""Deterministic intent routing for the Phase 3 grounded assistant."""

from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Callable

from .errors import AssistantValidationError
from .scope import check_scope


@dataclass(frozen=True)
class IntentMatch:
    intent: str
    parameters: dict[str, object]
    confidence: str = "deterministic"


_CATEGORY = r"([A-Za-z][A-Za-z -]{0,99}?)"


def _clean(value: str) -> str:
    cleaned = " ".join(value.strip(" \t\n\r?.!,").split())
    cleaned = re.sub(r"\s+categories?$", "", cleaned, flags=re.IGNORECASE)
    return cleaned


def _require_category(value: str | None, message: str) -> str:
    cleaned = _clean(value) if value else ""
    if not cleaned:
        raise AssistantValidationError(message)
    return cleaned


def classify_question(question: str) -> IntentMatch:
    """Map only approved question patterns to deterministic intents."""
    scope = check_scope(question)
    if scope.status != "SUPPORTED":
        raise AssistantValidationError(scope.message)

    text = _clean(question)
    lowered = text.casefold()

    if re.search(r"\b(data|method)\s+version|\bversions?\b", lowered):
        return IntentMatch("package_versions", {})

    if re.search(r"\b(validation status|validated|validation)\b", lowered):
        return IntentMatch("validation_status", {})

    if re.search(r"\b(limitations?|limitations of the analysis)\b", lowered):
        return IntentMatch("analysis_limitations", {})

    if re.search(r"\b(compare|comparison|versus|vs\.?)\b", lowered):
        pair = re.search(
            rf"(?:compare|comparison(?:\s+of)?)\s+{_CATEGORY}\s+(?:and|vs\.?|versus)\s+{_CATEGORY}(?:\s+categories?)?(?:\?|$)",
            text,
            flags=re.IGNORECASE,
        )

        if not pair:
            pair = re.search(
                rf"{_CATEGORY}\s+(?:vs\.?|versus)\s+{_CATEGORY}(?:\s+categories?)?(?:\?|$)",
                text,
                flags=re.IGNORECASE,
            )

        if not pair:
            raise AssistantValidationError(
                "Comparison requires two supported categories."
            )

        return IntentMatch(
            "compare_categories",
            {
                "group_key_a": _clean(pair.group(1)),
                "group_key_b": _clean(pair.group(2)),
            },
        )

    if re.search(r"\b(evidence|proof)\b", lowered):
        match = re.search(
            rf"(?:evidence|proof)\s+(?:support(?:s)?|for|behind)\s+{_CATEGORY}(?:\?|$)",
            text,
            re.IGNORECASE,
        )

        if not match:
            match = re.search(
                rf"what\s+(?:evidence|proof)\s+(?:supports?|is there for)\s+{_CATEGORY}(?:\?|$)",
                text,
                re.IGNORECASE,
            )

        if not match:
            raise AssistantValidationError(
                "Please specify the category whose evidence you want."
            )

        return IntentMatch(
            "category_evidence",
            {"group_key": _clean(match.group(1))},
        )

    if re.search(r"\bwhy\b", lowered) and re.search(
        r"\b(rank|ranking|position)\b",
        lowered,
    ):
        match = re.search(
            rf"why\s+is\s+{_CATEGORY}\s+ranked\s+at\s+its\s+current\s+position(?:\?|$)",
            text,
            re.IGNORECASE,
        )

        if not match:
            match = re.search(
                rf"why\s+is\s+{_CATEGORY}\s+(?:ranked|positioned)(?:\?|$)",
                text,
                re.IGNORECASE,
            )

        if not match:
            raise AssistantValidationError(
                "Please specify the category you want explained."
            )

        return IntentMatch(
            "category_explanation",
            {"group_key": _clean(match.group(1))},
        )

    if re.search(r"\b(rank|ranking|position)\b", lowered):
        if re.fullmatch(
            r"(?:what\s+is\s+)?(?:the\s+)?(?:rank|ranking|position)\??",
            lowered,
        ):
            raise AssistantValidationError(
                "Please specify the category whose ranking you want."
            )

        match = re.search(
            rf"(?:ranking|rank|position)\s+(?:of\s+)?{_CATEGORY}(?:\?|$)",
            text,
            re.IGNORECASE,
        )

        if not match:
            match = re.search(
                rf"what\s+is\s+{_CATEGORY}'?s?\s+(?:rank|ranking|position)(?:\?|$)",
                text,
                re.IGNORECASE,
            )

        if not match:
            raise AssistantValidationError(
                "Please specify the category whose ranking you want."
            )

        return IntentMatch(
            "category_rank",
            {"group_key": _clean(match.group(1))},
        )

    top_match = re.search(r"\btop\s+(\d+)\b", lowered)

    if top_match and re.search(
        r"\b(category|categories|lost-deal)\b",
        lowered,
    ):
        limit = int(top_match.group(1))

        if limit > 25:
            raise AssistantValidationError(
                "The requested result limit exceeds the maximum of 25."
            )

        return IntentMatch("top_categories", {"limit": limit})

    if re.search(
        r"\btop\s+(?:lost-deal\s+)?categories\b",
        lowered,
    ):
        return IntentMatch("top_categories", {"limit": 5})

    if re.search(r"\b(highest|largest|top)\b", lowered) and re.search(
        r"\b(total deal value|deal value|category|lost-deal)\b",
        lowered,
    ):
        return IntentMatch("top_category", {})

    raise AssistantValidationError(
        "This question is outside the approved assistant question catalog."
    )


QUERY_FUNCTIONS: dict[str, Callable[..., object]] = {}
