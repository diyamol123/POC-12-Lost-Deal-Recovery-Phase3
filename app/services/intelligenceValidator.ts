
import type {
  IntelligencePackage,
  IntelligenceResult,
} from "@/app/types/intelligence";

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function validResult(result: IntelligenceResult): boolean {
  return Boolean(
    result.result_id &&
      result.result_type &&
      result.group_key &&
      result.metric_name === "total_deal_value" &&
      Number.isFinite(result.result_value) &&
      result.result_category &&
      Number.isInteger(result.priority_rank) &&
      result.finding &&
      result.evidence &&
      Number.isInteger(result.evidence.record_count) &&
      result.evidence.record_count >= 0 &&
      Number.isFinite(result.evidence.average_deal_value) &&
      Number.isFinite(result.evidence.contribution_pct) &&
      Array.isArray(result.evidence.record_ids) &&
      result.method_version &&
      result.data_version &&
      ISO_UTC.test(result.generated_at) &&
      result.quality_status === "validated" &&
      result.limitation
  );
}

export function validateIntelligencePackage(
  pkg: IntelligencePackage
): { valid: true; warnings: string[] } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pkg.metadata || !pkg.summary || !pkg.validation || !Array.isArray(pkg.results)) {
    return { valid: false, errors: ["Required intelligence package sections are missing."] };
  }

  const { data_version, method_version, generated_at, quality_status } =
    pkg.metadata;

  if (!data_version || !method_version || !ISO_UTC.test(generated_at)) {
    errors.push("Metadata version or generated timestamp is invalid.");
  }

  if (quality_status !== "validated") {
    errors.push(`Unsupported quality status: ${quality_status}`);
  }

  if (pkg.summary.approved_track !== "Track A — Comparative Intelligence") {
    errors.push("Unsupported analytical track.");
  }

  if (pkg.validation.approved_track !== pkg.summary.approved_track) {
    errors.push("Validation approved_track does not match summary.");
  }

  if (pkg.summary.data_version !== data_version) {
    errors.push("Summary data_version does not match metadata.");
  }

  if (pkg.summary.method_version !== method_version) {
    errors.push("Summary method_version does not match metadata.");
  }

  if (pkg.validation.data_version !== data_version) {
    errors.push("Validation data_version does not match metadata.");
  }

  if (pkg.validation.method_version !== method_version) {
    errors.push("Validation method_version does not match metadata.");
  }

  if (pkg.validation.validation_result !== "PASS" || pkg.validation.passed !== true) {
    errors.push("Validation output is not approved.");
  }

  if (pkg.summary.result_count !== pkg.results.length) {
    errors.push("Summary result_count does not match loaded result count.");
  }

  if (pkg.validation.record_count !== undefined &&
      (!Number.isInteger(pkg.validation.record_count) || pkg.validation.record_count < 0)) {
    errors.push("Validation record_count is invalid.");
  }

  if (pkg.summary.generated_at !== generated_at) {
    errors.push("Summary generated_at does not match metadata.");
  }

  const ids = new Set<string>();

  for (const result of pkg.results) {
    if (ids.has(result.result_id)) {
      errors.push(`Duplicate result identifier: ${result.result_id}`);
    }
    ids.add(result.result_id);

    if (!validResult(result)) {
      errors.push(
        `Result violates the intelligence output contract: ${result.result_id || "unknown"}`
      );
    }

    if (
      result.data_version !== data_version ||
      result.method_version !== method_version
    ) {
      errors.push(`Result version mismatch: ${result.result_id}`);
    }

    if (result.generated_at !== generated_at) {
      errors.push(`Generated timestamp mismatch: ${result.result_id}`);
    }

    if (result.evidence.record_ids.length !== result.evidence.record_count) {
      warnings.push(
        `Evidence record count differs from record_ids length: ${result.result_id}`
      );
    }
  }

  if (errors.length) return { valid: false, errors };
  return { valid: true, warnings };
}
