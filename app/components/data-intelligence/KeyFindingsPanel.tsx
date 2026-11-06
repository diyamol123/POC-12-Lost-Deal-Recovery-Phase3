import type { IntelligenceSummary } from "@/app/types/intelligence";

export default function KeyFindingsPanel({ summary }: { summary: IntelligenceSummary }) {
  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-[#ffffff] p-4">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-[#2563eb]">KEY FINDINGS</div>
      <div className="mt-3 space-y-2">
        {summary.key_findings.map((finding) => (
          <div key={finding} className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3 text-xs leading-5 text-slate-700">
            {finding}
          </div>
        ))}
      </div>
    </section>
  );
}
