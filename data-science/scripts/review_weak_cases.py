import csv
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT = BASE_DIR / "data/canonical/intelligence_data.csv"
RESULTS = BASE_DIR / "data-science/outputs/comparative_intelligence.json"
OUTPUT = BASE_DIR / "data-science/outputs/weak_case_review.json"

MIN_GROUP_SIZE = 3
DATA_VERSION = "phase3-v1.0.0"


def load_rows():
    with INPUT.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    for row in rows:
        row["metric_value"] = float(row["metric_value"])

    return rows


def leave_one_out_sensitivity(rows, category):
    members = [
        row for row in rows
        if row["category"].strip() == category
    ]

    if len(members) <= MIN_GROUP_SIZE:
        return {
            "category": category,
            "tested": True,
            "reason": "Group is at the minimum sample-size threshold.",
            "rank_changes": [],
        }

    baseline_totals = {}

    for row in rows:
        key = row["category"].strip()
        baseline_totals.setdefault(key, 0.0)
        baseline_totals[key] += row["metric_value"]

    baseline_order = [
        key
        for key, _ in sorted(
            baseline_totals.items(),
            key=lambda x: (-x[1], x[0]),
        )
    ]

    changes = []

    for removed in members:
        totals = {}

        for row in rows:
            if row["record_id"] == removed["record_id"]:
                continue

            key = row["category"].strip()
            totals.setdefault(key, 0.0)
            totals[key] += row["metric_value"]

        order = [
            key
            for key, _ in sorted(
                totals.items(),
                key=lambda x: (-x[1], x[0]),
            )
        ]

        if order != baseline_order:
            changes.append(
                {
                    "removed_record_id": removed["record_id"],
                    "removed_value": removed["metric_value"],
                    "ranking_after_removal": order,
                }
            )

    return {
        "category": category,
        "tested": True,
        "reason": "Leave-one-out sensitivity test performed.",
        "baseline_ranking": baseline_order,
        "rank_changes": changes,
    }


def main():
    rows = load_rows()

    with RESULTS.open(encoding="utf-8") as f:
        results = json.load(f)

    groups = results["groups"]

    weak_cases = []

    for group in groups:
        if group["record_count"] == MIN_GROUP_SIZE:
            weak_cases.append(
                {
                    "case_type": "minimum_group_size",
                    "category": group["group_key"],
                    "record_count": group["record_count"],
                    "assessment": (
                        "Ranking is included because the group meets the "
                        "minimum threshold, but the estimate is more sensitive "
                        "to individual records than larger groups."
                    ),
                }
            )

    sensitivity_reviews = [
        leave_one_out_sensitivity(rows, group["group_key"])
        for group in groups
    ]

    extreme_record = max(
        rows,
        key=lambda row: row["metric_value"],
    )

    review = {
        "review_type": "weak_case_and_limitation_review",
        "data_version": DATA_VERSION,
        "minimum_group_size": MIN_GROUP_SIZE,
        "weak_cases": weak_cases,
        "leave_one_out_sensitivity": sensitivity_reviews,
        "highest_value_record_review": {
            "record_id": extreme_record["record_id"],
            "category": extreme_record["category"],
            "metric_value": extreme_record["metric_value"],
            "assessment": (
                "This record is flagged as an extreme-value candidate for "
                "interpretation because it has the highest deal value in "
                "the canonical sample. The review does not remove it from "
                "the primary analysis."
            ),
        },
        "overall_assessment": (
            "Comparative ranking is usable for descriptive analysis of the "
            "canonical sample, with caution for minimum-size groups and "
            "potential influence from extreme deal values."
        ),
        "limitations": [
            "The canonical dataset contains only 20 synthetic records.",
            "Minimum-size groups have only three records.",
            "The supplied sample may not represent the full operational population.",
            "Observed ranking should not be interpreted as causal evidence.",
            "Currency is unspecified in the canonical data.",
        ],
    }

    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(review, f, indent=2)

    print("WEAK-CASE REVIEW GENERATED")
    print(f"Minimum-size groups reviewed: {len(weak_cases)}")
    print(
        "Highest-value record:",
        extreme_record["record_id"],
        extreme_record["metric_value"],
    )
    print(f"Output: {OUTPUT}")


if __name__ == "__main__":
    main()
