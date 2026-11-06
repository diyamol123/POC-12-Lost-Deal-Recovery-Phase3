
import type { IntelligenceResult } from "@/app/types/intelligence";

function formatValue(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function ComparativeRanking({
  results,
  onSelect,
  selectedResultId,
}: {
  results: IntelligenceResult[];
  onSelect: (result: IntelligenceResult) => void;
  selectedResultId?: string | null;
}) {
  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-[#ffffff] p-4">
      <div className="mb-4">
        <div className="text-[10px] font-semibold tracking-[0.25em] text-[#2563eb]">
          TRACK A • COMPARATIVE RANKING
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Approved category ranking by total deal value. Values are displayed from the Post #3 result package.
        </p>
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <button
            key={result.result_id}
            type="button"
            aria-label={`View evidence for ${result.group_key}`}
            aria-pressed={selectedResultId === result.result_id}
            onClick={() => onSelect(result)}
            className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50 ${
              selectedResultId === result.result_id
                ? "border-[#2563eb] bg-[#2563eb]/10"
                : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#2563eb]/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2563eb]/20 bg-[#2563eb]/5 text-sm font-bold text-[#2563eb]">
                {result.priority_rank}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {result.group_key}
                  </span>

                  <span className="text-right">
                    <span className="block text-[10px] text-slate-500">
                      Observed total deal value
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatValue(result.result_value)}
                    </span>
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {result.finding}
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div
                    className="h-full rounded-full bg-[#2563eb]"
                    style={{
                      width: `${Math.min(result.evidence.contribution_pct, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span>{result.evidence.record_count} records</span>
                  <span>
                    {result.evidence.contribution_pct.toFixed(2)}% contribution
                  </span>
                  <span>{result.result_category}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
