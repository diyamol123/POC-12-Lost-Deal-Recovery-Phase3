from pathlib import Path
import json
from datetime import datetime, timezone

import pandas as pd

DATA_VERSION = "phase3-v1.0.0"
METHOD_VERSION = "1.0.0"
MIN_GROUP_SIZE = 3
PRIMARY_DIMENSION = "category"

ROOT = Path(__file__).resolve().parents[3]
CANONICAL_PATH = ROOT / "data" / "canonical" / "intelligence_data.csv"
OUTPUT_DIR = ROOT / "data-science" / "outputs"

def load_canonical():
    df = pd.read_csv(CANONICAL_PATH)

    if "data_version" not in df.columns:
        raise ValueError("Canonical data_version field is missing.")

    versions = set(df["data_version"].dropna().astype(str))
    if versions != {DATA_VERSION}:
        raise ValueError(f"Unexpected data versions: {sorted(versions)}")

    if "metric_name" not in df.columns:
        raise ValueError("metric_name field is missing.")

    metric_names = set(df["metric_name"].dropna().astype(str))
    if metric_names != {"deal_value"}:
        raise ValueError(f"Unexpected metric names: {sorted(metric_names)}")

    return df


def execute_baseline(df):
    usable = df.dropna(subset=["metric_value"]).copy()

    total = float(usable["metric_value"].sum())
    count = int(len(usable))
    average = float(usable["metric_value"].mean())

    baseline = {
        "baseline_name": "overall_mean_and_total",
        "baseline_record_count": count,
        "baseline_total_value": total,
        "baseline_average_value": average,
        "baseline_unit": "currency_unspecified",
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "baseline_results.json").write_text(
        json.dumps(baseline, indent=2),
        encoding="utf-8",
    )

    return baseline


def execute_comparative_method(df, baseline):
    grouped = (
        df.dropna(subset=[PRIMARY_DIMENSION, "metric_value"])
        .groupby(PRIMARY_DIMENSION, as_index=False)
        .agg(
            record_count=("record_id", "count"),
            total_value=("metric_value", "sum"),
            average_value=("metric_value", "mean"),
            record_ids=("record_id", list),
        )
    )

    grouped = grouped[grouped["record_count"] >= MIN_GROUP_SIZE].copy()

    if grouped.empty:
        raise ValueError("No primary groups meet the minimum group size.")

    total_all = float(grouped["total_value"].sum())

    grouped["contribution_pct"] = (
        grouped["total_value"] / total_all * 100
    )

    grouped = grouped.sort_values(
        by=["total_value", PRIMARY_DIMENSION],
        ascending=[False, True],
        kind="mergesort",
    ).reset_index(drop=True)

    grouped["priority_rank"] = grouped.index + 1

    baseline_average = baseline["baseline_average_value"]

    results = []
    for _, row in grouped.iterrows():
        comparison = (
            "above_overall_average"
            if row["average_value"] > baseline_average
            else "at_or_below_overall_average"
        )

        results.append(
            {
                "group_key": str(row[PRIMARY_DIMENSION]),
                "record_count": int(row["record_count"]),
                "total_value": float(row["total_value"]),
                "average_value": float(row["average_value"]),
                "contribution_pct": float(row["contribution_pct"]),
                "priority_rank": int(row["priority_rank"]),
                "baseline_comparison": comparison,
                "record_ids": [str(x) for x in row["record_ids"]],
            }
        )

    output = {
        "data_version": DATA_VERSION,
        "method_version": METHOD_VERSION,
        "primary_dimension": PRIMARY_DIMENSION,
        "minimum_group_size": MIN_GROUP_SIZE,
        "baseline": baseline,
        "groups": results,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    (OUTPUT_DIR / "comparative_intelligence.json").write_text(
        json.dumps(output, indent=2),
        encoding="utf-8",
    )

    return output


def run():
    df = load_canonical()
    baseline = execute_baseline(df)
    output = execute_comparative_method(df, baseline)

    print("ANALYTICAL TRACK GENERATED")
    print("Track: Track A — Comparative Intelligence")
    print(f"Records: {len(df)}")
    print(f"Primary groups included: {len(output['groups'])}")
    print(f"Baseline average: {baseline['baseline_average_value']}")
    print(f"Baseline total: {baseline['baseline_total_value']}")
    print(
        "Output: "
        + str(OUTPUT_DIR / "comparative_intelligence.json")
    )
    print(
        "Baseline output: "
        + str(OUTPUT_DIR / "baseline_results.json")
    )


if __name__ == "__main__":
    run()
