import os
from unittest.mock import ANY, patch

from backend.assistant.gemini_explanation import (
    GeminiExplanationError,
    explain_deterministic_result,
)
from backend.assistant.service import _has_numeric_fidelity, answer_question


def _grounded_result():
    return {
        "intent": "top_category",
        "result": {
            "group_key": "Price",
            "result_value": 4660000.0,
            "result_unit": "currency_unspecified",
            "result_category": "rank_1",
            "priority_rank": 1,
            "finding": "Price ranks 1 by total deal value.",
            "evidence": {
                "record_count": 5,
                "average_deal_value": 932000.0,
                "contribution_pct": 40.15510555794916,
            },
        },
        "metadata": {
            "data_version": "phase3-v1.0.0",
            "method_version": "1.0.0",
            "quality_status": "validated",
        },
        "limitation": "Results are descriptive and do not establish causality.",
    }


@patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"})
def test_gemini_explanation_uses_mocked_client():
    class MockResponse:
        output_text = "Price is the highest-ranked category in the validated result."

    with patch(
        "backend.assistant.gemini_explanation.genai.Client"
    ) as mock_client:
        mock_client.return_value.interactions.create.return_value = MockResponse()

        explanation = explain_deterministic_result(
            question="Which lost-deal category has the highest total deal value?",
            intent="top_category",
            result=_grounded_result(),
            evidence_references=[],
            metadata=_grounded_result()["metadata"],
            limitation=_grounded_result()["limitation"],
        )

    assert explanation.startswith("Price")
    mock_client.return_value.interactions.create.assert_called_once_with(
        model="gemini-3.5-flash-lite",
        input=ANY,
        store=False,
    )


@patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"})
def test_gemini_api_failure_raises_grounded_error():
    with patch(
        "backend.assistant.gemini_explanation.genai.Client"
    ) as mock_client:
        mock_client.return_value.interactions.create.side_effect = RuntimeError(
            "simulated Gemini failure"
        )

        try:
            explain_deterministic_result(
                question="Which lost-deal category has the highest total deal value?",
                intent="top_category",
                result=_grounded_result(),
                evidence_references=[],
                metadata=_grounded_result()["metadata"],
                limitation=_grounded_result()["limitation"],
            )
        except GeminiExplanationError as exc:
            assert "temporarily unavailable" in str(exc)
        else:
            raise AssertionError("Expected GeminiExplanationError")


def test_numeric_fidelity_accepts_grounded_numbers():
    explanation = (
        "Price ranks 1 and has a total deal value of 4660000.0 "
        "across 5 records."
    )

    assert _has_numeric_fidelity(
        explanation,
        result=_grounded_result(),
        metadata=_grounded_result()["metadata"],
        limitation=_grounded_result()["limitation"],
    )


def test_numeric_fidelity_rejects_new_number():
    explanation = "Price ranks 1 and has a total deal value of 9999999.0."

    assert not _has_numeric_fidelity(
        explanation,
        result=_grounded_result(),
        metadata=_grounded_result()["metadata"],
        limitation=_grounded_result()["limitation"],
    )


def test_assistant_keeps_deterministic_answer_when_gemini_fails():
    with patch(
        "backend.assistant.service.explain_deterministic_result",
        side_effect=GeminiExplanationError("simulated Gemini failure"),
    ):
        response = answer_question(
            "Which lost-deal category has the highest total deal value?"
        )

    assert response["status"] == "SUPPORTED"
    assert response["answer"].startswith("Price ranks 1")
    assert response["explanation_status"] == "UNAVAILABLE"
    assert "deterministic result remains authoritative" in response[
        "gemini_explanation"
    ]


def test_unsafe_question_does_not_reach_gemini():
    from backend.assistant.errors import AssistantValidationError

    with patch(
        "backend.assistant.service.explain_deterministic_result"
    ) as mock_explain:
        try:
            answer_question("Which category caused the lost deals?")
        except AssistantValidationError as exc:
            assert "Causal analysis is outside the approved descriptive scope." in str(exc)
        else:
            raise AssertionError("Expected causal question to be rejected")

    mock_explain.assert_not_called()


def test_grounding_payload_excludes_unapproved_dataset_fields():
    from backend.assistant.gemini_explanation import _build_grounding_payload

    result = _grounded_result()
    result["raw_dataset"] = [{"secret_note": "must not be sent"}]
    result["unapproved_field"] = "must not be sent"

    payload = _build_grounding_payload(
        question="What is the top category?",
        intent="top_category",
        result=result,
        evidence_references=["POC12-CAT-01"],
        metadata=result["metadata"],
        limitation=result["limitation"],
    )

    serialized = str(payload)

    assert "raw_dataset" not in serialized
    assert "secret_note" not in serialized
    assert "unapproved_field" not in serialized
    assert "POC12-CAT-01" in serialized
    assert "phase3-v1.0.0" in serialized

def test_missing_gemini_api_key_preserves_deterministic_answer():
    with patch.dict(os.environ, {}, clear=True):
        response = answer_question(
            "Which lost-deal category has the highest total deal value?"
        )

    assert response["status"] == "SUPPORTED"
    assert response["answer"].startswith("Price ranks 1")
    assert response["explanation_status"] == "UNAVAILABLE"
    assert "deterministic result remains authoritative" in response[
        "gemini_explanation"
    ]
    assert "GEMINI_API_KEY" not in response["gemini_explanation"]
