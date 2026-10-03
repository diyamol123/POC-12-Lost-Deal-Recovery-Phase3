# Analytical Track Execution Plan

## Project
POC-12 — Lost Deal Reason & Recovery Intelligence

## Canonical Data Version
phase3-v1.0.0

## Confirmed Data Archetype
Structured event/transactional CRM records

## Target User
Business user reviewing lost CRM deals for recovery planning.

## Primary Analytical Question
Which lost-deal categories, stages, statuses, and deal-value patterns are most important for understanding where recovery opportunities exist?

## Decision to Be Supported
Use descriptive evidence to identify where recovery attention may be concentrated.

## Approved Primary Track
Track A — Comparative Intelligence

## Approved Supporting Track
None implemented in Post #3. The implementation is restricted to the approved primary track.

## Input Fields
- category — grouping dimension
- subcategory — grouping/detail dimension
- status — comparison dimension
- stage — comparison dimension
- metric_value — deal-value metric
- record_id — evidence/record identifier
- entity_id — evidence/entity identifier
- observed_at — contextual date field
- metric_name — metric identifier
- metric_unit — metric unit
- entity_name — evidence field
- text_value — retained as evidence/context only

## Excluded Fields
- related_entity_id — no analytical value because it is null for all 20 records
- latitude — unavailable
- longitude — unavailable
- source_record_id — source identifier, not an analytical feature
- source_name — provenance metadata
- is_synthetic — provenance metadata
- data_version — version metadata
- record_type — constant across all records
- stage/status/category values will not be treated as predictive targets

## Missing-Value Handling
Only records with non-null values for the grouping field and metric_value will be included in metric comparisons. Missing geographic fields are not used. Missing related_entity_id does not affect Track A calculations because it is not an analytical input.

## Baseline
Simple category-level comparison using total deal value and average deal value without additional ranking or contribution analysis.

## Selected Method
Comparative analysis by meaningful categorical groups using:
- record count
- total deal value
- average deal value
- percentage contribution to total deal value
- deterministic ranking

A minimum group size of 3 records will be required for ranked category comparisons.

## Validation Approach
- Independently recalculate selected group totals and averages.
- Confirm percentage contributions sum to approximately 100% across included groups.
- Confirm deterministic ranking and tie handling.
- Test sensitivity to small groups below the minimum threshold.
- Review the effect of individual high-value records on rankings.
- Document groups excluded because of insufficient records.
- Confirm calculations use only data/canonical/intelligence_data.csv.

## Expected Intelligence Results
Structured group-level results following the standard intelligence-output contract, including:
- result_id
- result_type
- record_id/entity_id where applicable
- group_key
- period_start/period_end where applicable
- metric_name
- result_value
- result_unit
- result_category
- priority_rank where applicable
- finding
- evidence
- method_version
- data_version
- generated_at
- quality_status
- limitation

## Stop Conditions
Stop implementation and require review if:
- the canonical data version does not match phase3-v1.0.0;
- the canonical CSV cannot be loaded or required fields are missing;
- calculations require a second dataset;
- a predictive or unsupported analytical method becomes necessary;
- rankings cannot be reproduced deterministically;
- validation identifies material calculation errors that cannot be resolved without changing the canonical data.

## Known Limitations
- The dataset contains only 20 synthetic lost-deal records.
- Operational population coverage has not been established.
- Historical depth is limited to January–June 2026.
- Deal-value currency is unspecified.
- Geographic coordinates are unavailable.
- Results describe patterns in the supplied canonical sample and should not be interpreted as population-wide or predictive conclusions.
