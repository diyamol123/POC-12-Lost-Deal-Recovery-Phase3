"""Input safety and approved scope gate for the deterministic assistant."""

from __future__ import annotations

from dataclasses import dataclass
import re

MAX_QUESTION_LENGTH = 500


@dataclass(frozen=True)
class ScopeResult:
    status: str
    message: str


_UNSAFE_PATTERNS = (
    (r"\b(system prompt|system message|hidden prompt|developer prompt)\b", "System prompt disclosure is not supported."),
    (r"\b(api key|secret|password|token|credential|environment variable|env var)\b", "Secrets and environment data are not supported."),
    (r"\b(ignore|disregard|override)\b.{0,80}\b(instruction|rule|policy|prompt)\b", "Instruction override requests are not supported."),
    (r"\b(source data|source text|record text|dataset text)\b.{0,100}\b(instruction|execute|follow|ignore)\b", "Instructions contained in source data are not executable."),
    (r"\b(select|insert|update|delete|drop|alter)\b.{0,80}\b(from|into|table|database|sql)\b", "Arbitrary SQL is not supported."),
    (r"\b(execute|run)\b.{0,80}\b(code|script|python|javascript|shell)\b", "Arbitrary code execution is not supported."),
    (r"\b(all|every|entire|full)\b.{0,60}\b(records|deals|dataset|database)\b", "Unrestricted record retrieval is not supported."),
    (r"\b(predict|forecast|future|will be recovered|probability)\b", "Predictive or forecasting questions are outside the approved scope."),
    (r"\b(caus(e|ed|al|ality)|why did|cause of)\b", "Causal analysis is outside the approved descriptive scope."),
    (r"\b(change|alter|manipulate|make|set)\b.{0,50}\b(score|rank|ranking|category|result)\b", "Changing analytical results is not supported."),
)


def check_scope(question: str) -> ScopeResult:
    if not isinstance(question, str):
        return ScopeResult("UNSAFE", "Question must be text.")
    if not question.strip():
        return ScopeResult("MISSING_PARAMETER", "Please enter a question.")
    if len(question) > MAX_QUESTION_LENGTH:
        return ScopeResult("UNSAFE", "Question must be 500 characters or fewer.")

    lowered = question.casefold()
    for pattern, message in _UNSAFE_PATTERNS:
        if re.search(pattern, lowered, flags=re.IGNORECASE | re.DOTALL):
            return ScopeResult("UNSAFE", message)

    return ScopeResult("SUPPORTED", "Question may be routed through the approved catalog.")
