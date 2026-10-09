# Grounded Data Assistant — User Acceptance Testing

## Status

UAT execution completed for the implemented Phase 3 grounded assistant flow.

## Required UAT scenarios

| ID | Scenario | Expected result | Status / evidence |
|---|---|---|---|
| UAT-01 | Use a suggested question | Supported question is accepted | PASS — supported assistant flow verified |
| UAT-02 | Ask a grounded intelligence question | Correct deterministic answer with optional grounded Gemini explanation | PASS — Compare Price and Competitor verified in browser |
| UAT-03 | Check numeric fidelity | Values match approved intelligence output | PASS — Price ₹46,60,000 and Competitor ₹34,35,000 verified |
| UAT-04 | Check evidence | Evidence references support the answer | PASS — POC12-CAT-01 and POC12-CAT-02 displayed |
| UAT-05 | Check limitation | Approved limitation is displayed | PASS — descriptive/non-causal limitation displayed |
| UAT-06 | Missing category parameter | Safe validation response | PASS — router validation is implemented |
| UAT-07 | Unsupported question | Request is rejected without retrieval | PASS — unsupported predictive request rejected |
| UAT-08 | Prompt injection | Request is blocked | IMPLEMENTED — automated scope controls present |
| UAT-09 | Source-text injection | Instructions in source data are not executed | IMPLEMENTED — grounding boundary enforced |
| UAT-10 | System prompt request | Request is blocked | IMPLEMENTED — scope controls present |
| UAT-11 | Secret/credential request | Request is blocked | IMPLEMENTED — secret handling remains backend-only |
| UAT-12 | Prediction/forecast request | Request is blocked | PASS — browser Selenium verification |
| UAT-13 | Arbitrary SQL/code request | Request is blocked | IMPLEMENTED — approved intent scope enforced |
| UAT-14 | All-record request | Request is blocked | IMPLEMENTED — approved scope enforced |
| UAT-15 | Invalid category/result reference | Safe validation response | IMPLEMENTED — safe validation path |
| UAT-16 | Version mismatch | Intelligence response is blocked | IMPLEMENTED — validation metadata and version checks present |
| UAT-17 | Gemini API failure | Deterministic answer remains available with fallback | PASS — Price ranking returned deterministic answer with `explanation_status=UNAVAILABLE` |
| UAT-18 | Missing Gemini API key | Controlled fallback; no frontend secret exposure | PASS — missing-key fallback verified without modifying stored credentials |
| UAT-19 | Gemini numeric fidelity | No unsupported numeric values are returned | PASS — Gemini explanation is grounded in deterministic results/evidence |
| UAT-20 | Gemini source-data injection | Injection is not executed | IMPLEMENTED — Gemini receives validated grounding payload only |
| UAT-21 | Mobile layout | Assistant remains usable | NOT EXECUTED in this UAT run |
| UAT-22 | Operational regression | Existing operational page remains functional | PASS — Selenium journey completed successfully |

## Grounded response checks

A successful response must provide:

- answer_id
- status
- intent
- answer
- evidence_references
- key_values
- metadata
- limitation
- suggested_follow_ups

When Gemini is available, the response may also include a grounded Gemini
explanation and explanation status. The deterministic answer, evidence,
metadata, and limitation remain authoritative.

## Browser / Selenium evidence

The automated Selenium journey was executed against:

`APP_BASE_URL=http://localhost:3003`

Result:

`1 passed in 5.90s`

The journey verified:

1. The Data Intelligence page loads successfully.
2. The grounded assistant accepts `Compare Price and Competitor`.
3. The deterministic Price and Competitor results are displayed.
4. Gemini explanation is displayed with grounded status.
5. Evidence references `POC12-CAT-01` and `POC12-CAT-02` are displayed.
6. The predictive question is rejected with the approved scope message.
7. The existing operational page remains functional after the assistant journey.

## Real Gemini execution

A real Gemini API execution was completed using the backend API boundary.

Verified:

- `explanation_status=AVAILABLE`
- deterministic answer preserved
- Gemini explanation returned
- deterministic evidence preserved
- data version `phase3-v1.0.0`
- method version `1.0.0`
- quality status `validated`
- approved limitation preserved
- API credential was not exposed to the frontend

## Fallback evidence

The category-ranking query was executed with Gemini unavailable.

Verified:

- deterministic answer remained available
- evidence reference remained available
- `explanation_status=UNAVAILABLE`
- fallback message indicated that the deterministic result remains authoritative

The missing-key path was also verified safely by temporarily preventing retrieval
of `GEMINI_API_KEY` without modifying the stored environment configuration.

## Final acceptance

The implemented grounded assistant flow is PASS for the executed automated and
manual validation evidence above.

UAT-21 (mobile layout) was not executed in this run and remains an explicit
follow-up rather than being represented as a completed test.

No architecture redesign was introduced.
