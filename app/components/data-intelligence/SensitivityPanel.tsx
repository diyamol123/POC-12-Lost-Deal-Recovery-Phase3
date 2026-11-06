
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

function RankingList({
  title,
  ranking,
}: {
  title: string;
  ranking: string[];
}) {
  return (
    <div className="rounded-lg border border-[#e2e8f0] bg-[#ffffff] p-3">
      <h4 className="text-[10px] font-semibold tracking-wider text-slate-500">
        {title}
      </h4>
      <ol className="mt-2 space-y-2">
        {ranking.map((category, index) => (
  <li
    key={category}
            className="flex items-center gap-2 text-xs text-slate-700"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#e2e8f0] text-[10px] font-semibold text-slate-500">
              {index + 1}
            </span>
            <span>{category}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function SensitivityPanel({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-[#ffffff] p-4 sm:p-5">
      <div className="text-[10px] font-semibold tracking-[0.25em] text-[#2563eb]">
        SENSITIVITY ANALYSIS
      </div>

      <h2 className="mt-2 text-lg font-semibold text-slate-900">
        Does one record change the ranking?
      </h2>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        Leave-one-out results from the saved analytical review. Each scenario
        temporarily removes one record to examine ranking sensitivity.
        Rankings are descriptive and do not establish causation or predict
        recovered revenue.
      </p>

      <div className="mt-4 space-y-3">
        {sensitivityReport.leave_one_out_sensitivity.map((item) => (
          <article
            key={item.category}
            aria-current={
              selectedCategory === item.category ? "true" : undefined
            }
            className={`rounded-xl border p-3 sm:p-4 ${
              selectedCategory === item.category
                ? "border-[#2563eb]/60 bg-[#2563eb]/5"
                : "border-[#e2e8f0] bg-[#f8fafc]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.category}
                </h3>

                {selectedCategory === item.category && (
                  <span className="mt-1 inline-block text-xs font-medium text-[#1d4ed8]">
                    Selected finding
                  </span>
                )}
              </div>

              <span className="text-[10px] text-slate-500">
                {item.rank_changes.length} ranking change
                {item.rank_changes.length === 1 ? "" : "s"}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {item.reason}
            </p>

            {!item.tested && (
              <p className="mt-2 text-xs text-amber-300">
                This scenario was not tested in the saved report.
              </p>
            )}

            {Array.isArray(item.baseline_ranking) &&
  item.baseline_ranking.length > 0 && (
              <div className="mt-3">
                <RankingList
                  title="BASELINE RANKING"
                  ranking={item.baseline_ranking}
                />
              </div>
            )}

            {item.rank_changes.map((change) => (
              <div
                key={change.removed_record_id}
                className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3"
              >
                <div className="text-xs font-semibold text-amber-200">
                  Leave-one-out scenario
                </div>

                <p className="mt-2 text-xs text-slate-700">
                  Temporarily removed record:{" "}
                  <span className="font-semibold text-amber-200">
                    {change.removed_record_id}
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Observed value:{" "}
                  {change.removed_value.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  (currency unspecified)
                </p>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <RankingList
                    title="BEFORE REMOVAL"
                    ranking={item.baseline_ranking}
                  />

                  <RankingList
                    title="AFTER REMOVAL"
                    ranking={change.ranking_after_removal}
                  />
                </div>

                {item.category === "Price" && (
                  <p className="mt-3 text-xs leading-5 text-amber-200">
                    Removing {change.removed_record_id} changes the leading
                    category from {item.baseline_ranking[0]} to{" "}
                    {change.ranking_after_removal[0]}. The record remains in
                    the approved baseline dataset; this is only a sensitivity
                    test.
                  </p>
                )}
              </div>
            ))}

            {item.rank_changes.length === 0 && (
              <p className="mt-3 text-xs text-slate-500">
                No ranking changes are recorded for the tested scenarios.
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-4 border-t border-[#e2e8f0] pt-3 text-[10px] leading-5 text-slate-500">
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
