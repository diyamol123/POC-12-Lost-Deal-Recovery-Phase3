# Phase 3 Release Manifest

## Release

- Release: `phase3-v1.0.0`
- Track: `Track A — Comparative Intelligence`
- Release purpose: Final Phase 3 certification and handover

## Version Matrix

| Component | Version |
|---|---|
| Data version | `phase3-v1.0.0` |
| Method version | `1.0.0` |
| Architecture version | `1.1.0` |
| Response contract version | `1.1.0` |

## Analytical Scope

- Primary metric: `deal_value`
- Minimum group size: `3`
- Canonical dataset: `20` synthetic records
- Standardized columns: `20`
- Approved categories: `Price`, `Competitor`, `Product Fit`, `Timing`, `Budget`

## Grounding Boundary

The deterministic analytical layer is authoritative for numerical results.

The Gemini layer is limited to explaining validated deterministic findings and evidence. It does not calculate independent analytical results or receive the full canonical dataset.

Unsupported predictive, causal, forecasting, arbitrary SQL/code, unrestricted-record, secret/system-prompt, and other out-of-scope requests remain rejected by the assistant scope guard.

## Certification Baseline

The final release must be validated through:

1. Clean-clone validation
2. Canonical data validation
3. Analytical output regeneration
4. Output-contract validation
5. Production build and environment validation
6. Operational regression
7. Data Intelligence validation
8. Assistant validation
9. Automated test suite
10. Selenium validation
11. Final UAT
12. Deployment validation
13. Evidence review
14. Architecture, completion, and handover review
15. Final Repomix generation

## Known Dataset Limitations

The canonical dataset is synthetic and contains 20 records. Results must not be interpreted as causal, predictive, geographically representative, or generalizable beyond the approved Phase 3 analytical scope.

Currency is intentionally unspecified unless explicitly established by the dataset or validated release evidence.

## Release Rule

`phase3-v1.0.0` must point to the final certified commit after all required validation, documentation, evidence, and Repomix corrections are complete.
