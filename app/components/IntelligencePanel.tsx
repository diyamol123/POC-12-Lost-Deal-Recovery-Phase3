"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  Target,
  X,
} from "lucide-react";

type IntelligencePanelProps = {
  selected: {
    type: "reason" | "competitor" | "deal";
    title: string;
    value?: number;
    secondary?: string;
    tertiary?: string;
    description?: string;
    action?: string;
  } | null;
  onClose: () => void;
};

export default function IntelligencePanel({
  selected,
  onClose,
}: IntelligencePanelProps) {
  if (!selected) return null;

  const formatValue = (
    value?: number,
    type?: "reason" | "competitor" | "deal"
  ) => {
    if (value === undefined) return "—";

    if (type === "deal") {
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }).format(value);
    }

    if (type === "reason") {
      return `${value} lost deals`;
    }

    if (type === "competitor") {
      return `${value} deals`;
    }

    return String(value);
  };

  return (
    <>
      {/* Accessible backdrop */}
      <button
        type="button"
        aria-label="Close intelligence panel"
        className="fixed inset-0 z-40 cursor-default border-0 bg-black/45 p-0 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Intelligence Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="intelligence-panel-title"
        className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-[#1F2937] bg-[#030712] shadow-[-20px_0_60px_rgba(0,0,0,0.45)] sm:w-[30vw] sm:min-w-[360px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1F2937] px-5 py-5">
          <div>
            <div className="text-[9px] font-semibold tracking-[0.28em] text-[#38BDF8]">
              DEAL INTELLIGENCE
            </div>

            <h2
              id="intelligence-panel-title"
              className="mt-1 text-xl font-semibold text-slate-100"
            >
              {selected.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F2937] text-slate-400 transition hover:border-[#38BDF8]/40 hover:text-[#38BDF8]"
            aria-label="Close intelligence panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Selected item */}
          <section className="rounded-xl border border-[#38BDF8]/20 bg-[#0B1117] p-4">
            <div className="text-[9px] tracking-[0.2em] text-slate-500">
              SELECTED SIGNAL
            </div>

            <div className="mt-2 text-lg font-semibold text-slate-100">
              {selected.title}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#1F2937] bg-[#030712] p-3">
                <div className="flex items-center gap-2 text-[8px] tracking-widest text-slate-500">
                  <Target className="h-3 w-3" />
                  TYPE
                </div>

                <div className="mt-2 text-sm font-semibold uppercase text-[#38BDF8]">
                  {selected.type === "reason"
                    ? "LOSS REASON"
                    : selected.type === "competitor"
                      ? "COMPETITOR"
                      : "DEAL"}
                </div>
              </div>

              <div className="rounded-lg border border-[#1F2937] bg-[#030712] p-3">
                <div className="flex items-center gap-2 text-[8px] tracking-widest text-slate-500">
                  <CircleDollarSign className="h-3 w-3" />
                  VALUE
                </div>

                <div className="mt-2 text-sm font-semibold text-slate-100">
                  {formatValue(selected.value, selected.type)}
                </div>
              </div>
            </div>
          </section>

          {/* Context */}
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="flex items-center gap-2 text-[9px] font-semibold tracking-widest text-[#38BDF8]">
              <Building2 className="h-3.5 w-3.5" />
              CONTEXT
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 border-b border-[#1F2937] pb-3">
                <span className="text-[9px] uppercase tracking-wider text-slate-500">
                  Secondary Signal
                </span>

                <span className="text-right text-xs text-slate-300">
                  {selected.secondary || "Not available"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[9px] uppercase tracking-wider text-slate-500">
                  Segment / Stage
                </span>

                <span className="text-right text-xs text-slate-300">
                  {selected.tertiary || "Not available"}
                </span>
              </div>
            </div>
          </section>

          {/* Why this matters */}
          <section className="rounded-xl border border-[#38BDF8]/20 bg-[#0B1117] p-4">
            <div className="text-[9px] font-semibold tracking-[0.2em] text-[#38BDF8]">
              WHY THIS MATTERS
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-300">
              {selected.description ||
                "This signal represents a meaningful pattern in lost opportunities. Management should investigate the underlying cause before changing the sales strategy."}
            </p>
          </section>

          {/* Intelligence signal */}
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.2em] text-[#818CF8]">
              <AlertTriangle className="h-3.5 w-3.5" />
              INTELLIGENCE SIGNAL
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              {selected.secondary
                ? `${selected.secondary} is associated with this selected signal. Review the related deals, buyer stage and competitive context.`
                : "Review related deals, buyer stage, pricing and competitive context."}
            </p>
          </section>

          {/* Recommended action */}
          <section className="rounded-xl border border-[#38BDF8]/10 bg-[#38BDF8]/5 p-4">
            <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.2em] text-[#38BDF8]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              RECOMMENDED ACTION
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-300">
              {selected.action ||
                "Prioritize high-value opportunities, review the loss reason, and determine whether targeted re-engagement is appropriate."}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1F2937] p-4">
          <div className="text-[8px] leading-4 text-slate-600">
            Intelligence generated from the selected dashboard signal.
            Synthetic CRM records are used where operational data is
            unavailable.
          </div>
        </div>
      </aside>
    </>
  );
}
