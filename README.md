# POC-12 — Lost Deal Recovery

## Phase 3 Certified Release

Phase 3 adds a validated **Data Intelligence** layer to the Lost Deal Recovery application while preserving the existing operational page.

### Release

- Release: `phase3-v1.0.0`
- Track: `Track A — Comparative Intelligence`
- Data version: `phase3-v1.0.0`
- Method version: `1.0.0`
- Architecture version: `1.1.0`
- Response contract: `1.1.0`
- Canonical records: 20
- Standardized columns: 20
- Minimum group size: 3
- Primary metric: `deal_value`

### Analytical scope

The approved intelligence output compares lost-deal value across:

1. Price
2. Competitor
3. Product Fit
4. Timing
5. Budget

The analysis is descriptive and based on the canonical synthetic dataset.

Key validated results:

| Group | Total deal value | Contribution |
|---|---:|---:|
| Price | 4,660,000 | 40.16% |
| Competitor | 3,435,000 | 29.60% |
| Product Fit | 1,440,000 | 12.41% |
| Timing | 1,040,000 | 8.96% |
| Budget | 1,030,000 | 8.88% |

The dataset does not specify a currency.

### Intelligence API

The Phase 3 backend exposes:

- `GET /api/intelligence/status`
- `GET /api/intelligence/metadata`
- `GET /api/intelligence/summary`
- `GET /api/intelligence/results`
- `GET /api/intelligence/results/{result_id}`

The deterministic analytical outputs are authoritative.

### Assistant grounding

Assistant Mode B uses deterministic retrieval as the authoritative source.

Gemini is limited to explaining validated deterministic findings, evidence, versions, quality status, and limitations. It does not receive the full dataset and does not replace the deterministic analytical result.

Fallback behavior remains available when Gemini is unavailable.

### Validation

The final certification evidence covers:

- canonical data validation
- analytical regeneration and validation
- intelligence contract validation
- application build
- operational regression
- Data Intelligence validation
- assistant grounding
- automated tests
- Selenium validation
- final UAT
- production deployment validation
- clean-clone reproducibility
- evidence and handover documentation

### Test baseline

The certified test suite includes the Phase 3 application, backend, intelligence contract, assistant, and Selenium coverage.

Final clean-clone validation must reproduce the same results from the certified repository.

### Deployment

Production:

https://poc-12-lost-deal-recovery.vercel.app

### Evidence

Final evidence is stored under:

```text
final-evidence/
