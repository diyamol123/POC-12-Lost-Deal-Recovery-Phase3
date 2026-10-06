
# Intelligence Integration Mapping

| Source | Integration |
|---|---|
| intelligence_results.json | API result objects and primary comparative view |
| intelligence_summary.json | Summary cards, findings, methodology and limitations |
| validation_metrics.json | Validation state and package gating |
| Intelligence Output Contract | Shared TypeScript types and validator |
| Track A approval | Backend approved-track gate |
| Operational route `/` | Preserved existing application |
| Data Intelligence route | `/data-intelligence` |

## Version Fields

The following are surfaced:

- `data_version`
- `method_version`
- `generated_at`
- `quality_status`

## Filters

Filters are derived from loaded contract fields:

- `group_key`
- `result_category`
- `quality_status`

No rank labels are hard-coded into the UI.

## Evidence

Each result exposes the approved finding, evidence object, record IDs, quality status, limitation and generation metadata.

## Analytical Boundary

No frontend analytical calculation or ranking is introduced. The UI presents approved generated results.
