# Phase 3 Canonical Data Foundation

This directory contains the approved Phase 3 canonical data package for the Lost Deal Recovery application.

## Source

The supplied source is the Phase 2 synthetic CRM dataset defined in `backend/main.py`.

- Source records: 20
- Source fields: 13
- Source type: synthetic CRM records
- Production/live API dependency: none required for this Phase 3 data package

## Canonical source of truth

The single canonical source of truth is:

`data/canonical/intelligence_data.csv`

It contains 20 records and the required 20 canonical fields defined by the Phase 3 guide.

## Package contents

- `source-sample/source_sample.csv` — supplied source records
- `canonical/intelligence_data.csv` — canonical dataset
- `published/intelligence_data.json` — generated JSON publication
- `schema.json` — canonical field definitions and constraints
- `manifest.json` — package metadata and file inventory
- `quality/data_profile.json` — data profile
- `quality/validation_report.json` — machine-readable validation result
- `quality/sampling_report.md` — sampling record

## Pipeline

The reproducible pipeline is:

`extract_data.py -> sample_data.py -> standardize_data.py -> validate_data.py -> publish_data.py`

Supporting profiling is provided by `profile_data.py`.

All generated published JSON is derived from the canonical CSV.

## Data handling

- UTF-8 CSV with comma delimiters
- Canonical fields use lowercase snake_case
- Dates are normalized to UTC ISO timestamps where applicable
- Missing values are represented as blank CSV values/null JSON values
- Synthetic records are explicitly marked with `is_synthetic = true`
- Source provenance and package version are retained
- No production credentials, API keys, or restricted personal identifiers are included

## Sampling

The complete supplied dataset of 20 records is retained. No reduction was required because the dataset is already within the Phase 3 limits.

## Important limitation

The supplied records are synthetic Phase 2 CRM data. They are not a production export or live database. The source does not explicitly identify a currency for deal values, so the canonical `metric_unit` is recorded as `currency_unspecified` rather than assuming a currency.

## Validation

Run:

`python3 scripts/data_pipeline/validate_data.py`

The validation script checks the canonical structure, required fields, identifiers, dates, numeric and boolean values, size limits, restricted/personal data patterns, schema consistency, manifest consistency, and published JSON consistency.
