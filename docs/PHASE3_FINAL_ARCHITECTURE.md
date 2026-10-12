# Phase 3 Final Architecture

## Overview

Phase 3 adds a separate Data Intelligence capability to the existing Lost Deal Recovery application.

## Layers

### Canonical Data

The approved synthetic canonical dataset contains 20 records and 20 standardized columns.

### Analytical Layer

Track A — Comparative Intelligence calculates deterministic descriptive results using `deal_value` and a minimum group size of 3.

### Intelligence API

The backend exposes validated intelligence metadata, summary, and result endpoints.

### Data Intelligence UI

The frontend consumes the validated intelligence contract and displays rankings, evidence, methodology, limitations, and controlled states.

### Assistant

The assistant uses deterministic retrieval. Gemini is an optional explanation layer and does not independently calculate analytical results or receive the full canonical dataset.

### Deployment

The frontend and backend are deployed through the Vercel Phase 3 project.

## Version Matrix

| Component | Version |
|---|---|
| Data | `phase3-v1.0.0` |
| Method | `1.0.0` |
| Architecture | `1.1.0` |
| Response contract | `1.1.0` |

## Regression Boundary

The existing operational page remains separate and was regression-tested during final validation.
