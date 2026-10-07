# Grounded Data Assistant — Safety and Scope

## Status

This assistant is a deterministic, bounded interface over the approved
Track A — Comparative Intelligence outputs.

LLM use is not required.

## Supported scope

The assistant supports only the approved question catalog:

1. Highest total deal-value category
2. Top lost-deal categories by total deal value
3. Ranking of a particular category
4. Explanation of a category's current ranking
5. Evidence supporting a particular intelligence result
6. Comparison of two supported categories
7. Analysis limitations
8. Current data and method versions
9. Current validation status

## Scope statuses

- SUPPORTED
- MISSING_PARAMETER
- AMBIGUOUS
- OUT_OF_SCOPE
- UNSAFE
- UNAVAILABLE

Only SUPPORTED questions may reach deterministic retrieval.

## Safety controls

The assistant rejects or blocks:

- system prompt requests
- secret or credential requests
- prompt injection instructions
- source-text injection instructions
- arbitrary SQL
- arbitrary code execution
- user-supplied paths
- requests for all canonical records
- prediction or forecasting
- causal inference
- ranking or score manipulation
- unsupported questions
- result limits above 25

## Data access

The assistant does not provide unrestricted access to the canonical dataset.
Retrieval is performed only through approved deterministic query functions.

## Evidence

Answers must be grounded in the validated Track A intelligence package.
Evidence references must correspond to the returned result.

## Version safety

The assistant must verify the approved data version and method version before
returning intelligence results.

## Security boundary

User questions and source data are treated as untrusted input.
Instructions contained inside source data must never become executable
assistant instructions.

## Memory

Persistent assistant memory is disabled.

## Logging

Logs must not contain secrets, credentials, system prompts, or unrestricted
canonical records.
