import type { IntelligenceResult } from "@/app/types/intelligence";

function formatValue(value: number) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function ComparativeRanking({
  results,
  onSelect,
}: {
  results: IntelligenceResult[];
  onSelect: (result: IntelligenceResult) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
      <div className="mb-4">
        <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
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
            onClick={() => onSelect(result)}
            className="w-full rounded-xl border border-[#1F2937] bg-[#030712] p-4 text-left transition hover:border-[#38BDF8]/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#38BDF8]/20 bg-[#38BDF8]/5 text-sm font-bold text-[#38BDF8]">
                {result.priority_rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-100">{result.group_key}</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {formatValue(result.result_value)}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1F2937]">
                  <div
                    className="h-full rounded-full bg-[#38BDF8]"
                    style={{ width: `${Math.min(result.evidence.contribution_pct, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span>{result.evidence.record_count} records</span>
                  <span>{result.evidence.contribution_pct.toFixed(2)}% contribution</span>
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
