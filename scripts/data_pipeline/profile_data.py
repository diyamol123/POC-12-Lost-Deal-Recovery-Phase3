import csv
import json
from collections import Counter
from pathlib import Path

CANONICAL = Path("data/canonical/intelligence_data.csv")
OUTPUT = Path("data/quality/data_profile.json")


def main():
    with CANONICAL.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        columns = reader.fieldnames or []

    profile = {
        "record_count": len(rows),
        "column_count": len(columns),
        "columns": columns,
        "unique_record_ids": len({row["record_id"] for row in rows}),
        "date_range": {
            "min": min(row["observed_at"] for row in rows),
            "max": max(row["observed_at"] for row in rows)
        },
        "missing_values": {
            column: sum(
                1 for row in rows if row.get(column, "") == ""
            )
            for column in columns
        },
        "category_counts": {
            "record_type": dict(Counter(row["record_type"] for row in rows)),
            "category": dict(Counter(row["category"] for row in rows)),
            "subcategory": dict(Counter(row["subcategory"] for row in rows)),
            "status": dict(Counter(row["status"] for row in rows)),
            "stage": dict(Counter(row["stage"] for row in rows))
        },
        "synthetic_records": sum(
            1 for row in rows if row["is_synthetic"] == "true"
        ),
        "metric": {
            "name": "deal_value",
            "unit": "currency_unspecified",
            "min": min(float(row["metric_value"]) for row in rows),
            "max": max(float(row["metric_value"]) for row in rows)
        }
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2)
        f.write("\n")

    print(f"Created {OUTPUT}")
    print(f"Records profiled: {len(rows)}")


if __name__ == "__main__":
    main()
