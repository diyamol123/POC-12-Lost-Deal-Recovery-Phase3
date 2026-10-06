
# Data Intelligence Page Plan

## Scope

Phase 3 Post #4 integrates the approved Post #3 Track A — Comparative Intelligence outputs into a separate Data Intelligence route.

## Existing Operational Route

`/`

The existing operational page source is preserved. Post #4 does not modify `app/page.tsx`.

## New Route

`/data-intelligence`

## Integration Pattern

API-backed integration through the FastAPI intelligence endpoints.

The browser consumes only approved generated intelligence outputs through the API. The canonical CSV is not loaded into the browser.

## Approved Analytical Track

Track A — Comparative Intelligence

## Approved Versions

- Data version: `phase3-v1.0.0`
- Method version: `1.0.0`
- Quality status: `validated`

## Rendering Gate

The frontend requests `/api/intelligence/status` first.

Only a `validated` status permits the result package to render.

A stale/version/quality/validation mismatch is displayed as a controlled stale state and affected analytical results are withheld.

## UI

The page contains:

- version and generation metadata
- validation/freshness status
- summary cards
- contract-derived filters
- comparative ranking
- key findings
- result evidence
- methodology
- approved limitations
- loading, empty, error and stale states
- navigation to Operational View

## Navigation

A shared navigation shell provides links between:

- Operational View
- Data Intelligence

The existing `app/page.tsx` component remains untouched.

## Testing

Coverage includes:

- contract validation
- API/output contract
- UI contract
- operational regression
- Selenium end-to-end journey

## Preservation Rule

No analytical calculation is performed in the frontend and no second analytical result package is created.
