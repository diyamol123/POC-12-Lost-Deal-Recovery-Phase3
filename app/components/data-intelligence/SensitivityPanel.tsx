import report from "../../../data-science/outputs/weak_case_review.json";

type RankChange = {
  removed_record_id: string;
  removed_value: number;
  ranking_after_removal: string[];
};

type SensitivityCase = {
  category: string;
  tested: boolean;
  reason: string;
  baseline_ranking: string[];
  rank_changes: RankChange[];
};

type SensitivityReport = {
  data_version: string;
  leave_one_out_sensitivity: SensitivityCase[];
  limitations: string[];
};

const sensitivityReport = report as SensitivityReport;

export default function SensitivityPanel({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4 sm:p-5">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
        SENSITIVITY ANALYSIS
      </div>

      <h2 className="mt-2 text-lg font-semibold text-slate-100">
        Does one record change the ranking?
      </h2>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        Leave-one-out results from the saved analytical review. Rankings are
        descriptive and do not establish causation or predict recovered revenue.
      </p>

      <div className="mt-4 space-y-3">
        {sensitivityReport.leave_one_out_sensitivity.map((item) => (
          <article
            key={item.category}
            aria-current={selectedCategory === item.category ? "true" : undefined}
            className={`rounded-xl border p-3 sm:p-4 ${
              selectedCategory === item.category
                ? "border-[#38BDF8]/60 bg-[#38BDF8]/5"
                : "border-[#1F2937] bg-[#030712]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  {item.category}
                </h3>
                {selectedCategory === item.category && (
                  <span className="mt-1 inline-block text-xs font-medium text-[#7DD3FC]">
                    Selected finding
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">
                {item.rank_changes.length} ranking change
                {item.rank_changes.length === 1 ? "" : "s"}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {item.reason}
            </p>

            {item.baseline_ranking && item.baseline_ranking.length > 0 ? (
              <p className="mt-2 text-xs text-slate-400">
                Baseline ranking: {item.baseline_ranking.join(" → ")}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Baseline ranking: not available in the saved report.
              </p>
            )}

            {item.rank_changes.map((change) => (
              <div
                key={change.removed_record_id}
                className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3"
              >
                <p className="text-xs font-medium text-amber-200">
                  Removed record: {change.removed_record_id}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Removed value:{" "}
                  {change.removed_value.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  (currency unspecified)
                </p>
                {item.category === "Price" && (
                  <p className="mt-2 text-sm leading-6 text-amber-200">
                    Removing {change.removed_record_id} changes the leading
                    category from {item.baseline_ranking[0]} to{" "}
                    {change.ranking_after_removal[0]}. The record remains in
                    the approved baseline dataset.
                  </p>
                )}
                <p className="mt-3 text-xs font-semibold tracking-wider text-slate-400">
                  RANKING AFTER REMOVAL
                </p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-slate-300">
                  {change.ranking_after_removal.map((category) => (
                    <li key={category}>{category}</li>
                  ))}
                </ol>
              </div>
            ))}
          </article>
        ))}
      </div>

      <div className="mt-4 border-t border-[#1F2937] pt-3 text-[10px] leading-5 text-slate-500">
        Data version: {sensitivityReport.data_version}
        {sensitivityReport.limitations.length > 0 && (
          <ul className="mt-2 list-inside list-disc space-y-1">
            {sensitivityReport.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
