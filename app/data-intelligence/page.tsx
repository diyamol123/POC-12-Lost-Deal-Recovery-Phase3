
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  IntelligencePackage,
  IntelligenceResult,
} from "@/app/types/intelligence";
import {
  fetchIntelligencePackage,
  fetchIntelligenceStatus,
} from "@/app/services/intelligenceService";
import { validateIntelligencePackage } from "@/app/services/intelligenceValidator";
import IntelligenceHeader from "@/app/components/data-intelligence/IntelligenceHeader";
import IntelligenceSummaryCards from "@/app/components/data-intelligence/IntelligenceSummaryCards";
import IntelligenceFilters from "@/app/components/data-intelligence/IntelligenceFilters";
import ComparativeRanking from "@/app/components/data-intelligence/ComparativeRanking";
import KeyFindingsPanel from "@/app/components/data-intelligence/KeyFindingsPanel";
import EvidencePanel from "@/app/components/data-intelligence/EvidencePanel";
import MethodologyPanel from "@/app/components/data-intelligence/MethodologyPanel";
import LimitationsPanel from "@/app/components/data-intelligence/LimitationsPanel";
import DataFreshnessBadge from "@/app/components/data-intelligence/DataFreshnessBadge";
import IntelligenceStatePanel from "@/app/components/data-intelligence/IntelligenceStatePanel";

export default function DataIntelligencePage() {
  const [pkg, setPkg] = useState<IntelligencePackage | null>(null);
  const [error, setError] = useState("");
  const [staleReason, setStaleReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<"loading" | "validated" | "stale" | "error">("loading");

  const [group, setGroup] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [quality, setQuality] = useState("ALL");
  const [selected, setSelected] = useState<IntelligenceResult | null>(null);

  const load = () => {
    setLoading(true);
    setState("loading");
    setError("");
    setStaleReason("");
    setPkg(null);

    fetchIntelligenceStatus()
      .then((status) => {
        if (status.status === "stale") {
          setStaleReason(status.detail || "The approved intelligence package is stale.");
          setState("stale");
          return null;
        }

        if (status.status === "error") {
          throw new Error(status.detail || "Unable to establish intelligence package status.");
        }

        return fetchIntelligencePackage();
      })
      .then((data) => {
        if (!data) return;

        const validation = validateIntelligencePackage(data);

        if (!validation.valid) {
          throw new Error(
            `Contract validation failed: ${validation.errors.join(" ")}`
          );
        }

        setPkg(data);
        setState("validated");
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load intelligence package."
        );
        setState("error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const groups = useMemo(
    () =>
      pkg
        ? [...new Set(pkg.results.map((result) => result.group_key))].sort()
        : [],
    [pkg]
  );

  const categories = useMemo(
    () =>
      pkg
        ? [...new Set(pkg.results.map((result) => result.result_category))].sort()
        : [],
    [pkg]
  );

  const qualities = useMemo(
    () =>
      pkg
        ? [...new Set(pkg.results.map((result) => result.quality_status))].sort()
        : [],
    [pkg]
  );

  const filteredResults = useMemo(() => {
    if (!pkg) return [];

    return pkg.results.filter(
      (result) =>
        (group === "ALL" || result.group_key === group) &&
        (category === "ALL" || result.result_category === category) &&
        (quality === "ALL" || result.quality_status === quality)
    );
  }, [pkg, group, category, quality]);

  const clearFilters = () => {
    setGroup("ALL");
    setCategory("ALL");
    setQuality("ALL");
  };

  if (loading || state === "loading") {
    return (
      <main className="min-h-screen bg-[#030712] p-5 text-slate-100">
        <div className="mx-auto max-w-[1400px] animate-pulse space-y-4">
          <div className="h-32 rounded-2xl bg-[#0B1117]" />
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="h-24 rounded-2xl bg-[#0B1117]" />
            <div className="h-24 rounded-2xl bg-[#0B1117]" />
            <div className="h-24 rounded-2xl bg-[#0B1117]" />
            <div className="h-24 rounded-2xl bg-[#0B1117]" />
          </div>
          <div className="h-96 rounded-2xl bg-[#0B1117]" />
        </div>
      </main>
    );
  }

  if (state === "stale") {
    return (
      <IntelligenceStatePanel
        state="stale"
        detail={staleReason}
        onRetry={load}
      />
    );
  }

  if (state === "error" || error || !pkg) {
    return (
      <IntelligenceStatePanel
        state="error"
        detail={error || "No trusted intelligence package is available."}
        onRetry={load}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-5 text-slate-100 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <Link
            href="/"
            className="rounded-lg border border-[#1F2937] px-3 py-2 text-slate-400 hover:border-[#38BDF8]/30 hover:text-[#38BDF8]"
          >
            ← Operational View
          </Link>
          <span className="text-slate-600">Data Intelligence · Post #4 integration</span>
        </div>

        <IntelligenceHeader metadata={pkg.metadata} />
        <DataFreshnessBadge metadata={pkg.metadata} stale={false} />
        <IntelligenceSummaryCards summary={pkg.summary} />

        <IntelligenceFilters
          group={group}
          quality={quality}
          category={category}
          groups={groups}
          categories={categories}
          qualities={qualities}
          onGroup={setGroup}
          onQuality={setQuality}
          onCategory={setCategory}
        />

        {filteredResults.length === 0 ? (
          <section
            aria-label="No matching intelligence results"
            className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-8 text-center"
          >
            <div className="text-sm font-semibold text-slate-200">
              No matching results
            </div>
            <p className="mt-2 text-xs text-slate-500">
              No approved intelligence result matches the active filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-[#38BDF8]/30 px-4 py-2 text-xs text-[#38BDF8]"
            >
              Clear filters
            </button>
          </section>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <ComparativeRanking
              results={filteredResults}
              onSelect={setSelected}
            />
            <KeyFindingsPanel summary={pkg.summary} />
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <MethodologyPanel summary={pkg.summary} metadata={pkg.metadata} />
          <LimitationsPanel summary={pkg.summary} />
        </div>

        <EvidencePanel
          result={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </main>
  );
}
