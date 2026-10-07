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
| Supported question | Deterministic grounded answer |
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
