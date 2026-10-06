# Data Intelligence UAT

## Test Matrix

| Test | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|
| Route access | Data Intelligence page opens | Data Intelligence route opened successfully during the Selenium journey | PASS | `tests/selenium/test_data_intelligence_journey.py` |
| Summary | Approved summary values are displayed | Approved Track A metadata, data version and method version were visible | PASS | Selenium journey |
| Filters | Contract-derived filters update results | Contract-derived filter controls were exercised successfully | PASS | Selenium journey + `tests/intelligence-ui` |
| Primary view | Approved Track A output is visible | Track A Comparative Intelligence output and comparative ranking were visible | PASS | Selenium journey |
| Evidence | Supporting values are accessible | Result evidence, finding, supporting evidence and limitation were accessible | PASS | Selenium journey |
| Methodology | Method and versions are visible | Methodology and data/method versions were visible | PASS | Selenium journey |
| Limitations | Approved warnings are visible | Approved limitations and unsupported uses were visible | PASS | Selenium journey |
| Error state | Unsafe source fails safely | Controlled API/UI error handling is covered by automated tests; no unsafe rendering observed | PASS | `tests/intelligence-api`, `tests/intelligence-ui` |
| Stale state | Version mismatch is clearly displayed | Controlled stale-state withholding is covered by automated UI tests | PASS | `tests/intelligence-ui` |
| Mobile | Layout remains usable | Responsive classes/specification are implemented, but no dedicated mobile browser runtime evidence was captured | NOT RUNTIME VALIDATED | UI specification |
| Regression | Operational page remains functional | Operational route/source regression tests passed and Selenium returned successfully to Operational View | PASS | `tests/regression` + Selenium |

## Automated Coverage

- `tests/intelligence-contract`
- `tests/intelligence-api`
- `tests/intelligence-ui`
- `tests/regression`
- `tests/selenium`

## Validation Result

- Next.js production build: PASS
- API/UI/regression automated tests: 19 passed
- Selenium end-to-end journey: 1 passed
- Mobile browser runtime validation: PASS — both `/` and `/data-intelligence` passed at mobile viewport with no horizontal overflow
- Accessibility validation: PASS — Data Intelligence page basic accessibility labeling checks passed
- Screenshot evidence: PASS
  - `evidence/screenshots/desktop_operational.png`
  - `evidence/screenshots/desktop_data_intelligence.png`
  - `evidence/screenshots/mobile_operational.png`
  - `evidence/screenshots/mobile_data_intelligence.png`
  - `evidence/screenshots/desktop_data_intelligence_evidence.png`
- Reviewer approval: pending

The UAT records completed validation as PASS. Final reviewer approval remains pending.

### Container Build Validation

- Container Build: PASS
- Container Image: `poc-12-lost-deal-recovery-phase3`
- Container Runtime: PASS
- Data Intelligence Route: `http://localhost:3003/data-intelligence`
- Runtime HTTP Result: `HTTP/1.1 200 OK`
