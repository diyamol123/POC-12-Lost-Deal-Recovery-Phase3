# Analytical Input Contract

## Project
POC-12 — Lost Deal Reason & Recovery Intelligence

## Canonical Data Source
`data/canonical/intelligence_data.csv`

## Data Version
`phase3-v1.0.0`

## Approved Analytical Track
Track A — Comparative Intelligence

| Canonical Field | Analytical Role | Transformation | Required? | Available at Decision Time? | Limitation |
|---|---|---|---|---|---|
| record_id | Identifier / evidence field | None | Yes | Yes | Identifier only; not used as an analytical signal |
| record_type | Context field | None | Yes | Yes | Constant value `lost_deal` |
| observed_at | Context / time field | Parse as UTC datetime | No | Yes | Limited historical coverage |
| entity_id | Identifier / evidence field | None | Yes | Yes | Identifier only |
| related_entity_id | Excluded field | None | No | Yes | Null for all canonical records |
| entity_name | Evidence field | None | No | Yes | Used only to trace findings to entities |
| category | Grouping dimension | None | Yes | Yes | Five categories in the canonical sample |
| subcategory | Grouping/detail dimension | None | Yes | Yes | Product-derived grouping |
| status | Comparison dimension | None | No | Yes | Three observed priority levels |
| stage | Comparison dimension | None | No | Yes | Four observed deal stages |
| metric_name | Metric identifier | Filter for `deal_value` | Yes | Yes | One metric in the canonical dataset |
| metric_value | Metric | Numeric parsing | Yes | Yes | Currency is unspecified |
| metric_unit | Metric metadata | None | Yes | Yes | `currency_unspecified` |
| text_value | Evidence/context field | None | No | Yes | Limited to source action/recovery text |
| latitude | Excluded field | None | No | No | No geographic values available |
| longitude | Excluded field | None | No | No | No geographic values available |
| source_name | Provenance metadata | None | No | Yes | Not an analytical signal |
| source_record_id | Identifier / provenance field | None | No | Yes | Source identifier; not used as an analytical signal |
| is_synthetic | Provenance metadata | None | Yes | Yes | All canonical records are synthetic |
| data_version | Version metadata | Verify equals `phase3-v1.0.0` | Yes | Yes | Must match approved canonical version |

## Analytical Inclusion Rules

1. Load only `data/canonical/intelligence_data.csv`.
2. Verify `data_version` equals `phase3-v1.0.0`.
3. Use `metric_name == "deal_value"` for value-based comparisons.
4. Exclude rows with missing `category` or `metric_value` from category metric calculations.
5. Do not use identifiers as analytical features.
6. Do not create a second cleaned or analytical dataset.
7. Preserve the canonical records as the sole source of evidence.

## Grouping Dimensions

The primary comparison dimension is `category`.

Additional descriptive comparisons may use:
- `subcategory`
- `status`
- `stage`

These fields are used only for descriptive comparative intelligence and are not treated as predictive features or targets.

## Baseline Input

The baseline uses category-level:
- record count
- total deal value
- average deal value

No ranking or derived scoring is required for the baseline.

## Analytical Method Inputs

Track A adds:
- percentage contribution to total deal value
- deterministic ranking by total deal value
- minimum group-size filtering
- sensitivity review for small groups and high-value records

## Missing-Value Risks

- Missing `category` prevents category assignment.
- Missing `metric_value` prevents value-based comparison.
- Missing geographic fields prevent geographic comparison.
- Missing `related_entity_id` does not affect this track because it is excluded.
- Missing text does not prevent numeric comparative analysis.

## Leakage Assessment

Track A is descriptive rather than predictive. No target is trained or predicted.

Identifiers, provenance fields, and version metadata are excluded from analytical calculations. No future outcome variable is introduced.

The calculations are performed directly from the approved canonical dataset and do not require fitting preprocessing parameters on a separate validation dataset.

## Output Traceability

Every group-level result must retain enough evidence to identify:
- the analytical group;
- record count;
- total value;
- average value;
- contribution percentage;
- ranking;
- supporting canonical record identifiers where applicable.

## Known Limitations

The canonical dataset contains 20 synthetic records. Operational population coverage is not established, historical depth is limited, currency is unspecified, and geographic fields are unavailable. Therefore, Track A results are descriptive evidence for the supplied canonical sample only.
