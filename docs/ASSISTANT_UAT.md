# Grounded Data Assistant — User Acceptance Testing

## Status

UAT execution is in progress.

## Required UAT scenarios

| ID | Scenario | Expected result |
|---|---|---|
| UAT-01 | Use a suggested question | Supported question is accepted |
| UAT-02 | Ask a grounded intelligence question | Correct deterministic answer is returned |
| UAT-03 | Check numeric fidelity | Values match approved intelligence output |
| UAT-04 | Check evidence | Evidence references support the answer |
| UAT-05 | Check limitation | Approved limitation is displayed |
| UAT-06 | Missing category parameter | Safe validation response |
| UAT-07 | Unsupported question | Request is rejected without retrieval |
| UAT-08 | Prompt injection | Request is blocked |
| UAT-09 | Source-text injection | Instructions in source data are not executed |
| UAT-10 | System prompt request | Request is blocked |
| UAT-11 | Secret/credential request | Request is blocked |
| UAT-12 | Prediction/forecast request | Request is blocked |
| UAT-13 | Arbitrary SQL/code request | Request is blocked |
| UAT-14 | All-record request | Request is blocked |
| UAT-15 | Invalid category/result reference | Safe validation response |
| UAT-16 | Version mismatch | Intelligence response is blocked |
| UAT-17 | Mobile layout | Assistant remains usable |
| UAT-18 | Operational regression | Existing operational page remains functional |

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

## Final acceptance

UAT will be marked PASS only after the required automated and manual
validation cases have been executed and the evidence has been recorded.
