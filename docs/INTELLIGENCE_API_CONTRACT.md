
# Intelligence API Contract

## Endpoints

### GET `/api/intelligence/status`

Returns:

- `status`: `validated`, `stale`, or `error`
- approved metadata when validated
- controlled diagnostic detail when stale/error

### GET `/api/intelligence/health`

Returns a lightweight health state without exposing canonical data.

### GET `/api/intelligence/metadata`

Returns approved metadata and validation output.

### GET `/api/intelligence/summary`

Returns the approved intelligence summary.

### GET `/api/intelligence/results`

Supported filters:

- `result_type`
- `result_category`
- `group_key`
- `quality_status`

Supported sorting:

- `priority_rank`
- `result_value`
- `group_key`

Supported ordering:

- `asc`
- `desc`

Pagination:

- `page >= 1`
- `1 <= page_size <= 100`

Invalid pagination and sort parameters return HTTP 400.

Missing, malformed, stale or unapproved intelligence outputs are not silently rendered; the API returns HTTP 503 for result/summary/metadata endpoints.

### GET `/api/intelligence/results/{result_id}`

Returns one approved result or HTTP 404.

## Browser Data Boundary

The API never exposes the canonical CSV as a frontend data source.

## Validation

The backend validates versions, approved track, quality status, generated timestamps, required fields and result uniqueness before serving analytical results.
