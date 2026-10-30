"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Lightbulb,
  Target,
} from "lucide-react";

type DecisionPanelProps = {
  totalLost: number;
  totalValue: number;
  highPriority: number;
  topReason: string;
  topCompetitor: string;
};

export default function DecisionPanel({
  totalLost,
  totalValue,
  highPriority,
  topReason,
  topCompetitor,
}: DecisionPanelProps) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="rounded-2xl border border-[#38BDF8]/20 bg-[#0B1117] p-5 shadow-[0_0_30px_rgba(56,189,248,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#38BDF8]/20 bg-[#38BDF8]/10">
          <Lightbulb className="h-5 w-5 text-[#38BDF8]" />
        </div>

        <div>
          <div className="text-xs font-semibold tracking-[0.25em] text-[#38BDF8]">
            MANAGEMENT DECISION SUPPORT
          </div>

          <h2 className="mt-1 text-lg font-semibold text-slate-100">
            What should management investigate next?
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="flex items-center gap-2 text-xs tracking-widest text-slate-500">
            <Target className="h-3.5 w-3.5" />
            LOST DEALS
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-100">
            {totalLost}
          </div>
        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="text-xs tracking-widest text-slate-500">
            OBSERVED LOST-DEAL VALUE
          </div>

          <div className="mt-2 text-xl font-bold text-slate-100">
            {formatValue(totalValue)}
          </div>
        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="flex items-center gap-2 text-xs tracking-widest text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            HIGH PRIORITY
          </div>

          <div className="mt-2 text-2xl font-bold text-red-300">
            {highPriority}
          </div>
        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="text-xs tracking-widest text-slate-500">
            TOP REASON BY VALUE
          </div>

          <div className="mt-2 truncate text-sm font-semibold text-[#38BDF8]">
            {topReason}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#38BDF8]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            INVESTIGATE
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            <strong>{topReason}</strong> has the highest observed
            lost-deal value in the current filter selection. Review
            the supporting records and documented buyer objections
            before changing the sales strategy.
          </p>
        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4">
          <div className="text-xs font-semibold tracking-widest text-[#818CF8]">
            COMPETITIVE SIGNAL
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            <strong>{topCompetitor}</strong> appears
            frequently in competitive losses. Management
            should compare pricing, feature gaps,
            positioning and buyer-stage objections against
            this competitor.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#38BDF8]/10 bg-[#38BDF8]/5 p-4">
        <div className="text-xs font-semibold tracking-widest text-slate-500">
          HUMAN REVIEW GUIDANCE
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Use observed value, source records and documented
          limitations to decide which records merit human review.
          These descriptive signals do not estimate recovery
          probability or guarantee recovered revenue.
        </p>
      </div>
    </section>
  );
}