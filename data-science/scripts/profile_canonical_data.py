import json
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / "data/canonical/intelligence_data.csv"
OUT = ROOT / "data-science/outputs/canonical_profile.json"

df = pd.read_csv(CSV)

profile = {
    "data_source": "data/canonical/intelligence_data.csv",
    "record_count": int(len(df)),
    "column_count": int(len(df.columns)),
    "columns": list(df.columns),
    "record_type_distribution": df["record_type"].value_counts(dropna=False).to_dict(),
    "missing_values": df.isna().sum().to_dict(),
    "unique_record_ids": int(df["record_id"].nunique()),
    "date_coverage": {
        "min": str(df["observed_at"].min()),
        "max": str(df["observed_at"].max())
    },
    "metric": {
        "name": df["metric_name"].dropna().unique().tolist(),
        "unit": df["metric_unit"].dropna().unique().tolist(),
        "count": int(df["metric_value"].notna().sum())
    },
    "category_distribution": df["category"].value_counts(dropna=False).to_dict(),
    "subcategory_distribution": df["subcategory"].value_counts(dropna=False).to_dict(),
    "status_distribution": df["status"].value_counts(dropna=False).to_dict(),
    "stage_distribution": df["stage"].value_counts(dropna=False).to_dict(),
    "text_value_coverage": {
        "non_null": int(df["text_value"].notna().sum()),
        "null": int(df["text_value"].isna().sum())
    },
    "geographic_coverage": {
        "latitude_non_null": int(df["latitude"].notna().sum()),
        "longitude_non_null": int(df["longitude"].notna().sum())
    },
    "synthetic_distribution": df["is_synthetic"].value_counts(dropna=False).to_dict()
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(profile, indent=2, default=str))
print(f"Created {OUT.relative_to(ROOT)}")
print(f"Records: {len(df)}")
print(f"Columns: {len(df.columns)}")
