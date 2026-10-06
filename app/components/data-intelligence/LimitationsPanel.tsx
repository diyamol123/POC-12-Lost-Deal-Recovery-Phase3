
import type { IntelligenceSummary } from "@/app/types/intelligence";

export default function LimitationsPanel({
  summary,
}: {
  summary: IntelligenceSummary;
}) {
  return (
    <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-amber-300">
        LIMITATIONS & UNSUPPORTED USES
      </div>

      <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
        {summary.important_limitations.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
