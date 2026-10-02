import ast
import csv
from pathlib import Path

SOURCE = Path("backend/main.py")
OUTPUT = Path("data/source-sample/source_sample.csv")

SOURCE_FIELDS = [
    "id",
    "date",
    "location",
    "team",
    "product",
    "company",
    "segment",
    "reason",
    "competitor",
    "stage",
    "value",
    "priority",
    "action",
]


def extract_deals():
    source_text = SOURCE.read_text(encoding="utf-8")
    tree = ast.parse(source_text)

    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "deals":
                    return ast.literal_eval(node.value)

    raise RuntimeError("Could not find the `deals` list in backend/main.py")


def main():
    deals = extract_deals()

    if not isinstance(deals, list):
        raise RuntimeError("The `deals` object is not a list.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=SOURCE_FIELDS)
        writer.writeheader()

        for deal in deals:
            writer.writerow({field: deal.get(field, "") for field in SOURCE_FIELDS})

    print(f"Created {OUTPUT}")
    print(f"Records: {len(deals)}")
    print(f"Columns: {len(SOURCE_FIELDS)}")


if __name__ == "__main__":
    main()
