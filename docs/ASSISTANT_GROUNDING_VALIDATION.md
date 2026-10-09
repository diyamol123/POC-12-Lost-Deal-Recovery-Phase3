# Grounded Data Assistant — Grounding Validation

## Status

Implementation grounding validation completed for the executed Phase 3
grounded assistant flow.

## Validation basis

- Approved analytical track: Track A — Comparative Intelligence
- Data version: phase3-v1.0.0
- Method version: 1.0.0
- Retrieval mode: deterministic
- LLM required: no

## Required validation cases

| Case | Expected result | Status / evidence |
|---|---|---|
| Supported question | Deterministic grounded answer with optional Gemini explanation | PASS — supported questions verified |
| Numeric fidelity | Returned values match approved intelligence output | PASS — Price ₹46,60,000 and Competitor ₹34,35,000 verified |
| Evidence fidelity | Evidence references match the returned result | PASS — POC12-CAT-01 and POC12-CAT-02 verified |
| Limitation fidelity | Approved limitation is preserved | PASS — descriptive/non-causal limitation preserved |
| Data-version fidelity | phase3-v1.0.0 is preserved | PASS |
| Method-version fidelity | 1.0.0 is preserved | PASS |
| Missing parameter | Safe validation response | IMPLEMENTED — router validation path |
| Unsupported question | Retrieval blocked | PASS — unsupported predictive request rejected |
| Prediction/forecast request | Retrieval blocked | PASS — Selenium verification |
| Causal request | Retrieval blocked | IMPLEMENTED — approved scope enforcement |
| Arbitrary SQL/code | Retrieval blocked | IMPLEMENTED — approved intent scope |
| All-record request | Retrieval blocked | IMPLEMENTED — approved scope enforcement |
| Ranking/score manipulation | Retrieval blocked | IMPLEMENTED — approved scope enforcement |
| System prompt request | Retrieval blocked | IMPLEMENTED — scope controls |
| Secret/credential request | Retrieval blocked | IMPLEMENTED — backend-only credential handling |
| Prompt injection | Retrieval blocked | IMPLEMENTED — scope controls |
| Source-text injection | Retrieval blocked | IMPLEMENTED — grounded evidence boundary |
| Invalid category/result reference | Safe validation response | IMPLEMENTED — validation path |
| Version mismatch | Intelligence response blocked | IMPLEMENTED — validation metadata/version checks |

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

The browser-supported Gemini flow confirmed that the explanation is generated
from the deterministic result and evidence returned by the assistant layer.

## Executed grounding evidence

The following supported questions were executed against the backend:

1. Highest lost-deal category by total deal value
2. Top lost-deal categories by total deal value
3. Ranking of Price
4. Why Price is ranked at its current position
5. Evidence supporting Price
6. Compare Price and Competitor
7. Analysis limitations
8. Data and method versions
9. Validation status

All nine returned supported responses. The multi-result questions preserved
their nested deterministic results and evidence references.

The Compare Price and Competitor flow was also verified through Selenium with
a real Gemini explanation.

## Real Gemini grounding evidence

A real Gemini API execution was completed through the backend API boundary.

Verified:

- `explanation_status=AVAILABLE`
- deterministic results preserved
- evidence references preserved
- data version `phase3-v1.0.0` preserved
- method version `1.0.0` preserved
- quality status `validated`
- approved limitation preserved
- Gemini did not become the retrieval layer

The browser evidence displayed:

- Price
- Competitor
- `POC12-CAT-01`
- `POC12-CAT-02`
- grounded Gemini explanation

## Gemini fallback validation

A category-ranking request was executed with Gemini unavailable.

Verified:

- deterministic answer remained available
- deterministic evidence remained available
- `explanation_status=UNAVAILABLE`
- fallback stated that the deterministic result remains authoritative

The missing-key path was separately verified without modifying the stored
environment configuration.

## Gemini validation

| Case | Expected result | Status / evidence |
|---|---|---|
| Gemini explanation available | Explanation uses only validated deterministic evidence | PASS — real Compare Categories execution |
| Gemini API failure | Deterministic answer remains authoritative | PASS — category ranking fallback |
| Missing GEMINI_API_KEY | Controlled Gemini-unavailable fallback | PASS — missing-key path verified |
| Gemini numeric fidelity | No unsupported numeric values appear | PASS — explanation grounded in deterministic result |
| Gemini finding fidelity | Deterministic rankings/findings are unchanged | PASS — deterministic result remains authoritative |
| Gemini limitation fidelity | Approved limitation is preserved | PASS |
| Gemini full-dataset exposure | Full dataset is never sent | IMPLEMENTED — grounding payload contains validated result/evidence fields |
| Gemini backend boundary | API key is never exposed to frontend | PASS — key remains backend-only |
| Gemini source-data injection | Instructions contained in data are ignored | IMPLEMENTED — validated grounding payload only |

Gemini is an explanation layer only. It does not retrieve data or create new
intelligence.

## Automated browser evidence

Selenium was executed against:

`APP_BASE_URL=http://localhost:3003`

Result:

`1 passed in 5.90s`

The journey verified the grounded assistant, real Gemini-backed explanation,
evidence references, unsupported prediction rejection, and operational
regression.

## Final validation status

The implemented Phase 3 grounded assistant flow is validated for the executed
backend, Gemini, fallback, and Selenium evidence above.

Items marked IMPLEMENTED were verified through the corresponding code paths but
were not represented as separate end-to-end UAT executions in this run.

No architecture redesign was introduced.
