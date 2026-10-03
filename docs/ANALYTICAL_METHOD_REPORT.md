# Analytical Method Report

## Project

**POC-12 — Lost Deal Reason & Recovery Intelligence**

## Approved Analytical Track

**Track A — Comparative Intelligence**

## Data and Version

- Canonical source: `data/canonical/intelligence_data.csv`
- Data version: `phase3-v1.0.0`
- Record count: 20
- Record type: `lost_deal`
- Primary metric: `deal_value`
- Metric unit: `currency_unspecified`

## Analytical Question

> Which lost-deal categories, stages, statuses, and deal-value patterns are most important for understanding where recovery opportunities exist?

## Decision Supported

> Use descriptive evidence to identify where recovery attention may be concentrated.

## Baseline

The baseline is a simple category-level comparison using:

1. Record count
2. Total deal value
3. Average deal value

The baseline does not use ranking or contribution percentages.

## Selected Comparative Method

The selected method extends the baseline with:

- Category-level total deal value
- Category-level average deal value
- Percentage contribution to total observed deal value
- Deterministic ranking by total deal value
- Alphabetical category name as the deterministic tie-break
- Minimum group-size threshold of 3 records

The primary ranking dimension is `category`.

Descriptive comparisons are also calculated for:

- `subcategory`
- `status`
- `stage`

These supporting comparisons remain within the approved Comparative Intelligence track.

## Minimum Group Size

A group must contain at least **3 records** to participate in the primary comparative ranking.

The supplied canonical data contains five categories:

- Price
- Competitor
- Product Fit
- Timing
- Budget

All five categories meet the minimum threshold.

Timing and Budget each contain exactly three records and are therefore treated as sensitivity cases.

## Calculation Logic

For each included category:

**Total deal value**

`sum(deal_value)`

**Average deal value**

`sum(deal_value) / record_count`

**Percentage contribution**

`category_total / overall_total × 100`

**Priority rank**

Categories are ordered by:

1. Total deal value, descending
2. Category name, ascending when totals tie

## Validation

The analytical output was independently recalculated directly from the canonical CSV.

Validation checks include:

- Data-version consistency
- Record-count consistency
- Group-count consistency
- Independent calculation accuracy
- Contribution total within rounding tolerance
- Sequential ranking
- Deterministic ranking rule
- Identification of minimum-size groups

Validation result:

**PASSED**

The calculated contribution total is **100.01%**, which is within the validation tolerance because percentages are rounded.

## Weak-Case Review

Two groups are at the minimum group-size threshold:

- Timing — 3 records
- Budget — 3 records

These groups are retained because they meet the predefined threshold, but their comparisons should be interpreted with greater caution because individual records can have greater influence.

The highest-value record in the canonical sample is:

- Record: `CRM-012`
- Deal value: `1,250,000`

This record is flagged for extreme-value sensitivity review and is not removed from the primary analysis.

## Interpretation Boundary

The results are descriptive.

They identify differences in the supplied canonical sample but do not establish:

- Causation
- Predictive performance
- Future deal outcomes
- Recovery success probability
- Population-wide generalization

## Limitations

1. The dataset contains only 20 synthetic records.
2. Currency is unspecified.
3. Timing and Budget each contain only three records.
4. The sample may not represent the complete operational population.
5. Observed rankings should not be interpreted as causal evidence.
6. The analysis does not introduce a predictive model.

## Reproducibility

The method is implemented in:

`data-science/scripts/run_comparative_intelligence.py`

Validation is implemented in:

`data-science/scripts/validate_analytical_track.py`

Weak-case review is implemented in:

`data-science/scripts/review_weak_cases.py`

Standard output generation is implemented in:

`data-science/scripts/export_intelligence_results.py`

All analytical scripts use repository-relative paths and the approved canonical dataset.
