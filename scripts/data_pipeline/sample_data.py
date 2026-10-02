import csv
from pathlib import Path

SOURCE = Path("data/source-sample/source_sample.csv")
OUTPUT = Path("data/source-sample/source_sample.csv")

MAX_ROWS = 10000
MAX_COLUMNS = 50


def main():
    with SOURCE.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        columns = reader.fieldnames or []

    if len(rows) > MAX_ROWS:
        raise RuntimeError(
            f"Source contains {len(rows)} rows, exceeding the limit of {MAX_ROWS}."
        )

    if len(columns) > MAX_COLUMNS:
        raise RuntimeError(
            f"Source contains {len(columns)} columns, exceeding the limit of {MAX_COLUMNS}."
        )

    # The supplied dataset is already below the sampling limits.
    # All records are retained; no arbitrary head()-based sampling is performed.
    with OUTPUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Sampling completed: {len(rows)} records retained")
    print(f"Columns: {len(columns)}")
    print("Reduction performed: no")


if __name__ == "__main__":
    main()
