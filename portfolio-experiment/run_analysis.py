from pathlib import Path
from datetime import datetime, timezone
import json

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
BASE = Path(__file__).resolve().parent

DATA = BASE / "intelligence_data_500.csv"
OUTPUT = BASE / "outputs"

DATA_VERSION = "portfolio-synth-v1.0.0"
METHOD_VERSION = "1.0.0"
MIN_GROUP_SIZE = 3

def run():
    df = pd.read_csv(DATA)

    if len(df) != 500:
        raise ValueError("Expected exactly 500 records.")

    if df["record_id"].duplicated().any():
        raise ValueError("Duplicate record IDs found.")

    if set(df["data_version"].astype(str)) != {
        "phase3-v1.0.0",
        DATA_VERSION,
    }:
        raise ValueError("Unexpected data version.")

    usable = df.dropna(subset=["metric_value"]).copy()

    baseline = {
        "baseline_name": "portfolio_overall_mean_and_total",
        "baseline_record_count": int(len(usable)),
        "baseline_total_value": float(usable["metric_value"].sum()),
        "baseline_average_value": float(usable["metric_value"].mean()),
        "baseline_unit": "currency_unspecified",
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
    }

    grouped = (
        usable.dropna(subset=["category"])
        .groupby("category", as_index=False)
        .agg(
            record_count=("record_id", "count"),
            total_value=("metric_value", "sum"),
            average_value=("metric_value", "mean"),
            record_ids=("record_id", list),
        )
    )

    grouped = grouped[
        grouped["record_count"] >= MIN_GROUP_SIZE
    ].copy()

    total_all = float(grouped["total_value"].sum())

    grouped["contribution_pct"] = (
        grouped["total_value"] / total_all * 100
    )

    grouped = grouped.sort_values(
        by=["total_value", "category"],
        ascending=[False, True],
        kind="mergesort",
    ).reset_index(drop=True)

    grouped["priority_rank"] = grouped.index + 1

    results = []

    for _, row in grouped.iterrows():
        results.append({
            "group_key": str(row["category"]),
            "record_count": int(row["record_count"]),
            "total_value": float(row["total_value"]),
            "average_value": float(row["average_value"]),
            "contribution_pct": float(row["contribution_pct"]),
            "priority_rank": int(row["priority_rank"]),
            "baseline_comparison": (
                "above_overall_average"
                if row["average_value"] > baseline["baseline_average_value"]
                else "at_or_below_overall_average"
            ),
            "record_ids": [str(x) for x in row["record_ids"]],
        })

    output = {
        "experiment": "PoC-12 Expanded Portfolio Analysis",
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
        "primary_dimension": "category",
        "minimum_group_size": MIN_GROUP_SIZE,
        "baseline": baseline,
        "groups": results,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "interpretation_limit": (
            "Synthetic descriptive analysis only; "
            "does not establish causality or guaranteed revenue recovery."
        ),
    }

    OUTPUT.mkdir(parents=True, exist_ok=True)

    (OUTPUT / "baseline_results.json").write_text(
        json.dumps(baseline, indent=2),
        encoding="utf-8",
    )

    (OUTPUT / "comparative_intelligence.json").write_text(
        json.dumps(output, indent=2),
        encoding="utf-8",
    )

    print("PORTFOLIO ANALYSIS COMPLETED")
    print("Records:", len(df))
    print("Baseline average:", baseline["baseline_average_value"])
    print("Baseline total:", baseline["baseline_total_value"])
    print("\nCATEGORY RANKING")

    for group in results:
        print(
            group["priority_rank"],
            group["group_key"],
            "| Records:", group["record_count"],
            "| Total:", round(group["total_value"], 2),
            "| Average:", round(group["average_value"], 2),
            "| Contribution:", round(group["contribution_pct"], 2), "%",
        )

    print("\nOutputs:", OUTPUT)

if __name__ == "__main__":
    run()
