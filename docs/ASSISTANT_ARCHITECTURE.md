# Assistant Architecture

## Existing Application

The Phase 3 application contains a Data Intelligence interface backed by the
validated Track A — Comparative Intelligence package.

The assistant is integrated with the existing backend and frontend.

## Assistant Mode

Mode B — Deterministic Retrieval + LLM Explanation.

Deterministic retrieval is the source of truth. Gemini is an optional
explanation layer.

## Integration Route / Component

Backend:

- backend/main.py
- backend/assistant/router.py
- backend/assistant/scope.py
- backend/assistant/queries.py
- backend/assistant/service.py
- backend/assistant/gemini_explanation.py

Frontend:

- app/services/assistantService.ts
- app/components/grounded-assistant/GroundedAssistant.tsx
- app/data-intelligence/page.tsx

## Execution Flow

User Question
→ Scope Check
→ Approved Intent
→ Parameter Validation
→ Deterministic Query
→ Validated Evidence Package
→ Gemini Explanation (optional)
→ Response Validation
→ Grounded Answer + Evidence + Limitation + Versions

Gemini cannot bypass the deterministic retrieval layer.

## Scope Guard

The scope guard rejects empty, oversized, unsupported, unsafe, injection,
prediction, causal, arbitrary SQL, arbitrary code, unrestricted-record,
secret, and system-prompt requests.

Maximum question length is 500 characters.

## Intent Classification

Only the nine approved intents in the question catalog are accepted.

Each accepted intent maps to one approved deterministic query function.

## Parameter Validation

Parameters are validated before retrieval.

Category names must match approved intelligence groups. Result limits are
bounded to 25 and evidence references are bounded to 10.

Missing, invalid, ambiguous, unsupported, or unsafe parameters do not proceed
to retrieval.

## Query Catalog

The approved query functions are:

- get_top_category
- get_top_categories
- get_category_rank
- get_category_explanation
- get_category_evidence
- compare_categories
- get_analysis_limitations
- get_package_versions
- get_validation_status

## Deterministic Retrieval

The query layer retrieves only from the validated Track A intelligence
package.

It verifies approved track, validation status, data version, method version,
and package consistency before returning intelligence.

## Evidence Builder

The deterministic response contains structured evidence references,
key values, metadata, limitations, and bounded follow-up questions.

Evidence references are capped at 10.

## Optional LLM Explanation

Gemini receives only:

- current question;
- approved intent;
- deterministic finding;
- selected validated evidence;
- data version;
- method version;
- quality status;
- approved limitation.

Gemini does not receive the full dataset.

Gemini may explain the result but may not create new intelligence.

## Response Validation

The backend validates the Gemini explanation for numeric grounding.

The explanation must not introduce numeric values absent from the deterministic
result, metadata, or approved limitation.

The deterministic response remains authoritative even when Gemini is
unavailable.

## Authentication and Authorization

The Gemini API key is backend-only and is loaded from the backend environment.

The key must not be exposed to browser code, frontend configuration, logs,
prompts, or committed repository files.

## Logging

Logs must not contain API keys, credentials, system prompts, or unrestricted
canonical records.

## Error Handling

If deterministic retrieval fails validation, the intelligence response is
blocked.

If Gemini fails because of missing configuration, API failure, quota, or
another explanation-layer failure, the deterministic answer is returned with
a controlled Gemini-unavailable fallback.

## Deployment

The backend must provide GEMINI_API_KEY through secure environment
configuration.

The frontend does not access Gemini directly.

## Limitations

The assistant is limited to the approved question catalog and the validated
Track A package.

The underlying analysis is descriptive and uses 20 synthetic canonical
records. Timing and Budget contain only three records each, currency is
unspecified, and the sample may not represent the complete operational
population.

The assistant does not support causal inference, predictive scoring,
forecasting, or unrestricted data exploration.

## Architecture Version

1.1.0
