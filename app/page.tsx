
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Info,
  Filter,
  Database,
  TrendingDown,
  Target,
  AlertTriangle,
  X,
} from "lucide-react";

import DashboardCharts from "./components/DashboardCharts";
import RecoveryTable from "./components/RecoveryTable";
import DecisionPanel from "./components/DecisionPanel";

type Deal = {
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
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
};

const reasonOrder = [
  "Price",
  "Competitor",
  "Product Fit",
  "Timing",
  "Budget",
];

const segmentOrder = ["Enterprise", "Mid-Market", "SMB"];

const competitorOrder = [
  "Salesforce",
  "Microsoft",
  "Zoho",
  "HubSpot",
  "AWS",
  "Power BI",
  "Tableau",
  "Azure",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [locationFilter, setLocationFilter] = useState("ALL");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [productFilter, setProductFilter] = useState("ALL");
  const [segmentFilter, setSegmentFilter] = useState("ALL");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    fetch(`${apiBaseUrl}/api/deals`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        return response.json();
      })
      .then((data: Deal[]) => {
        setDeals(data);
        setApiError("");
      })
      .catch((error) => {
        console.error("Failed to load deals:", error);
        setApiError(
          "Unable to load CRM data from the FastAPI backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      return (
        (locationFilter === "ALL" ||
          deal.location === locationFilter) &&
        (teamFilter === "ALL" || deal.team === teamFilter) &&
        (productFilter === "ALL" ||
          deal.product === productFilter) &&
        (segmentFilter === "ALL" ||
          deal.segment === segmentFilter) &&
        (reasonFilter === "ALL" || deal.reason === reasonFilter) &&
        (priorityFilter === "ALL" ||
          deal.priority === priorityFilter)
      );
    });
  }, [
    deals,
    locationFilter,
    teamFilter,
    productFilter,
    segmentFilter,
    reasonFilter,
    priorityFilter,
  ]);

  const totalLost = filteredDeals.length;

  const totalValue = filteredDeals.reduce(
    (sum, deal) => sum + deal.value,
    0,
  );

  const highPriority = filteredDeals.filter(
    (deal) => deal.priority === "HIGH",
  ).length;

  const averageDealValue = totalLost > 0 ? totalValue / totalLost : 0;

  const lossReasons = reasonOrder
    .map((reason) => ({
      reason,
      count: filteredDeals.filter((deal) => deal.reason === reason)
        .length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const topReason = lossReasons[0]?.reason ?? "No data";

  const competitorCounts = competitorOrder
    .map((competitor) => {
      const losses = filteredDeals.filter(
        (deal) => deal.competitor === competitor,
      ).length;

      return {
        competitor,
        wins: 0,
        losses,
      };
    })
    .filter((item) => item.losses > 0);

  const topCompetitor =
    competitorCounts.length > 0
      ? [...competitorCounts].sort(
          (a, b) => b.losses - a.losses,
        )[0].competitor
      : "No data";

  const segments = segmentOrder.flatMap((segment) =>
    reasonOrder.map((reason) => ({
      segment,
      reason,
      value: filteredDeals.filter(
        (deal) => deal.segment === segment && deal.reason === reason,
      ).length,
    })),
  );

  const recoveryItems = [...filteredDeals]
    .sort((a, b) => {
      const priorityRank = {
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };

      return (
        priorityRank[b.priority] - priorityRank[a.priority] ||
        b.value - a.value
      );
    })
    .map((deal) => ({
      id: deal.id,
      company: deal.company,
      reason: deal.reason,
      competitor: deal.competitor,
      stage: deal.stage,
      value: deal.value,
      priority: deal.priority,
      action: deal.action,
    }));

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(filteredDeals, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lost-deal-recovery-data.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Location",
      "Team",
      "Product",
      "Company",
      "Segment",
      "Loss Reason",
      "Competitor",
      "Stage",
      "Value",
      "Priority",
      "Recommended Action",
    ];

    const rows = filteredDeals.map((deal) => [
      deal.id,
      deal.date,
      deal.location,
      deal.team,
      deal.product,
      deal.company,
      deal.segment,
      deal.reason,
      deal.competitor,
      deal.stage,
      deal.value,
      deal.priority,
      deal.action,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lost-deal-recovery-data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100">
      {/* API STATUS */}
      {loading && (
        <div className="border-b border-[#38BDF8]/20 bg-[#38BDF8]/5 px-5 py-3 text-center text-xs text-[#38BDF8]">
          Loading CRM intelligence from FastAPI...
        </div>
      )}

      {apiError && (
        <div className="border-b border-red-400/20 bg-red-400/5 px-5 py-3 text-center text-xs text-red-300">
          {apiError}
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#1F2937] bg-[#030712]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <div className="text-[9px] font-semibold tracking-[0.35em] text-[#38BDF8]">
              INFOCREON INTERNSHIP • BUSINESS INTELLIGENCE
            </div>

            <h1 className="mt-1 text-xl font-bold tracking-wide sm:text-2xl">
              LOST DEAL REASON & RECOVERY INTELLIGENCE
            </h1>

            <p className="mt-1 text-[9px] tracking-[0.25em] text-slate-500">
              LEADS & CONVERSION • MANAGEMENT INTELLIGENCE
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label="Application information"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] transition hover:bg-[#38BDF8]/20"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        {/* SOURCE NOTE */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#38BDF8]/15 bg-[#38BDF8]/5 p-4">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />

          <div>
            <div className="text-[9px] font-semibold tracking-widest text-[#38BDF8]">
              DATA SOURCE
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Synthetic CRM loss and follow-up dataset served through the
              FastAPI backend for demonstration and decision-support
              purposes. Company names and records shown here are synthetic
              and must not be interpreted as real company data.
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <section className="mb-6 rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#38BDF8]" />

            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              INTELLIGENCE FILTERS
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              {
                label: "LOCATION",
                value: locationFilter,
                setValue: setLocationFilter,
                options: [
                  "ALL",
                  "Bengaluru",
                  "Mumbai",
                  "Kochi",
                  "Chennai",
                  "Hyderabad",
                  "Pune",
                  "Delhi",
                ],
              },
              {
                label: "TEAM",
                value: teamFilter,
                setValue: setTeamFilter,
                options: ["ALL", "Enterprise", "Mid-Market", "SMB"],
              },
              {
                label: "PRODUCT",
                value: productFilter,
                setValue: setProductFilter,
                options: [
                  "ALL",
                  "Analytics Suite",
                  "Cloud Platform",
                  "CRM Platform",
                ],
              },
              {
                label: "SEGMENT",
                value: segmentFilter,
                setValue: setSegmentFilter,
                options: ["ALL", "Enterprise", "Mid-Market", "SMB"],
              },
              {
                label: "LOSS REASON",
                value: reasonFilter,
                setValue: setReasonFilter,
                options: ["ALL", ...reasonOrder],
              },
              {
                label: "PRIORITY",
                value: priorityFilter,
                setValue: setPriorityFilter,
                options: ["ALL", "HIGH", "MEDIUM", "LOW"],
              },
            ].map((filter) => (
              <label key={filter.label}>
                <div className="mb-1.5 text-[8px] tracking-widest text-slate-500">
                  {filter.label}
                </div>

                <select
                  value={filter.value}
                  onChange={(event) => filter.setValue(event.target.value)}
                  className="w-full rounded-lg border border-[#1F2937] bg-[#030712] px-3 py-2.5 text-xs text-slate-200 outline-none transition focus:border-[#38BDF8]/50"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>

        {/* KPI GRID */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="flex items-center gap-2 text-[9px] tracking-widest text-slate-500">
              <TrendingDown className="h-4 w-4 text-[#38BDF8]" />
              LOST DEALS
            </div>

            <div className="mt-3 text-3xl font-bold">{totalLost}</div>

            <div className="mt-1 text-[10px] text-slate-500">
              Filtered opportunities
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="flex items-center gap-2 text-[9px] tracking-widest text-slate-500">
              <Database className="h-4 w-4 text-[#38BDF8]" />
              PIPELINE VALUE LOST
            </div>

            <div className="mt-3 text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Total value of lost opportunities
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="flex items-center gap-2 text-[9px] tracking-widest text-slate-500">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              HIGH PRIORITY
            </div>

            <div className="mt-3 text-3xl font-bold text-red-300">
              {highPriority}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Opportunities requiring action
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="flex items-center gap-2 text-[9px] tracking-widest text-slate-500">
              <Target className="h-4 w-4 text-[#818CF8]" />
              AVG DEAL VALUE
            </div>

            <div className="mt-3 text-2xl font-bold">
              {formatCurrency(averageDealValue)}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Average lost opportunity value
            </div>
          </div>
        </section>

        {/* CHARTS */}
        <section className="mb-6">
          <DashboardCharts
            lossReasons={lossReasons}
            segments={segments}
            competitors={competitorCounts}
          />
        </section>

        {/* DECISION SUPPORT */}
        <section className="mb-6">
          <DecisionPanel
            totalLost={totalLost}
            totalValue={totalValue}
            highPriority={highPriority}
            topReason={topReason}
            topCompetitor={topCompetitor}
          />
        </section>

        {/* RECOVERY TABLE */}
        <section className="mb-6">
          <RecoveryTable items={recoveryItems} />
        </section>

        {/* DOWNLOADS + DATA QUALITY */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              EXPORT DATA
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Download the currently filtered synthetic CRM dataset for
              further analysis.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadCSV}
                className="flex items-center gap-2 rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-4 py-3 text-[10px] font-semibold tracking-widest text-[#38BDF8] transition hover:bg-[#38BDF8]/20"
              >
                <Download className="h-4 w-4" />
                DOWNLOAD CSV
              </button>

              <button
                type="button"
                onClick={downloadJSON}
                className="flex items-center gap-2 rounded-lg border border-[#818CF8]/30 bg-[#818CF8]/10 px-4 py-3 text-[10px] font-semibold tracking-widest text-[#818CF8] transition hover:bg-[#818CF8]/20"
              >
                <Download className="h-4 w-4" />
                DOWNLOAD JSON
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              SOURCE QUALITY & KPI DEFINITIONS
            </div>

            <div className="mt-4 space-y-3 text-xs leading-5 text-slate-400">
              <p>
                <strong className="text-slate-200">Lost Deals:</strong>{" "}
                Count of opportunities classified as closed-lost in the
                synthetic CRM dataset.
              </p>

              <p>
                <strong className="text-slate-200">
                  Pipeline Value Lost:
                </strong>{" "}
                Sum of opportunity values associated with filtered lost
                deals.
              </p>

              <p>
                <strong className="text-slate-200">High Priority:</strong>{" "}
                Lost opportunities marked HIGH based on value, buyer stage
                and recoverability.
              </p>

              <p>
                <strong className="text-slate-200">Data Quality:</strong>{" "}
                Synthetic demonstration records are intentionally labelled
                and should not be treated as verified Companies House or
                GLEIF records.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-[#1F2937] py-6">
          <div className="flex flex-col justify-between gap-3 text-[9px] tracking-widest text-slate-600 sm:flex-row">
            <span>REAL RAILS BUSINESS INTELLIGENCE LIBRARY</span>
            <span>POC-12 • LEADS & CONVERSION</span>
          </div>
        </footer>
      </div>

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close application information"
            className="absolute inset-0 cursor-default border-0 bg-black/70 p-0 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-info-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#38BDF8]/25 bg-[#070D14] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[9px] tracking-[0.3em] text-[#38BDF8]">
                  APPLICATION INFORMATION
                </div>

                <h2
                  id="application-info-title"
                  className="mt-2 text-xl font-bold"
                >
                  Lost Deal Reason & Recovery Intelligence
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowInfo(false)}
                aria-label="Close information"
                className="text-slate-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              A production-style business intelligence dashboard focused
              on lost opportunities, competitive patterns and targeted
              recovery actions.
            </p>

            <div className="mt-5 rounded-xl border border-[#1F2937] bg-[#030712] p-4">
              <div className="text-[9px] tracking-widest text-slate-500">
                DEVELOPER SIGNATURE
              </div>

              <div className="mt-3 text-sm font-semibold">
                Architect: Diyamol Jose
              </div>

              <div className="mt-2 text-xs text-slate-400">
                Batch: Batch 8 / MA College
              </div>

              <div className="mt-2 text-xs leading-5 text-slate-400">
                Stack: Next.js, FastAPI, Tailwind CSS, Apache ECharts
              </div>

              <div className="mt-2 text-xs text-slate-400">PoC ID: 12</div>

              <div className="mt-2 text-xs text-slate-400">
                GitHub: @diyamol123
              </div>

              <div className="mt-3 text-[9px] tracking-widest text-[#38BDF8]">
                INFOCREON INTERNSHIP
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="mt-5 w-full rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-4 py-3 text-xs font-semibold tracking-widest text-[#38BDF8] transition hover:bg-[#38BDF8]/20"
            >
              CLOSE
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
