# Analytical Validation Report

## Project

**POC-12 — Lost Deal Reason & Recovery Intelligence**

## Approved Track

**Track A — Comparative Intelligence**

## Validation Objective

Verify that the comparative intelligence output is:

- Calculated correctly from the approved canonical dataset
- Consistent with `phase3-v1.0.0`
- Deterministically ranked
- Suitable for descriptive comparison
- Explicit about weak cases and limitations

## Validation Source

The validation uses only:

`data/canonical/intelligence_data.csv`

No second cleaned or analytical dataset was introduced.

## Validation Checks

| Check | Result |
|---|---|
| Data version consistency | PASS |
| Record count consistency | PASS |
| Group count consistency | PASS |
| Independent calculation accuracy | PASS |
| Contribution total tolerance | PASS |
| Sequential ranking | PASS |
| Deterministic tie handling | PASS |
| Minimum-size group identification | PASS |

## Calculation Accuracy

The category-level totals, averages, percentage contributions, and ranks were independently recalculated from the canonical CSV.

The independently calculated results matched the generated analytical results.

**Calculation accuracy: PASS**

## Contribution Validation

The rounded category contribution percentages total:

**100.01%**

The difference from 100% is attributable to percentage rounding and remains within the defined validation tolerance.

**Contribution validation: PASS**

## Ranking Stability

The ranking rule is deterministic:

1. Higher total deal value receives the higher priority.
2. If total values are tied, category name is used as the alphabetical tie-break.

This produces a reproducible ranking from the same canonical input.

**Ranking stability: PASS**

## Minimum-Size Review

The minimum group-size threshold is **3 records**.

The following categories are exactly at the threshold:

- Timing
- Budget

They remain included in the analysis because they satisfy the predefined rule.

However, their estimates are considered more sensitive to individual observations than larger groups.

## Extreme-Value Review

The highest-value record identified in the canonical sample is:

- Record ID: `CRM-012`
- Deal value: `1,250,000`

This record is retained in the primary analysis.

It is explicitly flagged because a high-value observation can have a greater influence on group totals and rankings.

## Leave-One-Out Sensitivity

A leave-one-out review was performed as part of the weak-case assessment.

The purpose was to identify whether removing an individual observation changes the category ranking.

This review is treated as a sensitivity assessment rather than as a reason to remove observations.

## Validation Boundary

The validation confirms the correctness and reproducibility of the calculations.

It does **not** establish:

- Causal relationships
- Predictive accuracy
- Future recovery probability
- Generalization beyond the supplied sample
- Business impact of any category

## Overall Validation Result

**ANALYTICAL TRACK VALIDATION PASSED**

The comparative intelligence output is internally consistent with the approved canonical dataset and the defined Track A method.

## Reproducibility Evidence

Validation is implemented in:

`data-science/scripts/validate_analytical_track.py`

Weak-case review is implemented in:

`data-science/scripts/review_weak_cases.py`

Generated validation evidence:

`data-science/outputs/validation_metrics.json`

Generated weak-case evidence:

`data-science/outputs/weak_case_review.json`
