
# Data Intelligence UI Specification

## Route

`/data-intelligence`

## Required States

### Loading

Skeleton content while status/package requests are pending.

### Validated

Normal intelligence page with approved metadata, summary, filters, ranking, evidence, methodology and limitations.

### Empty

A clear no-matching-results state appears when active filters produce no result.

### Error

Unsafe/unavailable intelligence data is withheld and a retry plus Operational View navigation is shown.

### Stale

Version, timestamp, quality or validation mismatch is explicitly identified. Affected results are not rendered as current.

## Required Metadata

- data version
- method version
- generated timestamp
- quality status
- approved track

## Filters

Only contract-supported fields are exposed.

## Evidence

The evidence panel shows the approved finding, record count, average, contribution, record IDs, quality, limitation and versions.

## Methodology

Methodology wording remains descriptive and grounded in the approved Track A method.

## Limitations

The page renders the approved `important_limitations` output and does not invent additional interpretation restrictions.

## Responsive Behaviour

The layout uses responsive grid/flex classes and the evidence panel is full-width on narrow screens.
