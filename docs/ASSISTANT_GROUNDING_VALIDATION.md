# Grounded Data Assistant — Grounding Validation

## Status

Implementation validation is in progress.

## Validation basis

- Approved analytical track: Track A — Comparative Intelligence
- Data version: phase3-v1.0.0
- Method version: 1.0.0
- Retrieval mode: deterministic
- LLM required: no

## Required validation cases

| Case | Expected result |
|---|---|
| Supported question | Deterministic grounded answer with optional Gemini explanation |
| Numeric fidelity | Returned values match approved intelligence output |
| Evidence fidelity | Evidence references match the returned result |
| Limitation fidelity | Approved limitation is preserved |
| Data-version fidelity | phase3-v1.0.0 is preserved |
| Method-version fidelity | 1.0.0 is preserved |
| Missing parameter | Safe validation response |
| Unsupported question | Retrieval blocked |
| Prediction/forecast request | Retrieval blocked |
| Causal request | Retrieval blocked |
| Arbitrary SQL/code | Retrieval blocked |
| All-record request | Retrieval blocked |
| Ranking/score manipulation | Retrieval blocked |
| System prompt request | Retrieval blocked |
| Secret/credential request | Retrieval blocked |
| Prompt injection | Retrieval blocked |
| Source-text injection | Retrieval blocked |
| Invalid category/result reference | Safe validation response |
| Version mismatch | Intelligence response blocked |

## Grounding requirements

The assistant must not invent:

- numbers
- rankings
- scores
- findings
- evidence references
- versions
- limitations

All intelligence values must originate from the validated deterministic
query layer.

## Final evidence

The final validation status will be updated after the complete automated
test suite and required safety/UAT cases have been executed.


## Gemini validation

| Case | Expected result |
|---|---|
| Gemini explanation available | Explanation uses only validated deterministic evidence |
| Gemini API failure | Deterministic answer remains authoritative |
| Missing GEMINI_API_KEY | Controlled Gemini-unavailable fallback |
| Gemini numeric fidelity | No unsupported numeric values appear |
| Gemini finding fidelity | Deterministic rankings/findings are unchanged |
| Gemini limitation fidelity | Approved limitation is preserved |
| Gemini full-dataset exposure | Full dataset is never sent |
| Gemini backend boundary | API key is never exposed to frontend |
| Gemini source-data injection | Instructions contained in data are ignored |

Gemini is an explanation layer only. It does not retrieve data or create new
intelligence.
