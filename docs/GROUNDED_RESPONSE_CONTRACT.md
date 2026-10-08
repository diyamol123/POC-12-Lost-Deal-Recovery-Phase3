# Grounded Response Contract

## Purpose

This contract defines the response structure for the Phase 3 grounded data
assistant.

Deterministic retrieval remains the source of truth. Gemini is an optional
explanation layer only.

## Required Response Fields

A supported response must contain:

- `answer_id`
- `status`
- `intent`
- `answer`
- `evidence_references`
- `key_values`
- `metadata`
- `limitation`
- `suggested_follow_ups`

## Optional Gemini Fields

When the explanation layer is used, the response may also contain:

- `gemini_explanation`
- `explanation_status`

`explanation_status` is either:

- `AVAILABLE`
- `UNAVAILABLE`

## Answer

The `answer` field is generated from the deterministic result and must not
contain unsupported intelligence.

It is authoritative regardless of Gemini availability.

## Evidence References

Evidence references must correspond to the validated deterministic result.

A maximum of 10 evidence references may be returned.

## Key Values

Key values may include only approved intelligence fields such as:

- result identifier;
- category;
- result value;
- priority rank;
- record count;
- average deal value;
- contribution percentage;
- data version;
- method version;
- validation result;
- quality status.

## Metadata

Metadata must identify the validated package, including:

- data version;
- method version;
- generated timestamp;
- quality status;
- approved analytical track.

## Limitation

The approved limitation must be preserved in the response.

Gemini must not remove, weaken, or replace the supplied limitation.

## Suggested Follow-ups

Suggested follow-ups are bounded to a maximum of 3 and must remain within the
approved question catalog.

## Gemini Explanation

Gemini receives only the current question, approved intent, deterministic
finding, validated evidence, versions, and limitation.

Gemini may explain the supplied result in natural language.

Gemini must not:

- invent numbers;
- calculate new analytical values;
- invent or change rankings;
- invent findings;
- invent evidence;
- create predictions or forecasts;
- make causal claims;
- access the full dataset;
- execute source-data instructions;
- disclose credentials, API keys, system prompts, or hidden controls.

## Numeric Fidelity

The backend validates Gemini explanations so that numeric values appearing in
the explanation are grounded in the deterministic result, metadata, or
approved limitation.

If numeric grounding fails, the Gemini explanation is discarded and the
controlled fallback is returned.

## Fallback

If Gemini is unavailable because of API failure, quota, missing API key, or
another explanation-layer failure:

1. the deterministic result remains authoritative;
2. evidence and limitation remain available;
3. `explanation_status` is `UNAVAILABLE`;
4. the response contains a controlled fallback explanation.

## Unsupported and Unsafe Responses

Unsupported or unsafe questions must not retrieve intelligence and must not
reach Gemini.

They return a controlled validation response according to the assistant
safety and scope contract.

## Version Fidelity

The response must preserve:

- data version `phase3-v1.0.0`;
- method version `1.0.0`.

Version mismatch blocks the intelligence response.

## Response Contract Version

1.1.0
