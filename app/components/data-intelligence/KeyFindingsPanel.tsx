import type { IntelligenceSummary } from "@/app/types/intelligence";

export default function KeyFindingsPanel({ summary }: { summary: IntelligenceSummary }) {
  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">KEY FINDINGS</div>
      <div className="mt-3 space-y-2">
        {summary.key_findings.map((finding) => (
          <div key={finding} className="rounded-lg border border-[#1F2937] bg-[#030712] p-3 text-xs leading-5 text-slate-300">
            {finding}
          </div>
        ))}
      </div>
    </section>
  );
}
