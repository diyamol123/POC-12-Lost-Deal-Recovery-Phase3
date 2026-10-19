# Final Assistant Validation Report

## Status

**Executed validation checks passed for the documented Phase 3 grounded-assistant scope. The Vercel dashboard screenshot captured on 2026-10-18 shows commit `96c9730` as Ready in Production, matching local `main` at the time of review. Commit `9c795a6` is historical deployment evidence. Final Phase 3 certification remains pending the security-risk decision and completion of the release evidence review.**

This report distinguishes checks recorded as executed from protections documented as implemented but not separately exercised end-to-end.

## Approved Scope

- **Track:** Track A — Comparative Intelligence
- **Data version:** `phase3-v1.0.0`
- **Method version:** `1.0.0`
- Deterministic retrieval is authoritative.
- Gemini is an optional explanation layer only.
- Results are descriptive and do not establish causality.

## Executed Assistant Validation

The existing grounding-validation and assistant-UAT reports record successful execution of the following scenarios:

- Supported grounded questions, including top categories and category ranking.
- Numeric fidelity for Price (`4,660,000`) and Competitor (`3,435,000`).
- Evidence fidelity for `POC12-CAT-01` and `POC12-CAT-02`.
- Data-version and method-version fidelity.
- Preservation of approved limitations.
- Rejection of an unsupported predictive request.
- Real Gemini explanation with deterministic findings and evidence preserved.
- Gemini-unavailable fallback with the deterministic answer retained.
- Missing-`GEMINI_API_KEY` fallback.
- Mobile layout validation at 500 × 844, as documented in the existing UAT report.
- Operational-page regression through the Selenium journey.

The documented real Gemini execution reported `explanation_status=AVAILABLE`. The documented fallback returned `explanation_status=UNAVAILABLE` while preserving the deterministic answer and evidence.

These results reflect the recorded validation evidence; they do not imply that every assistant safety control was individually exercised end-to-end.

## Current Automated Verification

The following checks passed during the final local validation pass:

| Check | Result |
|---|---|
| Python test suite (`PYTHONPATH=. python3 -m pytest tests -q`) | 61 passed (current clean-clone run) |
| TypeScript intelligence output contract (`npx tsx tests/intelligence-contract/test_intelligence_validator.test.ts`) | 2 passed, 0 failed |
| Selenium Data Intelligence journey | 1 passed |
| ESLint (`npm run lint`) | Passed |
| Next.js production build | Passed on Next.js 16.4.1 |
| Production dependency audit (`npm audit --omit=dev`) | 0 vulnerabilities reported |
| Full dependency audit (`npm audit`) | 0 vulnerabilities reported (current clean-clone run) |

The Python, TypeScript, and Selenium results were recorded from separate commands. They are reported separately and are not represented as one combined test-suite count.

The clean-clone validation record also reports successful Python tests, TypeScript contract validation, ESLint, and a production build.

## Security Audit Notes

An earlier dependency audit reported five high-severity findings associated with a development dependency chain involving `braces`, `micromatch`, `fast-glob`, `@next/eslint-plugin-next`, and `eslint-config-next`. The suggested automatic fix would downgrade `eslint-config-next` to `14.2.35`, which was not appropriate for this Next.js 16 project and was not applied.

After the dependency update recorded in commit `c4e45b8`, the current clean-clone `npm audit` reports zero vulnerabilities, and `npm explain braces` reports no matching installed dependency. These current results do not erase the historical audit findings; the audit should be rerun if the dependency tree changes.

## Controls Not Separately Exercised End-to-End

The existing grounding-validation and UAT reports mark the following cases `IMPLEMENTED` rather than independently executed end-to-end:

- Prompt injection and source-text injection.
- System-prompt, secret, and credential requests.
- Arbitrary SQL/code and unrestricted all-record requests.
- Causal requests and ranking/score manipulation.
- Invalid category/result references and version mismatch.
- Full-dataset exposure prevention in the Gemini grounding payload.

These protections are documented as implemented or covered by code-path review. This report does not claim a separate end-to-end execution for each one.

## Production Deployment and Snapshot

Historical production checks recorded successful HTTP 200 responses from the following endpoints:

- `/api/intelligence/status`
- `/api/intelligence/metadata`
- `/api/intelligence/summary`
- `/api/intelligence/results`

The historical checks recorded a validated status response, successful metadata validation, five approved rankings, and five results with valid pagination.

The recorded production snapshot timestamp was `2026-10-11T12:34:47Z`. This is older than the local analytical outputs regenerated during final validation. The difference is documented as a snapshot-timestamp difference; it is not evidence of a fresh production data regeneration.

Live production checks performed during this review returned HTTP 200 for `/api/intelligence/health`, `/api/intelligence/metadata`, `/api/intelligence/summary`, and `/api/intelligence/status`. The health endpoint returned `ok`, and the status endpoint reported `validated`. The production snapshot timestamp was `2026-10-11T12:34:47Z`, earlier than the local outputs regenerated on October 15. The contract reviewed does not define a maximum snapshot age, so this difference is documented without claiming that it proves staleness. The Vercel dashboard screenshot captured on 2026-10-18 shows commit `96c9730` as Ready in Production, matching local `main` at the time of review. The earlier `9c795a6` deployment is historical evidence, not a guarantee of ongoing availability.

## Conclusion

The recorded assistant validation, fallback checks, intelligence contract, automated tests, linting, browser journey, and Next.js production build passed within their documented scopes.

The current clean-clone dependency audit reports zero vulnerabilities; the five high-severity findings described above belong to the earlier dependency state. Live production checks returned HTTP 200 for the four reviewed intelligence endpoints, with health reported as `ok` and status as `validated`. The production snapshot timestamp predates local regeneration, and the reviewed contract defines no maximum snapshot age; this difference alone does not establish staleness. The safety controls listed as `IMPLEMENTED` have not all been individually exercised end-to-end.

Final Phase 3 certification remains pending the security-risk decision, release evidence review, and final repository and Repomix checks.

## Dependency Audit Scope — Verification

The dependency-scope verification recorded the following results:

- `npm audit --omit=dev`: zero vulnerabilities reported.
- `npm audit`: the current clean-clone audit reported zero vulnerabilities; an earlier audit reported five high-severity findings before the dependency update.
- `npm ls braces micromatch fast-glob --omit=dev`: the production dependency tree was empty for these packages.
- Historical `npm explain braces` output identified `braces@3.0.3` in the earlier development dependency chain. In the current clean clone, `npm explain braces` reports no matching installed dependency.

The earlier audit results describe the historical dependency state. The current clean-clone full audit reports zero vulnerabilities. The suggested downgrade of `eslint-config-next` to `14.2.35` was not applied because the project uses Next.js 16.4.1.

**Status:** Current dependency audit is clean in this clone. Final release certification still requires completion of the release evidence review and an authorized reviewer decision; this report does not independently grant certification.


## Current Clean-Clone Test Count Note

The current Python suite result is 61 passed. The 30 assistant security tests are a subset of that suite and must not be added again. The standalone Selenium journey passed separately and is not included in the Python test count. Earlier reports showing 59 Python tests reflect an earlier run.
