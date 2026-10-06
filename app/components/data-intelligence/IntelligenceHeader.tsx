import type { IntelligenceMetadata } from "@/app/types/intelligence";

export default function IntelligenceHeader({ metadata }: { metadata: IntelligenceMetadata }) {
  return (
    <header className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[9px] font-semibold tracking-[0.35em] text-[#38BDF8]">
            INFOCREON • DATA INTELLIGENCE
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-wide text-slate-100">
            Lost Deal Comparative Intelligence
          </h1>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
            Descriptive intelligence from the approved Track A analytical output.
            This page consumes validated Post #3 results; it does not recalculate them.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] sm:grid-cols-4">
          <Meta label="TRACK" value={metadata.approved_track.replace("Track A — ", "")} />
          <Meta label="DATA" value={metadata.data_version} />
          <Meta label="METHOD" value={metadata.method_version} />
          <Meta label="QUALITY" value={metadata.quality_status.toUpperCase()} />
        </div>
      </div>
      <div className="mt-4 border-t border-[#1F2937] pt-3 text-[10px] text-slate-500">
        Generated: {new Date(metadata.generated_at).toLocaleString()} · Source: {metadata.source}
      </div>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1F2937] bg-[#030712] p-2.5">
      <div className="tracking-widest text-slate-600">{label}</div>
      <div className="mt-1 font-semibold text-slate-300">{value}</div>
    </div>
  );
}
