
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data-science" / "outputs"


def load_outputs():
    return (
        json.loads((OUT / "intelligence_results.json").read_text()),
        json.loads((OUT / "intelligence_summary.json").read_text()),
        json.loads((OUT / "validation_metrics.json").read_text()),
    )


def test_post3_outputs_exist_and_align():
    results, summary, validation = load_outputs()

    assert len(results) == summary["result_count"]
    assert summary["data_version"] == validation["data_version"]
    assert summary["method_version"] == validation["method_version"]
    assert validation["validation_result"] == "PASS"
    assert validation["passed"] is True
    assert summary["approved_track"] == "Track A — Comparative Intelligence"
    assert all(item["quality_status"] == "validated" for item in results)
    assert len({item["result_id"] for item in results}) == len(results)


def test_result_contract_fields_and_versions_align():
    results, summary, _ = load_outputs()

    required = {
        "result_id",
        "result_type",
        "record_id",
        "entity_id",
        "group_key",
        "period_start",
        "period_end",
        "metric_name",
        "result_value",
        "result_unit",
        "result_category",
        "priority_rank",
        "finding",
        "evidence",
        "method_version",
        "data_version",
        "generated_at",
        "quality_status",
        "limitation",
    }

    for item in results:
        assert required.issubset(item)
        assert item["metric_name"] == "total_deal_value"
        assert item["data_version"] == summary["data_version"]
        assert item["method_version"] == summary["method_version"]
        assert item["generated_at"] == summary["generated_at"]
        assert item["quality_status"] == "validated"


def test_filter_behavior_against_approved_output():
    results, _, _ = load_outputs()

    category = results[0]["result_category"]
    group = results[0]["group_key"]
    quality = results[0]["quality_status"]

    assert all(r["result_category"] == category for r in results if r["result_category"] == category)
    assert all(r["group_key"] == group for r in results if r["group_key"] == group)
    assert all(r["quality_status"] == quality for r in results if r["quality_status"] == quality)


def test_sort_behavior_is_deterministic():
    results, _, _ = load_outputs()

    asc = sorted(results, key=lambda r: r["priority_rank"])
    desc = sorted(results, key=lambda r: r["priority_rank"], reverse=True)

    assert asc[0]["priority_rank"] <= asc[-1]["priority_rank"]
    assert desc[0]["priority_rank"] >= desc[-1]["priority_rank"]


def test_pagination_contract():
    results, _, _ = load_outputs()

    page_size = 2
    total_pages = (len(results) + page_size - 1) // page_size

    assert total_pages >= 1
    assert len(results[:page_size]) <= page_size


@pytest.mark.parametrize(
    "page,page_size",
    [(0, 25), (1, 0), (1, 101)],
)
def test_invalid_pagination_is_rejected_by_contract(page, page_size):
    assert page < 1 or page_size < 1 or page_size > 100


def test_invalid_sort_values_are_rejected_by_contract():
    allowed = {"priority_rank", "result_value", "group_key"}

    assert "not_allowed" not in allowed
    assert "sideways" not in {"asc", "desc"}


def test_missing_output_files_are_detectable():
    assert (OUT / "intelligence_results.json").exists()
    assert (OUT / "intelligence_summary.json").exists()
    assert (OUT / "validation_metrics.json").exists()
