import json
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / "data/canonical/intelligence_data.csv"
OUT = ROOT / "data-science/outputs/quality_assessment.json"

df = pd.read_csv(CSV)

required = [
    "record_id", "record_type", "source_name",
    "is_synthetic", "data_version"
]

checks = {
    "completeness": {
        col: int(df[col].isna().sum())
        for col in required
    },
    "uniqueness": {
        "record_id_unique": bool(df["record_id"].is_unique),
        "duplicate_record_ids": int(df["record_id"].duplicated().sum())
    },
    "validity": {
        "record_type_present": bool(df["record_type"].notna().all()),
        "source_name_present": bool(df["source_name"].notna().all()),
        "data_version_present": bool(df["data_version"].notna().all()),
        "synthetic_flag_valid": bool(df["is_synthetic"].dropna().isin([True, False]).all()),
        "metric_value_numeric": bool(
            pd.to_numeric(df["metric_value"], errors="coerce").notna().all()
        )
    },
    "consistency": {
        "record_type_values": df["record_type"].dropna().unique().tolist(),
        "metric_names": df["metric_name"].dropna().unique().tolist(),
        "metric_units": df["metric_unit"].dropna().unique().tolist(),
        "data_versions": df["data_version"].dropna().unique().tolist()
    },
    "accuracy": {
        "assessment": "Limited: source is synthetic CRM data, so operational accuracy cannot be independently verified."
    },
    "representativeness": {
        "assessment": "Limited: dataset contains 20 synthetic CRM records and is not evidence of a complete operational population."
    },
    "timeliness": {
        "observed_at_min": str(df["observed_at"].min()),
        "observed_at_max": str(df["observed_at"].max())
    },
    "provenance": {
        "source_names": df["source_name"].dropna().unique().tolist(),
        "all_synthetic": bool(df["is_synthetic"].eq(True).all())
    },
    "safety": {
        "personal_or_restricted_data_identified": False,
        "note": "Validation report from Post #1 passed restricted/personal-data checks."
    },
    "reproducibility": {
        "source_of_truth": "data/canonical/intelligence_data.csv",
        "pipeline_based": True,
        "record_count": int(len(df))
    }
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(checks, indent=2, default=str))

print(f"Created {OUT.relative_to(ROOT)}")
print("Quality dimensions assessed: 10")
