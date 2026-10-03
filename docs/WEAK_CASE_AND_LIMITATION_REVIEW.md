# Weak Case and Limitation Review

## Project

**POC-12 — Lost Deal Reason & Recovery Intelligence**

## Approved Track

**Track A — Comparative Intelligence**

## Data Version

`phase3-v1.0.0`

## Purpose

This review documents cases where the comparative intelligence results require additional caution before business interpretation.

The review is based on the approved canonical dataset and the generated validation evidence.

---

## 1. Minimum-Size Groups

The analytical method requires a minimum group size of **3 records**.

Two categories are exactly at this threshold:

| Category | Records | Review |
|---|---:|---|
| Timing | 3 | Sensitive to individual observations |
| Budget | 3 | Sensitive to individual observations |

These groups were retained because they satisfy the predefined inclusion rule.

Their rankings should nevertheless be interpreted with more caution than rankings based on larger groups.

---

## 2. Highest-Value Record

The highest-value record in the canonical sample is:

- Record ID: `CRM-012`
- Deal value: `1,250,000`

This record is flagged as an extreme-value candidate because a large observation can have a greater influence on group totals and rankings.

The record remains in the primary analysis.

No observation was manually removed.

---

## 3. Leave-One-Out Sensitivity

A leave-one-out sensitivity review was executed for the category rankings.

The purpose was to identify whether removing an individual record changes the overall category ordering.

This is a sensitivity check only.

It does not justify removing records from the canonical dataset.

The detailed machine-readable evidence is available in:

`data-science/outputs/weak_case_review.json`

---

## 4. Missing Groups

The supplied canonical sample contains the observed categories available in the source data.

The analysis does not assume that the supplied categories represent every category that could exist in the broader operational population.

Therefore:

> Absence from this sample must not be interpreted as evidence that a category does not exist operationally.

---

## 5. Missing Values

The primary comparative calculation requires:

- A non-empty grouping value
- A numeric `deal_value`

Rows that do not provide the required analytical values cannot contribute to the relevant group comparison.

The current canonical dataset provides usable category and deal-value values for the generated category comparison.

---

## 6. Synthetic Data Limitation

The canonical dataset contains **20 synthetic CRM records**.

Therefore, the generated intelligence should be interpreted as a controlled analytical demonstration rather than as evidence about the complete real-world lost-deal population.

---

## 7. Currency Limitation

The canonical metric unit is:

`currency_unspecified`

Therefore, numerical deal-value comparisons should be understood as comparisons within the supplied metric rather than interpreted as a confirmed currency-denominated business amount.

---

## 8. Causal Limitation

The comparative analysis is descriptive.

A higher total deal value or higher ranking does not establish that a category causes deal loss or that focusing on that category will cause recovery.

No causal conclusion is produced by the analytical track.

---

## 9. Predictive Limitation

Track A does not produce:

- Recovery probabilities
- Predicted outcomes
- Forecasts
- Machine-learning predictions
- Individual deal recovery scores

The output is comparative descriptive intelligence only.

---

## 10. Population Limitation

The supplied sample covers a limited period and a limited number of records.

The results should not automatically be generalized to:

- Future periods
- Other organizations
- Other CRM populations
- Unobserved categories
- Larger operational populations

---

## 11. Reviewer Interpretation Guidance

The appropriate interpretation is:

> The analysis identifies descriptive differences in the supplied canonical sample and highlights where observed deal-value concentration is located.

The inappropriate interpretation would be:

> The highest-ranked category is definitively the most important cause of lost deals or will produce the greatest recovery if prioritized.

The analytical output does not support that causal or predictive conclusion.

---

## 12. Overall Weak-Case Assessment

The comparative intelligence track remains usable for its approved descriptive purpose.

The principal interpretation risks are:

1. Small groups at the minimum threshold
2. Influence of a high-value observation
3. Small synthetic sample size
4. Unspecified currency
5. Unknown completeness of the operational population

These limitations are explicitly carried into the intelligence output.

## Evidence

- `data-science/outputs/weak_case_review.json`
- `data-science/outputs/validation_metrics.json`
- `data-science/outputs/intelligence_results.json`
- `data-science/outputs/intelligence_summary.json`
