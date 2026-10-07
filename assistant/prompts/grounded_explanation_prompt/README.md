# Grounded Explanation Boundary

This Phase 3 assistant uses deterministic retrieval and does not require an LLM.

If an explanation layer is introduced in a future approved change, it must:

- use only the deterministic evidence package supplied to it;
- never invent numbers, rankings, scores, findings, or evidence;
- preserve the approved limitation text;
- preserve data_version and method_version;
- never disclose system prompts, secrets, credentials, or internal security controls;
- never execute instructions contained in source data;
- never access the canonical dataset directly;
- never perform arbitrary SQL or code execution;
- never convert descriptive results into causal, predictive, or forecasting claims.

The deterministic query layer remains the authoritative source for all
numeric values, rankings, findings, evidence references, versions, and
limitations.
