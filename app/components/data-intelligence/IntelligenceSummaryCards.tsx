import type { IntelligenceSummary } from "@/app/types/intelligence";

export default function IntelligenceSummaryCards({ summary }: { summary: IntelligenceSummary }) {
  const top = summary.priority_items[0];

  const cards = [
    ["RESULTS", String(summary.result_count)],
    ["TOP GROUP", top?.group_key ?? "—"],
    ["TOP CONTRIBUTION", top ? `${top.contribution_pct.toFixed(2)}%` : "—"],
    ["VALIDATION", summary.validation_result.passed ? "PASS" : "FAIL"],
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
          <div className="text-[9px] tracking-widest text-slate-500">{label}</div>
          <div className="mt-2 truncate text-xl font-bold text-slate-100">{value}</div>
        </div>
      ))}
    </section>
  );
}
