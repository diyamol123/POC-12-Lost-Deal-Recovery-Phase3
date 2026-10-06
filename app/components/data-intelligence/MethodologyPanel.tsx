
import type { IntelligenceSummary, IntelligenceMetadata } from "@/app/types/intelligence";

export default function MethodologyPanel({
  summary,
  metadata,
}: {
  summary: IntelligenceSummary;
  metadata: IntelligenceMetadata;
}) {
  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
        METHODOLOGY
      </div>

      <div className="mt-3 space-y-3 text-xs leading-5 text-slate-400">
        <p>
          <strong className="text-slate-200">Track:</strong>{" "}
          {summary.approved_track}
        </p>

        <p>
          <strong className="text-slate-200">Question:</strong>{" "}
          {summary.primary_question}
        </p>

        <p>
          <strong className="text-slate-200">Decision:</strong>{" "}
          {summary.decision}
        </p>

        <p>
          <strong className="text-slate-200">Method:</strong>{" "}
          Category-level total deal value, average deal value, percentage
          contribution to observed deal value, and deterministic ranking by
          total deal value.
        </p>

        <p>
          <strong className="text-slate-200">Primary grouping:</strong>{" "}
          Category, with deterministic category-name tie-breaking.
        </p>

        <p>
          <strong className="text-slate-200">Minimum group size:</strong>{" "}
          {summary.weak_case_review.minimum_size_cases} records.
        </p>

        <p>
          <strong className="text-slate-200">Validation:</strong>{" "}
          {summary.validation_result.passed ? "PASSED" : "FAILED"}; contribution
          total {summary.validation_result.contribution_total_percent}%.
        </p>

        <p>
          <strong className="text-slate-200">Versions:</strong>{" "}
          Data {metadata.data_version} · Method {metadata.method_version}
        </p>
      </div>
    </section>
  );
}
