from pathlib import Path
import json
import math

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "canonical" / "intelligence_data.csv"
RESULT_PATH = ROOT / "data-science" / "outputs" / "comparative_intelligence.json"
BASELINE_PATH = ROOT / "data-science" / "outputs" / "baseline_results.json"
OUTPUT_PATH = ROOT / "data-science" / "outputs" / "validation_metrics.json"

DATA_VERSION = "phase3-v1.0.0"
METHOD_VERSION = "1.0.0"
MIN_GROUP_SIZE = 3
TOLERANCE = 0.1


def close(a, b, tolerance=0.01):
    return math.isclose(float(a), float(b), abs_tol=tolerance, rel_tol=1e-9)


def main():
    df = pd.read_csv(DATA_PATH)

    result = json.loads(RESULT_PATH.read_text(encoding="utf-8"))
    baseline = json.loads(BASELINE_PATH.read_text(encoding="utf-8"))

    checks = {}

    checks["data_version"] = (
        set(df["data_version"].dropna().astype(str)) == {DATA_VERSION}
        and result["data_version"] == DATA_VERSION
        and baseline["data_version"] == DATA_VERSION
    )

    checks["method_version"] = (
        result["method_version"] == METHOD_VERSION
        and baseline["method_version"] == METHOD_VERSION
    )

    checks["record_count"] = len(df) == 20

    usable = df.dropna(subset=["category", "metric_value"]).copy()

    expected = (
        usable.groupby("category")
        .agg(
            record_count=("record_id", "count"),
            total_value=("metric_value", "sum"),
            average_value=("metric_value", "mean"),
        )
        .reset_index()
    )

    expected = expected[
        expected["record_count"] >= MIN_GROUP_SIZE
    ].copy()

    expected["contribution_pct"] = (
        expected["total_value"]
        / expected["total_value"].sum()
        * 100
    )

    expected = expected.sort_values(
        ["total_value", "category"],
        ascending=[False, True],
        kind="mergesort",
    ).reset_index(drop=True)

    expected["priority_rank"] = expected.index + 1

    actual = result["groups"]

    checks["minimum_group_size"] = all(
        item["record_count"] >= MIN_GROUP_SIZE
        for item in actual
    )

    checks["group_count"] = len(actual) == len(expected)

    calculation_accuracy = True
    ranking_accuracy = True
    deterministic_ties = True

    for _, row in expected.iterrows():
        matches = [
            item for item in actual
            if item["group_key"] == row["category"]
        ]

        if len(matches) != 1:
            calculation_accuracy = False
            ranking_accuracy = False
            continue

        item = matches[0]

        if not close(item["record_count"], row["record_count"], 0):
            calculation_accuracy = False

        if not close(item["total_value"], row["total_value"], 0.01):
            calculation_accuracy = False

        if not close(item["average_value"], row["average_value"], 0.01):
            calculation_accuracy = False

        if not close(
            item["contribution_pct"],
            row["contribution_pct"],
            0.01,
        ):
            calculation_accuracy = False

        if item["priority_rank"] != int(row["priority_rank"]):
            ranking_accuracy = False

    checks["calculation_accuracy"] = calculation_accuracy
    checks["ranking_accuracy"] = ranking_accuracy

    ranks = [item["priority_rank"] for item in actual]
    checks["sequential_ranking"] = ranks == list(range(1, len(actual) + 1))

    sorted_groups = [
        item["group_key"]
        for item in sorted(
            actual,
            key=lambda x: (-x["total_value"], x["group_key"])
        )
    ]

    actual_groups = [item["group_key"] for item in actual]
    checks["deterministic_tie_handling"] = (
        actual_groups == sorted_groups
    )

    contribution_total = sum(
        item["contribution_pct"] for item in actual
    )

    checks["contribution_total"] = abs(
        contribution_total - 100
    ) <= TOLERANCE

    expected_baseline_total = float(
        df["metric_value"].dropna().sum()
    )

    expected_baseline_average = float(
        df["metric_value"].dropna().mean()
    )

    checks["baseline_total"] = close(
        baseline["baseline_total_value"],
        expected_baseline_total,
        0.01,
    )

    checks["baseline_average"] = close(
        baseline["baseline_average_value"],
        expected_baseline_average,
        0.01,
    )

    small_groups = [
        item["group_key"]
        for item in actual
        if item["record_count"] == MIN_GROUP_SIZE
    ]

    checks["small_group_review_identified"] = (
        len(small_groups) > 0
    )

    passed = all(checks.values())

    validation_output = {
        "approved_track": "Track A — Comparative Intelligence",
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
        "validation_result": "PASS" if passed else "CHANGES REQUIRED",
        "passed": passed,
        "record_count": len(df),
        "primary_group_count": len(actual),
        "minimum_group_size": MIN_GROUP_SIZE,
        "contribution_total_percent": contribution_total,
        "small_groups_at_threshold": small_groups,
        "baseline": {
            "total_value": baseline["baseline_total_value"],
            "average_value": baseline["baseline_average_value"],
        },
        "checks": checks,
    }

    OUTPUT_PATH.write_text(
        json.dumps(validation_output, indent=2),
        encoding="utf-8",
    )

    print("ANALYTICAL TRACK VALIDATION COMPLETE")
    print(f"Passed: {passed}")
    print(f"Contribution total: {contribution_total:.2f}%")
    print(f"Small groups at threshold: {small_groups}")
    print(f"Baseline total: {baseline['baseline_total_value']}")
    print(f"Baseline average: {baseline['baseline_average_value']}")
    print(f"Output: {OUTPUT_PATH}")

    if not passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
