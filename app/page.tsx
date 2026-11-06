"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  BarChart3,
  ChevronDown,
  Database,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import PortfolioAssistant from "@/app/components/portfolio/PortfolioAssistant";
import type { PortfolioRecord } from "@/app/lib/portfolio";
import { formatRawUnits, sumMetric } from "@/app/lib/portfolio";

type FilterKey = "category" | "subcategory" | "status" | "stage" | "source_name" | "data_version";
type Filters = Record<FilterKey, string>;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "category", label: "Loss category" },
  { key: "subcategory", label: "Product" },
  { key: "status", label: "Priority" },
  { key: "stage", label: "Sales stage" },
  { key: "source_name", label: "Source cohort" },
  { key: "data_version", label: "Data version" },
];

const EMPTY_FILTERS: Filters = {
  category: "ALL",
  subcategory: "ALL",
  status: "ALL",
  stage: "ALL",
  source_name: "ALL",
  data_version: "ALL",
};

export default function Home() {
  const [records, setRecords] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Timing");
  const [search, setSearch] = useState("");
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/portfolio/records`)
      .then((response) => {
        if (!response.ok) throw new Error(`Portfolio API returned ${response.status}`);
        return response.json();
      })
      .then((data: PortfolioRecord[]) => {
        if (!Array.isArray(data) || data.length !== 500) {
          throw new Error("The portfolio API did not return the expected 500 records.");
        }
        if (active) {
          setRecords(data);
          setError("");
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load portfolio data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const previouslyFocused = document.activeElement;
    filterCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [filtersOpen]);

  const filteredRecords = useMemo(() => records.filter((record) =>
    FILTERS.every(({ key }) => filters[key] === "ALL" || String(record[key]) === filters[key]) &&
    (search.trim() === "" || `${record.record_id} ${record.entity_name} ${record.text_value}`.toLowerCase().includes(search.toLowerCase()))
  ), [records, filters, search]);

  const totalValue = sumMetric(filteredRecords);
  const averageValue = filteredRecords.length ? totalValue / filteredRecords.length : 0;
  const categoryRows = useMemo(() => {
    const grouped = new Map<string, { count: number; value: number }>();
    filteredRecords.forEach((record) => {
      const current = grouped.get(record.category) ?? { count: 0, value: 0 };
      current.count += 1;
      current.value += record.metric_value || 0;
      grouped.set(record.category, current);
    });
    return [...grouped.entries()]
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRecords]);
  const maxCategoryValue = Math.max(1, ...categoryRows.map((row) => row.value));
  const topCategory = categoryRows[0];
  const activeFilterCount = Object.values(filters).filter((value) => value !== "ALL").length;
  const selectedRows = filteredRecords.filter((record) => record.category === selectedCategory);
  const selectedValue = sumMetric(selectedRows);

  const optionsFor = (key: FilterKey) => [...new Set(records.map((record) => String(record[key] ?? "")).filter(Boolean))].sort();

  const exportRecords = (format: "json" | "csv") => {
    const fields = Object.keys(filteredRecords[0] ?? {}) as (keyof PortfolioRecord)[];
    const content = format === "json"
      ? JSON.stringify(filteredRecords, null, 2)
      : [fields.join(","), ...filteredRecords.map((record) => fields.map((field) => `"${String(record[field] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `portfolio-experiment-filtered.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8efff] text-[#3659c9]"><BarChart3 size={16} /></span>
              Portfolio intelligence · Synthetic experiment
            </div>
            <h1 id="portfolio-overview" className="text-2xl font-semibold tracking-tight text-[#14213d] sm:text-[30px]">Lost-deal portfolio overview</h1>
            <p className="mt-1 text-sm text-[#64748b]">A 500-record view of observed lost-deal values, categories and source evidence.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button ref={filterTriggerRef} type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-3 text-sm font-medium shadow-sm hover:bg-[#f8faff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3659c9]">
              <Filter size={16} /> Filters {activeFilterCount > 0 && <span className="rounded-full bg-[#e8efff] px-2 py-0.5 text-xs text-[#3659c9]">{activeFilterCount}</span>}
            </button>
            <details className="relative">
              <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-3 text-sm font-medium shadow-sm hover:bg-[#f8faff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3659c9]"><ArrowDownToLine size={16} /> Export <ChevronDown size={14} /></summary>
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-[#dce3ef] bg-white p-2 shadow-xl">
                <button onClick={() => exportRecords("csv")} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f3f6fc]">Download CSV</button>
                <button onClick={() => exportRecords("json")} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f3f6fc]">Download JSON</button>
              </div>
            </details>
          </div>
        </header>

        {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

        <section aria-label="Portfolio key performance indicators" className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Records in view" value={loading ? "—" : filteredRecords.length.toLocaleString("en-US")} note="Synthetic lost-deal records" icon={<Database size={17} />} />
          <Kpi label="Observed value" value={loading ? "—" : formatRawUnits(totalValue)} note="Currency unspecified · units" icon={<Activity size={17} />} />
          <Kpi label="Average observed value" value={loading ? "—" : formatRawUnits(averageValue)} note="Per record in current view" icon={<BarChart3 size={17} />} />
          <Kpi label="Leading category" value={loading ? "—" : topCategory?.category ?? "—"} note={topCategory ? `${topCategory.count} records by observed value` : "No matching records"} icon={<ShieldCheck size={17} />} />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
          <div className="rounded-2xl border border-[#e2e8f2] bg-white p-4 shadow-[0_2px_10px_rgba(20,33,61,0.035)] sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">Observed lost-deal value by category</h2>
                <p className="mt-1 text-xs text-[#718096]">Sum of recorded metric values for each category in the current view.</p>
              </div>
              <span className="rounded-full bg-[#f1f5fb] px-2.5 py-1 text-[11px] font-medium text-[#64748b]">{filteredRecords.length.toLocaleString("en-US")} records</span>
            </div>
            {loading ? <div className="h-[260px] animate-pulse rounded-xl bg-[#f1f5f9]" /> : categoryRows.length === 0 ? <div className="flex h-[260px] items-center justify-center text-sm text-[#718096]">No records match these filters.</div> : (
              <div className="space-y-4 py-1">
                {categoryRows.map((row) => (
                  <button key={row.category} type="button" onClick={() => setSelectedCategory(row.category)} aria-pressed={selectedCategory === row.category} className={`group block w-full rounded-xl p-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3659c9] ${selectedCategory === row.category ? "bg-[#f2f6ff]" : "hover:bg-[#f8faff]"}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className={`text-sm font-semibold ${selectedCategory === row.category ? "text-[#294db8]" : "text-[#334155]"}`}>{row.category}</span>
                      <span className="text-right text-sm font-semibold tabular-nums text-[#172033]">{formatRawUnits(row.value)} <span className="text-xs font-normal text-[#8490a3]">units</span></span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#edf1f7]">
                      <div className="h-full rounded-full bg-[#5275d8] transition-all" style={{ width: `${(row.value / maxCategoryValue) * 100}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] text-[#8490a3]"><span>{row.count} records</span><span>{filteredRecords.length ? ((row.count / filteredRecords.length) * 100).toFixed(1) : "0.0"}% of records</span></div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 border-t border-[#edf1f6] pt-3 text-[11px] leading-5 text-[#7b8798]">Select a category to inspect its contributing records. Values are descriptive observations, not estimates of recoverable revenue.</div>
          </div>

          <aside className="rounded-2xl border border-[#e2e8f2] bg-white p-4 shadow-[0_2px_10px_rgba(20,33,61,0.035)] sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718096]">Selected category</p><h2 className="mt-1 text-lg font-semibold text-[#172033]">{selectedCategory}</h2></div>
              <span className="rounded-lg bg-[#eef3ff] p-2 text-[#3659c9]"><BarChart3 size={18} /></span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f7f9fc] p-3"><p className="text-[11px] text-[#718096]">Observed value</p><p className="mt-1 text-lg font-semibold tabular-nums text-[#172033]">{formatRawUnits(selectedValue)}</p><p className="text-[10px] text-[#8490a3]">unspecified units</p></div>
              <div className="rounded-xl bg-[#f7f9fc] p-3"><p className="text-[11px] text-[#718096]">Records</p><p className="mt-1 text-lg font-semibold tabular-nums text-[#172033]">{selectedRows.length}</p><p className="text-[10px] text-[#8490a3]">in current view</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-[#334155]">Contributing records</h3><span className="text-[11px] text-[#8490a3]">{selectedRows.length} total</span></div>
            <div className="mt-2 space-y-2">
              {selectedRows.slice(0, 4).map((record) => <div key={record.record_id} className="flex items-start justify-between gap-3 border-b border-[#f0f3f8] py-2 last:border-0"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#334155]">{record.entity_name}</p><p className="mt-0.5 text-[10px] text-[#8490a3]">{record.record_id} · {record.stage}</p></div><p className="shrink-0 text-xs font-medium tabular-nums text-[#334155]">{formatRawUnits(record.metric_value)}</p></div>)}
              {selectedRows.length === 0 && <p className="py-4 text-xs text-[#8490a3]">No records in this category for the current filters.</p>}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-[#8490a3]">Preview only. Full record exploration and approved intelligence details will be available in the next workflow checkpoint.</p>
          </aside>
        </section>

        <section className="mt-4 rounded-2xl border border-[#e2e8f2] bg-white p-4 shadow-[0_2px_10px_rgba(20,33,61,0.035)] sm:p-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-[#172033]">Portfolio record explorer</h2><p className="mt-1 text-xs text-[#718096]">Search the currently filtered synthetic records.</p></div><label className="relative block w-full sm:max-w-xs"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, account or note" className="h-9 w-full rounded-lg border border-[#dce3ef] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#5275d8] focus:ring-2 focus:ring-[#5275d8]/15" /></label></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead><tr className="border-b border-[#edf1f6] text-[10px] uppercase tracking-wide text-[#8490a3]"><th className="py-2 pr-3 font-semibold">Record</th><th className="py-2 pr-3 font-semibold">Category</th><th className="py-2 pr-3 font-semibold">Product</th><th className="py-2 pr-3 font-semibold">Stage</th><th className="py-2 text-right font-semibold">Observed value</th></tr></thead><tbody>{filteredRecords.slice(0, 8).map((record) => <tr key={record.record_id} className="border-b border-[#f2f4f8] last:border-0"><td className="py-2.5 pr-3"><span className="font-semibold text-[#334155]">{record.record_id}</span><span className="ml-2 text-[#8490a3]">{record.entity_name}</span></td><td className="py-2.5 pr-3 text-[#526174]">{record.category}</td><td className="py-2.5 pr-3 text-[#526174]">{record.subcategory}</td><td className="py-2.5 pr-3 text-[#526174]">{record.stage}</td><td className="py-2.5 text-right font-medium tabular-nums text-[#334155]">{formatRawUnits(record.metric_value)}</td></tr>)}</tbody></table></div>
          <p className="mt-2 text-[10px] text-[#8490a3]">Showing {Math.min(8, filteredRecords.length)} of {filteredRecords.length} filtered records.</p>
        </section>

        <PortfolioAssistant />

        <footer className="mt-5 flex flex-col gap-2 border-t border-[#e1e7f0] pt-4 text-[11px] text-[#7b8798] sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} /> Data version: portfolio-synth-v1.0.0 · Method version: 1.0.0</span><span>All 500 records are synthetic. Currency is unspecified. Results are descriptive and do not establish causality or predict real customer behaviour.</span></footer>
      </div>

      {filtersOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[#101828]/35" onMouseDown={(event) => { if (event.target === event.currentTarget) setFiltersOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="filter-title" className="flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#edf1f6] pb-4"><div><h2 id="filter-title" className="text-lg font-semibold text-[#172033]">Filter portfolio</h2><p className="mt-1 text-xs text-[#718096]">Choose from fields available in the 500-record dataset.</p></div><button ref={filterCloseRef} onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button></div>
          <div className="flex-1 space-y-4 overflow-y-auto py-5">{FILTERS.map(({ key, label }) => <label key={key} className="block"><span className="mb-1.5 block text-xs font-semibold text-[#475569]">{label}</span><select value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} className="h-10 w-full rounded-lg border border-[#dce3ef] bg-white px-3 text-sm text-[#334155] outline-none focus:border-[#5275d8] focus:ring-2 focus:ring-[#5275d8]/15"><option value="ALL">All {label.toLowerCase()}s</option>{optionsFor(key).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}</div>
          <div className="flex items-center justify-between border-t border-[#edf1f6] pt-4"><button onClick={() => setFilters(EMPTY_FILTERS)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#526174] hover:bg-[#f1f5f9]"><RefreshCw size={14} /> Reset all</button><button onClick={() => setFiltersOpen(false)} className="rounded-lg bg-[#3659c9] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#294bb3]">Apply filters</button></div>
        </section>
      </div>}
    </main>
  );
}

function Kpi({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return <article className="rounded-2xl border border-[#e2e8f2] bg-white p-4 shadow-[0_2px_10px_rgba(20,33,61,0.035)]"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#718096]">{label}</p><span className="rounded-lg bg-[#f0f4ff] p-2 text-[#5275d8]">{icon}</span></div><p className="mt-3 truncate text-xl font-semibold tracking-tight tabular-nums text-[#172033]">{value}</p><p className="mt-1 truncate text-[10px] text-[#8490a3]">{note}</p></article>;
}
