import csv
import json
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT = BASE_DIR / "data/canonical/intelligence_data.csv"
ANALYTICAL = BASE_DIR / "data-science/outputs/comparative_intelligence.json"
VALIDATION = BASE_DIR / "data-science/outputs/validation_metrics.json"
WEAK_CASE = BASE_DIR / "data-science/outputs/weak_case_review.json"

RESULTS = BASE_DIR / "data-science/outputs/intelligence_results.json"
SUMMARY = BASE_DIR / "data-science/outputs/intelligence_summary.json"

DATA_VERSION = "phase3-v1.0.0"
METHOD_VERSION = "1.0.0"


def load_rows():
    with INPUT.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main():
    rows = load_rows()

    with ANALYTICAL.open(encoding="utf-8") as f:
        analytical = json.load(f)

    with VALIDATION.open(encoding="utf-8") as f:
        validation = json.load(f)

    with WEAK_CASE.open(encoding="utf-8") as f:
        weak_case = json.load(f)

    if analytical["data_version"] != DATA_VERSION:
        raise ValueError("Analytical result has the wrong data version.")

    if not validation["passed"]:
        raise ValueError("Validation has not passed.")

    generated_at = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

    results = []

    for group in analytical["groups"]:
        results.append(
            {
                "result_id": f"POC12-CAT-{group['priority_rank']:02d}",
                "result_type": "comparative_group",
                "record_id": None,
                "entity_id": None,
                "group_key": group["group_key"],
                "period_start": None,
                "period_end": None,
                "metric_name": "total_deal_value",
                "result_value": group["total_value"],
                "result_unit": "currency_unspecified",
                "result_category": f"rank_{group['priority_rank']}",
                "priority_rank": group["priority_rank"],
                "finding": (
                    f"{group['group_key']} ranks {group['priority_rank']} by total "
                    f"deal value among categories meeting the minimum "
                    f"group-size threshold."
                ),
                "evidence": {
                    "record_count": group["record_count"],
                    "average_deal_value": group["average_value"],
                    "contribution_pct": group[
                        "contribution_pct"
                    ],
                    "record_ids": group["record_ids"],
                },
                "method_version": METHOD_VERSION,
                "data_version": DATA_VERSION,
                "generated_at": generated_at,
                "quality_status": "validated",
                "limitation": (
                    "Descriptive result from the supplied synthetic "
                    "canonical sample; not causal evidence."
                ),
            }
        )

    with RESULTS.open("w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    priority_items = [
        {
            "priority_rank": item["priority_rank"],
            "group_key": item["group_key"],
            "total_value": item["total_value"],
            "contribution_pct": item[
                "contribution_pct"
            ],
        }
        for item in analytical["groups"]
    ]

    summary = {
        "project_id": "POC-12",
        "project_title": "Lost Deal Reason & Recovery Intelligence",
        "approved_track": "Track A — Comparative Intelligence",
        "primary_question": (
            "Which lost-deal categories, stages, statuses, and "
            "deal-value patterns are most important for understanding "
            "where recovery opportunities exist?"
        ),
        "decision": (
            "Use descriptive evidence to identify where recovery "
            "attention may be concentrated."
        ),
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
        "result_count": len(results),
        "key_findings": [
            (
                f"{item['group_key']} ranks {item['priority_rank']} by total deal value, "
                f"with {item['contribution_pct']:.2f}% of the "
                "observed total."
            )
            for item in analytical["groups"]
        ],
        "priority_items": priority_items,
        "validation_result": {
            "passed": validation["passed"],
            "contribution_total_percent": validation[
                "contribution_total_percent"
            ],
            "small_groups_at_threshold": validation[
                "small_groups_at_threshold"
            ],
        },
        "weak_case_review": {
            "minimum_size_cases": len(weak_case["weak_cases"]),
            "highest_value_record": weak_case[
                "highest_value_record_review"
            ],
        },
        "important_limitations": [
            "The analysis uses 20 synthetic canonical records.",
            "Currency is unspecified.",
            "Timing and Budget contain only three records each.",
            "The sample may not represent the complete operational population.",
            "Results are descriptive and do not establish causality.",
        ],
        "generated_at": generated_at,
    }

    with SUMMARY.open("w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("INTELLIGENCE RESULTS EXPORTED")
    print(f"Results: {len(results)}")
    print(f"Validation passed: {validation['passed']}")
    print(f"Results output: {RESULTS}")
    print(f"Summary output: {SUMMARY}")


if __name__ == "__main__":
    main()
