import json
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
CSV = ROOT / "data/canonical/intelligence_data.csv"
OUT = ROOT / "data-science/outputs/representativeness_assessment.json"

df = pd.read_csv(CSV)

assessment = {
    "source_of_truth": "data/canonical/intelligence_data.csv",
    "source_record_count": 20,
    "canonical_record_count": int(len(df)),
    "sampling_reduction_applied": False,
    "coverage": {
        "record_types": df["record_type"].value_counts().to_dict(),
        "categories": df["category"].value_counts().to_dict(),
        "subcategories": df["subcategory"].value_counts().to_dict(),
        "statuses": df["status"].value_counts().to_dict(),
        "stages": df["stage"].value_counts().to_dict(),
        "date_range": {
            "start": str(df["observed_at"].min()),
            "end": str(df["observed_at"].max())
        }
    },
    "representativeness_assessment": {
        "overall": "LIMITED",
        "reason": (
            "The canonical dataset retains the full supplied source dataset, "
            "but it contains only 20 synthetic CRM records. It should be treated "
            "as a bounded demonstration dataset rather than a representative "
            "sample of a complete operational CRM population."
        ),
        "source_alignment": "Full supplied source retained with no sampling reduction.",
        "important_categories_available": True,
        "important_status_stage_fields_available": True,
        "operational_population_coverage": "Not established from the supplied synthetic dataset.",
        "historical_depth": "Limited to the observed dates present in the 20 supplied records."
    },
    "limitations": [
        "Synthetic source data limits claims about real-world representativeness.",
        "Only 20 records are available.",
        "No evidence establishes that the dataset represents the full operational CRM population.",
        "No sampling reduction was performed, so there is no additional sampling loss within the supplied dataset."
    ]
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(assessment, indent=2, default=str))

print(f"Created {OUT.relative_to(ROOT)}")
print(f"Canonical records assessed: {len(df)}")
print("Representativeness: LIMITED")
