
# Operational Page Regression Report

## Existing Route

`/`

## Existing Primary Visual

Lost Deal Reason & Recovery Intelligence dashboard.

## Existing Filter / Interaction

The operational page retains its existing filters including location, team, product, segment, reason and priority.

## Existing API / Data Source

`GET /api/deals`

## Navigation

Post #4 adds shared navigation between Operational View and Data Intelligence without changing `app/page.tsx`.

## Mobile Behaviour

The existing page source remains intact. Post #4 adds responsive shared navigation and a separate responsive Data Intelligence route.

## Existing Automated Tests

Source-level regression tests verify the operational route, primary components, API call and existing filters remain present.

## Post #4 Regression Checks

- operational source remains present
- operational API remains `/api/deals`
- operational components remain present
- Data Intelligence is a separate route
- no Post #4 analytical UI is inserted into `app/page.tsx`

## Issues Found

- missing reverse navigation
- hard-coded result-category filters
- validator hard-coded record count
- stale state could not be safely represented
- API negative paths were under-tested
- Selenium journey was incomplete
- UAT/runtime evidence was incomplete

## Corrections Applied

- shared navigation added
- contract-derived filters added
- hard-coded record count removed
- status-first stale/error gate added
- API validation/error handling strengthened
- UI contract tests added
- regression tests strengthened
- Selenium journey expanded
- methodology and limitation rendering grounded in approved outputs

## Final Regression Result

PASS — operational-page source regression tests passed, the production build passed, the API/UI/regression test suite passed, and the Selenium journey successfully returned from Data Intelligence to the Operational View.

Remaining release evidence:
- final reviewer approval is pending


## Final Post #4 Evidence

- Screenshot evidence: PASS
- Desktop Operational View: `evidence/screenshots/desktop_operational.png`
- Desktop Data Intelligence: `evidence/screenshots/desktop_data_intelligence.png`
- Mobile Operational View: `evidence/screenshots/mobile_operational.png`
- Mobile Data Intelligence: `evidence/screenshots/mobile_data_intelligence.png`
- Data Intelligence evidence/methodology/limitations: `evidence/screenshots/desktop_data_intelligence_evidence.png`
- Data Intelligence accessibility validation: PASS
- Mobile runtime validation: PASS
- Reviewer approval: pending
