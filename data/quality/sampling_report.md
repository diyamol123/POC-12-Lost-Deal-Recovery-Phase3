# Sampling Report

## Source Dataset

- Source: Phase 2 synthetic CRM dataset
- Source location: `backend/main.py`
- Source records available: 20
- Source fields: 13
- Source record range: CRM-001 to CRM-020

## Sampling Method

No sampling reduction was performed.

All 20 supplied records were retained because the complete available dataset is already below the Phase 3 limits of 10,000 rows and 50 columns.

No `head()`-based truncation was used.

## Preservation

The retained dataset preserves the supplied:

- Dates
- Locations
- Teams
- Products
- Companies
- Segments
- Loss reasons
- Competitors
- Stages
- Priorities
- Deal values
- Recovery actions

## Reduction

- Records removed: 0
- Records retained: 20
- Reduction performed: No
- Random sampling: No
- Random seed: Not applicable

## Canonical Transformation

The canonical dataset contains 20 records and 20 required canonical fields.

Source fields that are not directly represented as individual canonical columns are documented in:

`docs/CANONICAL_DATA_MAPPING.md`

These include location, team, segment, and competitor.

## Reproducibility

The source extraction and sampling process can be reproduced using:

```text
scripts/data_pipeline/extract_data.py
scripts/data_pipeline/sample_data.py

## Limitation

This package represents the complete supplied Phase 2 synthetic CRM dataset. It is not a production CRM export or live production database.
