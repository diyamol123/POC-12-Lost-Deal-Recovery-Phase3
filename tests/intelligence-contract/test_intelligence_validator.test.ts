import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateIntelligencePackage } from "../../app/services/intelligenceValidator";
import type { IntelligencePackage } from "../../app/types/intelligence";

const valid: IntelligencePackage = {
  metadata: {
    data_version: "phase3-v1.0.0",
    method_version: "1.0.0",
    generated_at: "2026-10-03T15:31:01Z",
    quality_status: "validated",
    approved_track: "Track A — Comparative Intelligence",
    source: "test",
  },
  summary: {
    project_id: "POC-12",
    project_title: "Lost Deal Reason & Recovery Intelligence",
    approved_track: "Track A — Comparative Intelligence",
    primary_question: "q",
    decision: "d",
    data_version: "phase3-v1.0.0",
    method_version: "1.0.0",
    result_count: 1,
    key_findings: [],
    priority_items: [],
    validation_result: { passed: true, contribution_total_percent: 100, small_groups_at_threshold: [] },
    weak_case_review: { minimum_size_cases: 0, highest_value_record: { record_id: "CRM-012", category: "Price", metric_value: 1250000, assessment: "x" } },
    important_limitations: [],
    generated_at: "2026-10-03T15:31:01Z",
  },
  validation: {
    approved_track: "Track A — Comparative Intelligence",
    data_version: "phase3-v1.0.0",
    method_version: "1.0.0",
    validation_result: "PASS",
    passed: true,
    record_count: 20,
    primary_group_count: 5,
    minimum_group_size: 3,
    contribution_total_percent: 100,
    small_groups_at_threshold: [],
  },
  results: [{
    result_id: "POC12-CAT-01",
    result_type: "comparative_group",
    record_id: null,
    entity_id: null,
    group_key: "Price",
    period_start: null,
    period_end: null,
    metric_name: "total_deal_value",
    result_value: 4660000,
    result_unit: "currency_unspecified",
    result_category: "rank_1",
    priority_rank: 1,
    finding: "Price ranks 1.",
    evidence: { record_count: 5, average_deal_value: 932000, contribution_pct: 40.155, record_ids: ["CRM-001"] },
    method_version: "1.0.0",
    data_version: "phase3-v1.0.0",
    generated_at: "2026-10-03T15:31:01Z",
    quality_status: "validated",
    limitation: "Descriptive.",
  }],
};

describe("intelligence output contract", () => {
  test("accepts the approved package shape", () => {
    assert.equal(validateIntelligencePackage(valid).valid, true);
  });

  test("rejects a version mismatch", () => {
    const bad = structuredClone(valid);
    bad.results[0].method_version = "9.9.9";
    const result = validateIntelligencePackage(bad);
    assert.equal(result.valid, false);
  });
});
