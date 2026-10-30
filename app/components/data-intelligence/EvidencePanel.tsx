import { useState } from "react";
import type { IntelligenceResult } from "@/app/types/intelligence";

type CRMDeal = {
  id: string;
  date: string;
  location: string;
  team: string;
  product: string;
  company: string;
  segment: string;
  reason: string;
  competitor: string;
  stage: string;
  value: number;
  priority: string;
  action: string;
};

export default function EvidencePanel({
  result,
  onClose,
  deals,
  dealsLoading,
  dealsError,
}: {
  result: IntelligenceResult | null;
  onClose: () => void;
  deals: CRMDeal[];
  dealsLoading: boolean;
  dealsError: string;
}) {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  if (!result) return null;

  const selectedRecord = deals.find((deal) => deal.id === selectedRecordId);

  return (
    <>
      {/* Accessible backdrop */}
      <button
        type="button"
        aria-label="Close evidence panel"
        className="fixed inset-0 z-40 cursor-default border-0 bg-black/50 p-0"
        onClick={onClose}
      />

      {/* Evidence sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-panel-title"
        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-[#1F2937] bg-[#030712] shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-[#1F2937] p-5">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-[#38BDF8]">
              RESULT EVIDENCE
            </div>

            <h2
              id="evidence-panel-title"
              className="mt-1 text-xl font-semibold text-slate-100"
            >
              {result.group_key}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#1F2937] px-3 py-2 text-xs text-slate-400"
            aria-label="Close evidence panel"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="text-[9px] tracking-widest text-slate-500">
              FINDING
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              {result.finding}
            </p>
          </section>

          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
            <div className="text-[9px] tracking-widest text-[#38BDF8]">
              SUPPORTING EVIDENCE
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric
                label="Records"
                value={String(result.evidence.record_count)}
              />

              <Metric
                label="Average"
                value={result.evidence.average_deal_value.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}
              />

              <Metric
                label="Contribution"
                value={`${result.evidence.contribution_pct.toFixed(2)}%`}
              />

              <Metric label="Quality" value={result.quality_status} />
            </div>

            <div className="mt-4">
              <div className="text-[9px] tracking-widest text-slate-500">
                RECORD IDS
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {result.evidence.record_ids.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selectedRecordId === id}
                    onClick={() =>
                      setSelectedRecordId((current) => current === id ? null : id)
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/60 ${
                      selectedRecordId === id
                        ? "border-[#38BDF8] bg-[#38BDF8]/15 text-[#7DD3FC]"
                        : "border-[#1F2937] text-slate-400 hover:border-[#38BDF8]/50 hover:text-slate-200"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Select a record ID to inspect its CRM details.
              </p>
            </div>

            {selectedRecordId && (
              <section
                aria-live="polite"
                aria-label={`CRM record ${selectedRecordId} details`}
                className="mt-4 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/5 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-[#38BDF8]">
                  CRM RECORD INSPECTION
                </div>
                {dealsLoading ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Loading CRM record details...
                  </p>
                ) : dealsError ? (
                  <p role="alert" className="mt-3 text-sm text-amber-300">
                    {dealsError}
                  </p>
                ) : !selectedRecord ? (
                  <p className="mt-3 text-sm text-amber-300">
                    Record {selectedRecordId} was not found in the operational CRM response.
                  </p>
                ) : (
                  <>
                    <h3 className="mt-3 text-base font-semibold text-slate-100">
                      {selectedRecord.company}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedRecord.id} · {selectedRecord.date}
                    </p>
                    <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      {[
                        ["Loss reason", selectedRecord.reason],
                        ["Competitor", selectedRecord.competitor],
                        ["Stage", selectedRecord.stage],
                        ["Segment", selectedRecord.segment],
                        ["Location", selectedRecord.location],
                        ["Team", selectedRecord.team],
                        ["Product", selectedRecord.product],
                        ["Priority label", selectedRecord.priority],
                        [
                          "Observed value (currency unspecified)",
                          selectedRecord.value.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          }),
                        ],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-[#1F2937] bg-[#030712]/70 p-3">
                          <dt className="text-xs text-slate-500">{label}</dt>
                          <dd className="mt-1 break-words font-medium text-slate-200">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-3 rounded-lg border border-[#1F2937] bg-[#030712]/70 p-3">
                      <div className="text-xs text-slate-500">Recorded action</div>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {selectedRecord.action}
                      </p>
                    </div>
                  </>
                )}
              </section>
            )}
          </section>

          <section className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="text-[9px] tracking-widest text-amber-300">
              LIMITATION
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              {result.limitation}
            </p>
          </section>

          <section className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4 text-[10px] text-slate-500">
            Data {result.data_version} · Method {result.method_version} ·
            Generated {new Date(result.generated_at).toLocaleString()}
          </section>
        </div>
      </aside>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1F2937] bg-[#030712] p-3">
      <div className="text-[8px] tracking-widest text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-slate-200">
        {value}
      </div>
    </div>
  );
}
