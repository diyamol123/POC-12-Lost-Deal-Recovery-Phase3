# Assistant Suitability Assessment

## Target User

Users of the Lost Deal Reason & Recovery Intelligence interface who need
quick natural-language access to validated comparative intelligence.

## Existing Operational and Intelligence Experience

The existing Phase 3 application provides a Data Intelligence page with
comparative rankings, category totals, average deal values, contribution
percentages, evidence, validation status, methodology, versions, filters,
and limitations.

## User Questions Not Solved Conveniently Today

Users may still need to navigate tables and rankings to answer common
questions such as:

- Which category has the highest total deal value?
- What are the top lost-deal categories?
- What is the ranking of a particular category?
- Why is a category ranked where it is?
- What evidence supports a result?
- How do two categories compare?
- What are the analysis limitations?
- What are the current data and method versions?
- What is the current validation status?

## Proposed Supported Questions

The assistant supports exactly nine approved question patterns:

1. Highest total deal-value category
2. Top lost-deal categories by total deal value
3. Ranking of a particular category
4. Explanation of a category's current ranking
5. Evidence supporting a particular intelligence result
6. Comparison of two supported categories
7. Analysis limitations
8. Current data and method versions
9. Current validation status

## Deterministic Retrieval Mapping

Every supported intent maps to an approved deterministic query function.

The deterministic query layer validates the question parameters, retrieves
only from the validated Track A intelligence package, applies result and
evidence limits, and returns structured evidence and metadata.

## Evidence Availability

Each supported result is grounded in the validated intelligence package.

Evidence references, numeric values, findings, rankings, versions, and
limitations originate from the deterministic result.

## Security and Privacy

The assistant does not provide unrestricted canonical-data access.

Unsupported, unsafe, injection, prediction, causal, arbitrary SQL, arbitrary
code, all-record, secret, and system-prompt requests are blocked.

Persistent assistant memory is disabled.

## Deployment Feasibility

The deterministic assistant is already integrated into the backend and
Data Intelligence interface.

Gemini is accessed only by the backend through `GEMINI_API_KEY`. The key is
not exposed to the frontend and is not committed to the repository.

## Value Beyond Filters and Tables

The assistant reduces navigation effort for a bounded set of recurring
intelligence questions and can provide a concise natural-language
explanation of already-validated evidence.

It does not replace the intelligence tables or create unrestricted
question-answering over the dataset.

## Deterministic Versus LLM Decision

Deterministic retrieval remains mandatory and authoritative.

Following reviewer direction, Gemini is used as an optional explanation
layer for hands-on LLM API experience.

Gemini receives only:

- the current user question;
- approved intent;
- deterministic finding;
- validated evidence;
- data and method versions;
- approved limitation.

Gemini does not receive the full dataset and cannot create new findings,
numbers, rankings, predictions, or causal claims.

## Approved Assistant Mode

Mode B — Deterministic Retrieval + LLM Explanation.

The deterministic layer remains the source of truth. If Gemini is unavailable,
the deterministic answer remains available through a controlled fallback.

## Skip Rationale, If Applicable

The assistant is not skipped. The original deterministic-only design was
suitable, but the reviewer requested a grounded Gemini explanation layer for
LLM API experience.

## Result

ASSISTANT SUITABLE

## Assessment Version

1.1.0
