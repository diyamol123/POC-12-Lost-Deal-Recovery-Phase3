# Supported Question Catalog

## Target User

Users of the Lost Deal Reason & Recovery Intelligence interface who need
natural-language access to approved comparative intelligence.

## Approved Assistant Mode

Mode B — Deterministic Retrieval + LLM Explanation.

Deterministic retrieval is authoritative. Gemini only explains validated
results and evidence.

## Approved Track

Track A — Comparative Intelligence.

## Data and Method Versions

| Item | Version |
|---|---|
| Data version | phase3-v1.0.0 |
| Method version | 1.0.0 |
| Validation status | PASS |
| Approved track | Track A — Comparative Intelligence |

## Supported Questions

| Question Pattern | Intent | Parameters | Query Function | Evidence | Limitation |
|---|---|---|---|---|---|
| Which lost-deal category has the highest total deal value? | top_category | none | get_top_category | Category, rank, total deal value, count, average, contribution | Descriptive synthetic sample |
| What are the top lost-deal categories by total deal value? | top_categories | limit, default bounded | get_top_categories | Ranked category results and contribution evidence | Descriptive synthetic sample |
| What is the ranking of [category]? | category_rank | category | get_category_rank | Category rank and result value | Category must exist |
| Why is [category] ranked where it is? | category_explanation | category | get_category_explanation | Rank, total value, count, average, contribution | Explanation is descriptive, not causal |
| What evidence supports [category/result]? | category_evidence | category | get_category_evidence | Validated evidence references and values | Evidence is limited to approved package |
| Compare [category A] and [category B] | compare_categories | category A, category B | compare_categories | Side-by-side comparative evidence | Comparison is descriptive |
| What are the analysis limitations? | analysis_limitations | none | get_analysis_limitations | Approved limitations | Does not establish causality or prediction |
| What are the current data and method versions? | package_versions | none | get_package_versions | Data version, method version, quality status | Version values come from validated metadata |
| What is the current validation status? | validation_status | none | get_validation_status | Validation result and quality status | Status reflects approved package |

## Unsupported Question Categories

The assistant does not support:

- predictions or forecasting;
- causal inference;
- arbitrary analytical questions;
- score or ranking manipulation;
- unrestricted record retrieval;
- requests for all canonical records;
- arbitrary SQL;
- arbitrary code execution;
- user-supplied file paths;
- secret or credential retrieval;
- system prompt disclosure;
- prompt injection execution;
- source-data instruction execution.

Unsupported or unsafe questions do not reach deterministic retrieval or Gemini.

## Gemini Boundary

Gemini does not classify the source of truth or retrieve data.

The backend first performs scope validation, intent classification, parameter
validation, and deterministic retrieval.

Only the validated deterministic result and limited evidence package are
passed to Gemini for explanation.

Gemini must not invent, calculate, change, or reinterpret numbers, rankings,
findings, evidence, versions, limitations, predictions, or causal claims.

## Suggested Questions

1. Which lost-deal category has the highest total deal value?
2. What are the top lost-deal categories by total deal value?
3. What is the ranking of Price?
4. Why is Price ranked where it is?
5. What evidence supports the Price result?
6. Compare Price and Competitor.
7. What are the analysis limitations?
8. What are the current data and method versions?
9. What is the current validation status?

## Catalog Version

1.1.0
