# Canonical Data Profile

## Source of Truth

The authoritative analytical source is:

`data/canonical/intelligence_data.csv`

The dataset contains 20 canonical records and 20 standardized columns.

## Record Structure

- Record type: `lost_deal`
- Record count: 20
- Unique record IDs: 20
- Data version: `phase3-v1.0.0`
- Synthetic records: 20
- Non-synthetic records: 0

## Date Coverage

The `observed_at` field provides the observation date for each canonical record.

The presence of an observation date does not by itself establish that the dataset is a time-series dataset.

## Numerical Coverage

The canonical metric is:

- Metric name: `deal_value`
- Metric unit: `currency_unspecified`
- Metric values: available in the canonical records

The source data does not identify the currency, so no currency is assumed.

## Categorical Coverage

The canonical dataset provides categorical dimensions including:

- `record_type`
- `category`
- `subcategory`
- `status`
- `stage`

These fields support descriptive comparison of the supplied lost-deal records.

## Text Coverage

The `text_value` field contains the standardized action text from the source CRM records.

Text coverage is limited because the source dataset contains only 20 synthetic records.

## Geographic Coverage

Latitude and longitude are not populated in the canonical dataset.

Therefore, geographic analysis is not supported by the current canonical data.

## Provenance

The source is the Phase 2 synthetic CRM dataset.

All canonical records are marked as synthetic:

`is_synthetic = true`

## Data Quality Status

The Post #1 validation was re-run after Post #2 preparation and passed all mandatory checks.

Validation command:

`python3 scripts/data_pipeline/validate_data.py`

Result:

`VALIDATION PASSED`
