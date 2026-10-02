# Canonical Data Package Validation

## Validation Scope

This document records validation of the Phase 3 canonical data package against the required data foundation checks.

The canonical source of truth is:

`data/canonical/intelligence_data.csv`

The published JSON is generated from that canonical CSV.

## Validation Result

**VALIDATION PASSED**

Validation was executed using:

`scripts/data_pipeline/validate_data.py`

The generated machine-readable result is:

`data/quality/validation_report.json`

## Results

- Records: 20
- Canonical columns: 20
- Unique record IDs: 20
- Published JSON matches canonical CSV
- Size limits: passed
- Required fields: passed
- Date validation: passed
- Numeric validation: passed
- Boolean validation: passed
- Restricted/personal data checks: passed
- Manifest consistency: passed
- Schema validation: passed

## Package Files Validated

- `data/source-sample/source_sample.csv`
- `data/canonical/intelligence_data.csv`
- `data/published/intelligence_data.json`
- `data/schema.json`
- `data/manifest.json`
- `data/quality/data_profile.json`
- `data/quality/validation_report.json`
- `data/quality/sampling_report.md`

## Canonical Data Checks

The validator confirms:

1. The canonical CSV uses the required 20-column order.
2. Record IDs are present and unique.
3. Required fields are populated.
4. Observation timestamps use the expected ISO UTC format.
5. Numeric values are valid numeric data.
6. Boolean values use the expected representation.
7. Text values remain within the defined length limit.
8. Published JSON is valid and matches the canonical CSV.
9. Manifest counts and schema information match the actual package.
10. No restricted or direct personal-data patterns were detected by the validation checks.

## Sampling

All 20 supplied Phase 2 synthetic CRM records were retained.

No random reduction or `head()`-based truncation was performed.

The complete sampling details are documented in:

`data/quality/sampling_report.md`

and:

`docs/SAMPLING_AND_REDUCTION_REPORT.md`

## Data Source Limitation

The package is based on the supplied Phase 2 synthetic CRM dataset located in:

`backend/main.py`

It is not a production CRM export or live production database.

## Currency Limitation

The source dataset does not explicitly identify the currency of the monetary `value` field.

Therefore the canonical package uses:

`metric_unit = currency_unspecified`

No currency was inferred or assigned.

## Deployment Readiness

The validation package does not require a live external API for the Phase 3 data foundation.

The package is designed to be reproducible from the supplied Phase 2 source through the data pipeline scripts.

No production credentials, API keys, or direct personal identifiers are included in the canonical data package.

## Approval Status

The data package has passed the implemented canonical validation checks.

Further Phase 3 analytics, feature engineering, modeling, or intelligence-layer work should use the approved canonical dataset rather than introducing an independent data source.
