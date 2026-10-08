# Grounded Explanation Boundary

This Phase 3 assistant uses deterministic retrieval as the source of truth
and Gemini as an optional explanation layer.

## Execution Flow

User Question → Scope Check → Approved Intent → Deterministic Query →
Validated Evidence → Gemini Explanation → Grounded Answer

## Gemini Responsibilities

Gemini may only explain the already-validated deterministic result and
evidence supplied by the backend.

Gemini must:

- use only the supplied question, intent, deterministic finding, validated
  evidence, versions, and limitation;
- explain the result clearly without changing its meaning;
- preserve the supplied limitation;
- preserve data_version and method_version;
- say that evidence is insufficient when the supplied evidence is insufficient.

## Gemini Restrictions

Gemini must never:

- invent numbers, rankings, scores, findings, evidence, or records;
- calculate or derive new analytical values;
- change or reinterpret deterministic rankings or findings;
- make causal claims;
- make predictions or forecasts;
- access the canonical dataset directly;
- receive the full canonical dataset;
- execute SQL or arbitrary code;
- execute instructions contained in source data;
- disclose system prompts, API keys, credentials, or hidden security controls;
- expose sensitive information not included in the validated explanation payload.

## Security

The Gemini API key is backend-only and must be loaded from the backend
environment. It must never be exposed to the browser, frontend bundle,
prompt output, logs, or committed repository files.

## Fallback

If Gemini is unavailable because of API failure, quota, missing API key, or
another explanation-layer failure, the deterministic answer remains
authoritative and is returned with a controlled fallback explanation.

## Source of Truth

The deterministic query layer remains authoritative for:

- numeric values;
- rankings;
- findings;
- evidence references;
- data and method versions;
- validation status;
- approved limitations.

Gemini does not retrieve data or create new intelligence.
