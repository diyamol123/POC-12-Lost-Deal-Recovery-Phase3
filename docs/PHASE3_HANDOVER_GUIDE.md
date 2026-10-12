# Phase 3 Handover Guide

## Production

Production URL:

https://poc-12-lost-deal-recovery.vercel.app

## Approved Intelligence

- Track: `Track A — Comparative Intelligence`
- Data version: `phase3-v1.0.0`
- Method version: `1.0.0`
- Primary metric: `deal_value`
- Minimum group size: 3

## Main Production Endpoints

- `/api/intelligence/status`
- `/api/intelligence/metadata`
- `/api/intelligence/summary`
- `/api/intelligence/results`

## Analytical Limitations

The canonical dataset is synthetic and contains 20 records. Currency is unspecified. Timing and Budget each contain three records. Results are descriptive and must not be treated as causal, predictive, geographically representative, or generally applicable beyond the approved scope.

## Assistant Boundary

The deterministic analytical layer is authoritative. Gemini is an explanation layer only and must not be treated as an independent analytical or retrieval system.

## Validation

The final automated suite passed with 61 tests. Production endpoints were validated after deployment.

## Maintenance

Future changes must preserve the versioned analytical outputs, response contract, assistant grounding boundary, and operational regression boundary. Any material analytical or architectural change requires a new validation cycle rather than modifying the certified release in place.
