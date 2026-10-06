import type { IntelligenceResult } from "@/app/types/intelligence";

export default function EvidencePanel({
  result,
  onClose,
}: {
  result: IntelligenceResult | null;
  onClose: () => void;
}) {
  if (!result) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-[#1F2937] bg-[#030712] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#1F2937] p-5">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-[#38BDF8]">RESULT EVIDENCE</div>
            <h2 className="mt-1 text-xl font-semibold text-slate-100">{result.group_key}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg border border-[#1F2937] px-3 py-2 text-xs text-slate-400" aria-label="Close evidence panel">
            Close
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="text-[9px] tracking-widest text-slate-500">FINDING</div>
            <p className="mt-2 text-sm leading-6 text-slate-200">{result.finding}</p>
          </section>
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="text-[9px] tracking-widest text-[#38BDF8]">SUPPORTING EVIDENCE</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric label="Records" value={String(result.evidence.record_count)} />
              <Metric label="Average" value={result.evidence.average_deal_value.toLocaleString("en-IN", { maximumFractionDigits: 0 })} />
              <Metric label="Contribution" value={`${result.evidence.contribution_pct.toFixed(2)}%`} />
              <Metric label="Quality" value={result.quality_status} />
            </div>
            <div className="mt-4">
              <div className="text-[9px] tracking-widest text-slate-500">RECORD IDS</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.evidence.record_ids.map((id) => (
                  <span key={id} className="rounded-full border border-[#1F2937] px-2 py-1 text-[10px] text-slate-400">{id}</span>
                ))}
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="text-[9px] tracking-widest text-amber-300">LIMITATION</div>
            <p className="mt-2 text-xs leading-5 text-slate-300">{result.limitation}</p>
          </section>
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4 text-[10px] text-slate-500">
            Data {result.data_version} · Method {result.method_version} · Generated {new Date(result.generated_at).toLocaleString()}
          </section>
        </div>
      </aside>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1F2937] bg-[#030712] p-3">
      <div className="text-[8px] tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-200">{value}</div>
    </div>
  );
}
