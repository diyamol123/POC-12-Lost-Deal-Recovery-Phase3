import csv
import json
from pathlib import Path

SOURCE = Path("data/canonical/intelligence_data.csv")
OUTPUT = Path("data/published/intelligence_data.json")


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with SOURCE.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    records = []

    for row in rows:
        row["metric_value"] = float(row["metric_value"])

        if row["latitude"] == "":
            row["latitude"] = None
        else:
            row["latitude"] = float(row["latitude"])

        if row["longitude"] == "":
            row["longitude"] = None
        else:
            row["longitude"] = float(row["longitude"])

        if row["related_entity_id"] == "":
            row["related_entity_id"] = None

        row["is_synthetic"] = row["is_synthetic"].lower() == "true"

        records.append(row)

    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Created {OUTPUT}")
    print(f"Records published: {len(records)}")


if __name__ == "__main__":
    main()
