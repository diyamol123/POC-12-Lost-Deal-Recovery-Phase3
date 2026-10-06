import type { IntelligenceMetadata } from "@/app/types/intelligence";

export default function DataFreshnessBadge({ stale }: { metadata: IntelligenceMetadata; stale: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-xs ${stale ? "border-amber-400/30 bg-amber-400/5 text-amber-300" : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"}`}>
      {stale ? "STALE / VERSION MISMATCH — review source evidence before using results." : "VALIDATED SOURCE PACKAGE — versions and generation timestamps are aligned."}
    </div>
  );
}
