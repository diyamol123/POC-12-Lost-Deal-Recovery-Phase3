# Phase 3 Release Manifest

## Release Identity

- PoC ID: `POC-12`
- PoC title: `Lost Deal Recovery`
- Repository: https://github.com/diyamol123/POC-12-Lost-Deal-Recovery-Phase3
- Production URL: https://poc-12-lost-deal-recovery.vercel.app/
- Release status: Candidate; final certification approval pending
- Track: `Track A — Comparative Intelligence`
- Release purpose: Phase 3 certification review and technical handover

## Version Matrix

| Component | Version |
|---|---|
| Data version | `phase3-v1.0.0` |
| Method version | `1.0.0` |
| Architecture version | `1.1.0` |
| Response contract version | `1.1.0` |

## Commit and Tag Integrity

- Baseline evidence/documentation commit before the latest merge: `2f91541f83783918e8f861f00ff7868149f07ff6`
- Selected merged candidate commit: `c48bf631b1d834e8d3074e28ebd26a1b68967ce6`
- Production deployment commit: `d40e674914642f5114c8457609e26d6255b9b6a2` (Vercel Production screenshot reviewed 2026-10-29)
- Latest deployment status: `Ready`; operator reports no build or runtime errors.
- Existing annotated tag: `phase3-v1.0.0`
- Existing tag target: `142b3947a573f3bff2591520f80f61d5728cd9d4`
- Tag disposition: Preserve the existing tag and its target. Do not move it.
- Final release tag/identity: To be proposed and approved by the authorized maintainer after all required validation.

The baseline evidence commit, selected merged candidate, production revision, and existing tag target are distinct release-integrity facts. The existing tag does not certify the newer candidate. Deployment readiness does not establish that every validation suite was rerun against the selected candidate.

## Production Validation Evidence

The deployment report records a production recheck in which:

- The dashboard returned HTTP 200.
- `/api/deals` returned HTTP 200.
- A supported top-categories assistant query returned `SUPPORTED`.
- The assistant explanation status was `AVAILABLE`.

These observations establish endpoint responsiveness at the time of the recorded check. Consult `DEPLOYMENT_VALIDATION_REPORT.md` for the recorded revision and test context. Re-run the required production checks after the final candidate deployment and update the report with the exact revision and date.

## Analytical Scope

- Primary metric: `deal_value`
- Minimum group size: `3`
- Canonical dataset: `20` synthetic records
- Standardized columns: `20`
- Approved categories: `Price`, `Competitor`, `Product Fit`, `Timing`, `Budget`

## Grounding Boundary

The deterministic analytical layer is authoritative for numerical results.

The Gemini layer is limited to explaining validated deterministic findings and evidence. It must not independently calculate analytical results or receive the full canonical dataset.

Unsupported predictive, causal, forecasting, arbitrary SQL/code, unrestricted-record, secret/system-prompt, and other out-of-scope requests must remain rejected by the assistant scope guard.

## Certification Baseline

The final release candidate must be validated through:

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
16. Dependency security audit on the selected candidate
17. Focused assistant tests for incorrect numbers and contradictory explanations
18. Desktop and mobile demonstration review

Historical test results must be identified as historical unless rerun against the selected candidate. Do not report unexecuted tests as passing.

## Evidence Index

- `CLEAN_CLONE_VALIDATION_REPORT.md`
- `CANONICAL_DATA_PACKAGE_VALIDATION.md`
- `ANALYTICAL_VALIDATION_REPORT.md`
- `FINAL_ANALYTICAL_REVALIDATION.md`
- `FINAL_AUTOMATED_TEST_REPORT.md`
- `FINAL_OPERATIONAL_REGRESSION_REPORT.md`
- `FINAL_DATA_INTELLIGENCE_VALIDATION.md`
- `FINAL_ASSISTANT_VALIDATION.md`
- `ASSISTANT_UAT.md`
- `ASSISTANT_GROUNDING_VALIDATION.md`
- `PHASE3_FINAL_UAT.md`
- `DEPLOYMENT_VALIDATION_REPORT.md`
- `PHASE3_COMPLETION_REPORT.md`
- `PHASE3_HANDOVER_GUIDE.md`
- `repomix-phase3-pre-certification.xml` (historical pre-certification snapshot)
- `repomix-phase3-final-candidate.xml` (fresh snapshot generated from working tree revision `b23b2ab73c4b891bed22e5599545985622570288`; XML parsing, excluded-path check, whitespace check, and common secret-pattern scan passed; candidate-specific validation and final certification approval remain pending)

Verify that each referenced artifact exists and corresponds to the intended candidate before final submission.

## Known Dataset Limitations

The canonical dataset is synthetic and contains 20 records. Results must not be interpreted as causal, predictive, geographically representative, or generalizable beyond the approved Phase 3 analytical scope.

Currency is intentionally unspecified unless explicitly established by the dataset or validated release evidence.

Sensitivity analysis indicates that removing record `CRM-012` changes the leading category from Price to Competitor. This is a ranking-sensitivity finding, not proof of causality or guaranteed recoverable revenue.

## Release Rule

The existing `phase3-v1.0.0` tag must not be moved silently. The authorized maintainer must approve the final release identity after required validation, documentation, evidence, deployment checks, and Repomix generation are complete.

Final certification remains pending until that review and approval are recorded.
## Latest Validation Evidence

### Automated Test Run

- **Tested checkout:** `32e2c858f57ef8c9a550888de487c003d822b2cc`
- **Selected merged candidate:** `c48bf631b1d834e8d3074e28ebd26a1b68967ce6`
- **Command:** `APP_BASE_URL=http://localhost:3002 PYTHONPATH=. python3 -m pytest tests -q`
- **Result:** 61 passed, 0 failed
- **Execution time:** 1.86 seconds
- **Selenium Data Intelligence journey:** 1 passed in 2.05 seconds
- **Scope:** The diff between the tested checkout and selected candidate contains only `.gitignore`, deployment documentation, release-manifest documentation, and the generated Repomix snapshot. No application or test source files differ.

### Dependency Audit

- **Audited checkout:** `86b656f68a3e1cbb6a7a17f4c3c04d4e5752ad62`
- **Command:** `npm audit`
- **Reported result:** 0 vulnerabilities
- **Scope note:** This result applies to the dependencies and lockfile in the audited checkout. It does not replace the required review of historical security findings or other release risks.

### Production Deployment Verification

- **Production URL:** https://poc-12-lost-deal-recovery.vercel.app/
- **Production commit:** `86b656f68a3e1cbb6a7a17f4c3c04d4e5752ad62` — reported by the operator as matching the current GitHub commit.
- **Operator smoke check:** Dashboard, deals data, Data Intelligence, and assistant features reported working.
- **Evidence limitation:** The commit alignment and smoke-check results are operator-confirmed; retain the corresponding Vercel deployment details and dated endpoint checks as supporting evidence.

### Certification Status

Release status remains **Candidate — final certification approval pending**. Final certification requires completion and review of all required validation evidence, confirmation that referenced artifacts correspond to the intended release, and recorded approval from the authorized maintainer.