# Assistant Query Contract

## Supported Intents

The assistant supports exactly these intents:

- top_category
- top_categories
- category_rank
- category_explanation
- category_evidence
- compare_categories
- analysis_limitations
- package_versions
- validation_status

## Allowed Parameters

- category
- category_a
- category_b
- limit

Parameters are supplied only where required by the approved intent.

## Parameter Types and Limits

- Category parameters must be strings matching an approved intelligence group.
- Category strings are limited to 100 characters.
- `limit` must be an integer from 1 through 25.
- User questions are limited to 500 characters.
- Evidence references are limited to 10.
- Suggested follow-ups are limited to 3.

## Query Functions

| Intent | Query Function |
|---|---|
| top_category | get_top_category |
| top_categories | get_top_categories |
| category_rank | get_category_rank |
| category_explanation | get_category_explanation |
| category_evidence | get_category_evidence |
| compare_categories | compare_categories |
| analysis_limitations | get_analysis_limitations |
| package_versions | get_package_versions |
| validation_status | get_validation_status |

## Approved Sources

The only intelligence source is the validated Track A — Comparative
Intelligence package.

The query layer verifies the approved track, validation status, data version,
method version, and package consistency before returning intelligence.

## Evidence Fields

Validated evidence may include:

- result identifier;
- category/group key;
- priority rank;
- record count;
- total deal value;
- average deal value;
- contribution percentage;
- evidence references;
- data version;
- method version;
- validation result;
- quality status.

## Result Limits

The assistant returns no more than 25 result groups and 10 evidence
references.

No unrestricted canonical-record access is permitted.

## Error Responses

The service may return controlled validation errors for:

- missing required parameters;
- invalid category;
- invalid result reference;
- invalid result limit;
- unsupported intent;
- unsafe question;
- version mismatch;
- invalid deterministic result package.

## Out-of-Scope Handling

Prediction, forecasting, causal inference, arbitrary SQL, arbitrary code,
unrestricted record access, score/ranking manipulation, system prompt
disclosure, secret retrieval, and other unsupported requests are rejected.

Out-of-scope requests do not reach deterministic retrieval or Gemini.

## Unsafe Handling

Prompt injection and source-text injection are blocked before retrieval.

Instructions contained inside source data are treated as untrusted data and
are never executed.

## Version Behaviour

The approved data version is `phase3-v1.0.0`.

The approved method version is `1.0.0`.

A version mismatch blocks the intelligence response rather than silently
mixing incompatible results.

## Gemini Explanation Contract

Gemini is not a query function and does not replace deterministic retrieval.

After successful deterministic retrieval, the backend may send Gemini only:

- the current question;
- approved intent;
- deterministic finding;
- selected validated evidence;
- data version;
- method version;
- quality status;
- approved limitation.

Gemini must not receive the full canonical dataset.

Gemini must not create new numbers, rankings, scores, findings, evidence,
predictions, forecasts, or causal claims.

If Gemini fails, the deterministic result remains authoritative and a
controlled fallback is returned.

## Backend Security

`GEMINI_API_KEY` is a backend-only environment variable.

It must never be exposed through frontend code, browser responses, logs,
committed files, or user-visible prompts.

## Contract Version

1.1.0
