from pathlib import Path
import hashlib
import json
import random
from datetime import date, timedelta
import shutil

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "portfolio-experiment"
SOURCE = ROOT / "data/canonical/intelligence_data.csv"
SEED = 120026

random.seed(SEED)

original = pd.read_csv(SOURCE, keep_default_na=False)
columns = list(original.columns)

categories = ["Price", "Competitor", "Product Fit", "Timing", "Budget"]

category_actions = {
    "Price": [
        "Prepare a value comparison and review flexible pricing options.",
        "Arrange a pricing discussion supported by measurable benefits.",
        "Share a tailored proposal explaining the value proposition.",
    ],
    "Competitor": [
        "Compare product capabilities and identify competitor gaps.",
        "Arrange a demonstration highlighting differentiating features.",
        "Prepare a competitive comparison for the decision-makers.",
    ],
    "Product Fit": [
        "Arrange a product-fit workshop with the customer team.",
        "Demonstrate features relevant to the customer's requirements.",
        "Review requirements and prepare a tailored solution proposal.",
    ],
    "Timing": [
        "Schedule a follow-up based on the customer's expected timeline.",
        "Create a re-engagement plan for the next decision window.",
        "Confirm the project timeline and agree on a follow-up date.",
    ],
    "Budget": [
        "Discuss budget constraints and possible phased implementation.",
        "Prepare a proposal aligned with the customer's budget range.",
        "Review available options with the customer decision-makers.",
    ],
}

# Use observed original distributions as sampling references.
status_weights = original["status"].value_counts(normalize=True).to_dict()
stage_weights = original["stage"].value_counts(normalize=True).to_dict()
product_weights = original["subcategory"].value_counts(normalize=True).to_dict()
observed_values = pd.to_numeric(original["metric_value"]).tolist()

def weighted_choice(weights):
    items = list(weights.keys())
    probabilities = list(weights.values())
    return random.choices(items, weights=probabilities, k=1)[0]

new_records = []

for number in range(21, 501):
    category = categories[(number - 21) % len(categories)]

    base_value = random.choice(observed_values)
    value = round(base_value * random.uniform(0.80, 1.20), 2)
    value = max(100000, min(1500000, value))

    observed_date = date(2026, 1, 1) + timedelta(days=random.randint(0, 364))

    record_id = f"CRM-{number:03d}"

    row = {
        "record_id": record_id,
        "record_type": "lost_deal",
        "observed_at": observed_date.isoformat() + "T00:00:00Z",
        "entity_id": record_id,
        "related_entity_id": "",
        "entity_name": f"Synthetic Account {number:03d}",
        "category": category,
        "subcategory": weighted_choice(product_weights),
        "status": weighted_choice(status_weights),
        "stage": weighted_choice(stage_weights),
        "metric_name": "deal_value",
        "metric_value": value,
        "metric_unit": "currency_unspecified",
        "text_value": random.choice(category_actions[category]),
        "latitude": "",
        "longitude": "",
        "source_name": "Portfolio synthetic expansion experiment",
        "source_record_id": record_id,
        "is_synthetic": True,
        "data_version": "portfolio-synth-v1.0.0",
    }

    new_records.append(row)

generated = pd.DataFrame(new_records, columns=columns)

# Preserve original records without modifying their values.
combined = pd.concat([original, generated], ignore_index=True)

OUT.mkdir(parents=True, exist_ok=True)

combined.to_csv(OUT / "intelligence_data_500.csv", index=False)

# Preserve a separate copy of the original source for audit comparison.
shutil.copy2(SOURCE, OUT / "original_baseline_20.csv")

# Validation
assert len(original) == 20
assert len(generated) == 480
assert len(combined) == 500
assert combined["record_id"].is_unique
assert combined["entity_id"].is_unique
assert set(combined["record_type"]) == {"lost_deal"}
assert set(combined["metric_name"]) == {"deal_value"}
assert set(combined["metric_unit"]) == {"currency_unspecified"}
assert set(combined["is_synthetic"].astype(str).str.lower()) == {"true"}
assert set(generated["data_version"]) == {"portfolio-synth-v1.0.0"}
assert set(generated["category"]) == set(categories)
assert (pd.to_numeric(combined["metric_value"]) > 0).all()

# Verify original records are unchanged.
pd.testing.assert_frame_equal(
    combined.iloc[:20].reset_index(drop=True),
    original.reset_index(drop=True),
    check_dtype=False,
)

category_counts = combined["category"].value_counts().to_dict()

manifest = {
    "experiment": "PoC-12 Expanded Synthetic Portfolio Dataset",
    "version": "portfolio-synth-v1.0.0",
    "random_seed": SEED,
    "total_records": 500,
    "original_records_preserved": 20,
    "new_synthetic_records": 480,
    "category_counts": category_counts,
    "currency": "unspecified",
    "all_records_synthetic": True,
    "original_baseline_unchanged": True,
    "source_file": "data/canonical/intelligence_data.csv",
    "output_file": "intelligence_data_500.csv",
    "sha256": hashlib.sha256(
        (OUT / "intelligence_data_500.csv").read_bytes()
    ).hexdigest(),
}

(OUT / "manifest.json").write_text(
    json.dumps(manifest, indent=2),
    encoding="utf-8",
)

print("PORTFOLIO DATASET GENERATED")
print(f"Total records: {len(combined)}")
print(f"Original records preserved: {len(original)}")
print(f"New synthetic records: {len(generated)}")
print("\nCategory counts:")
print(combined["category"].value_counts().to_string())
print("\nOriginal 20 records: unchanged")
print("All validation checks: PASSED")
print(f"Output: {OUT / 'intelligence_data_500.csv'}")
print(f"Manifest: {OUT / 'manifest.json'}")
