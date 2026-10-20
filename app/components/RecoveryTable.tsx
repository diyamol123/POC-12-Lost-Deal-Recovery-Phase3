"use client";

type RecoveryItem = {
  id: string;
  company: string;
  reason: string;
  competitor: string;
  stage: string;
  value: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
};

type RecoveryTableProps = {
  items: RecoveryItem[];
};

export default function RecoveryTable({
  items,
}: RecoveryTableProps) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
      <div className="mb-4">
        <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
          RECOVERY PRIORITY QUEUE
        </div>

        <p className="mt-1 text-xs text-slate-500">
          High-value lost opportunities ranked for potential
          re-engagement.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b border-[#1F2937] text-[9px] uppercase tracking-widest text-slate-500">
              <th className="px-3 py-3">Company</th>
              <th className="px-3 py-3">Loss Reason</th>
              <th className="px-3 py-3">Competitor</th>
              <th className="px-3 py-3">Stage</th>
              <th className="px-3 py-3">Value</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#1F2937]/70 transition hover:bg-white/[0.02]"
              >
                <td className="px-3 py-4">
                  <div className="text-sm font-semibold text-slate-200">
                    {item.company}
                  </div>

                  <div className="mt-1 text-[9px] text-slate-600">
                    {item.id}
                  </div>
                </td>

                <td className="px-3 py-4 text-xs text-slate-400">
                  {item.reason}
                </td>

                <td className="px-3 py-4 text-xs text-slate-400">
                  {item.competitor}
                </td>

                <td className="px-3 py-4 text-xs text-slate-400">
                  {item.stage}
                </td>

                <td className="px-3 py-4 text-xs font-semibold text-slate-200">
                  {formatValue(item.value)}
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[9px]
                      font-bold
                      tracking-wider
                      ${
                        item.priority === "HIGH"
                          ? "border-red-400/30 bg-red-400/10 text-red-300"
                          : item.priority === "MEDIUM"
                          ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                          : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                      }
                    `}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="max-w-[240px] px-3 py-4 text-xs leading-5 text-slate-400">
                  {item.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-[#1F2937] p-6 text-center text-xs text-slate-500">
          No recovery opportunities match the current filters.
        </div>
      )}
    </section>
  );
}