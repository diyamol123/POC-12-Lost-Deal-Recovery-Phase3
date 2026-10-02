import csv
from pathlib import Path
from datetime import datetime

SOURCE = Path("data/source-sample/source_sample.csv")
OUTPUT = Path("data/canonical/intelligence_data.csv")

CANONICAL_COLUMNS = [
    "record_id",
    "record_type",
    "observed_at",
    "entity_id",
    "related_entity_id",
    "entity_name",
    "category",
    "subcategory",
    "status",
    "stage",
    "metric_name",
    "metric_value",
    "metric_unit",
    "text_value",
    "latitude",
    "longitude",
    "source_name",
    "source_record_id",
    "is_synthetic",
    "data_version",
]

DATA_VERSION = "phase3-v1.0.0"

def standardize(row):
    observed_at = datetime.strptime(row["date"], "%Y-%m-%d").strftime(
        "%Y-%m-%dT00:00:00Z"
    )

    return {
        "record_id": row["id"],
        "record_type": "lost_deal",
        "observed_at": observed_at,
        "entity_id": row["id"],
        "related_entity_id": "",
        "entity_name": row["company"],
        "category": row["reason"],
        "subcategory": row["product"],
        "status": row["priority"],
        "stage": row["stage"],
        "metric_name": "deal_value",
        "metric_value": row["value"],
        "metric_unit": "currency_unspecified",
        "text_value": row["action"],
        "latitude": "",
        "longitude": "",
        "source_name": "Phase 2 synthetic CRM dataset",
        "source_record_id": row["id"],
        "is_synthetic": "true",
        "data_version": DATA_VERSION,
    }

def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with SOURCE.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = [standardize(row) for row in reader]

    with OUTPUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CANONICAL_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Created {OUTPUT}")
    print(f"Records: {len(rows)}")
    print(f"Columns: {len(CANONICAL_COLUMNS)}")

if __name__ == "__main__":
    main()
