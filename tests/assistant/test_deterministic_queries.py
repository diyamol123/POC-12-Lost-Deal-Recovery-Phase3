from backend.assistant.errors import AssistantNotFoundError, AssistantValidationError
from backend.assistant.queries import (
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


def test_get_top_category_is_deterministic():
    result = get_top_category()
    assert result["result"]["group_key"] == "Price"
    assert result["result"]["priority_rank"] == 1
    assert result["result"]["result_value"] == 4660000.0
    assert result["metadata"]["data_version"] == "phase3-v1.0.0"
    assert result["metadata"]["method_version"] == "1.0.0"


def test_get_top_categories_is_bounded_and_ranked():
    result = get_top_categories(3)
    assert [item["group_key"] for item in result["results"]] == [
        "Price", "Competitor", "Product Fit"
    ]
    assert len(result["results"]) <= 25


def test_category_rank_is_case_insensitive():
    result = get_category_rank("price")
    assert result["parameters"]["group_key"] == "Price"
    assert result["result"]["priority_rank"] == 1


def test_category_explanation_preserves_grounded_values():
    result = get_category_explanation("Competitor")
    assert result["result"]["priority_rank"] == 2
    assert result["result"]["result_value"] == 3435000.0
    assert round(result["result"]["contribution_pct"], 2) == 29.60
    assert result["result"]["record_count"] == 5


def test_category_evidence_contains_record_ids():
    result = get_category_evidence("Product Fit")
    evidence = result["evidence"][0]
    assert evidence["record_count"] == 4
    assert evidence["record_ids"] == [
        "CRM-003", "CRM-008", "CRM-013", "CRM-019"
    ]
    assert evidence["reference"] == "POC12-CAT-03"


def test_compare_categories_is_deterministic():
    result = compare_categories("Budget", "Price")
    assert [item["group_key"] for item in result["results"]] == ["Price", "Budget"]
    assert len(result["evidence"]) == 2


def test_compare_same_category_is_rejected():
    try:
        compare_categories("Price", "price")
    except AssistantValidationError as exc:
        assert "different categories" in str(exc)
    else:
        raise AssertionError("Expected same-category comparison to be rejected")


def test_unknown_category_is_rejected():
    try:
        get_category_rank("Unknown Category")
    except AssistantNotFoundError as exc:
        assert "Supported category not found" in str(exc)
    else:
        raise AssertionError("Expected unknown category to be rejected")


def test_invalid_limit_is_rejected():
    try:
        get_top_categories(26)
    except AssistantValidationError as exc:
        assert "between 1 and 25" in str(exc)
    else:
        raise AssertionError("Expected limit validation failure")


def test_limitations_are_source_derived():
    result = get_analysis_limitations()
    assert "The analysis uses 20 synthetic canonical records." in result["results"]
    assert "Results are descriptive and do not establish causality." in result["results"]


def test_versions_are_source_derived():
    result = get_package_versions()
    assert result["result"]["data_version"] == "phase3-v1.0.0"
    assert result["result"]["method_version"] == "1.0.0"
    assert result["result"]["quality_status"] == "validated"


def test_validation_status_is_passed():
    result = get_validation_status()
    assert result["result"]["validation_result"] == "PASS"
    assert result["result"]["passed"] is True
    assert result["result"]["minimum_group_size"] == 3
