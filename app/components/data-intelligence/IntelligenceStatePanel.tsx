
import Link from "next/link";

type Props = {
  state: "stale" | "error";
  detail: string;
  onRetry?: () => void;
};

export default function IntelligenceStatePanel({ state, detail, onRetry }: Props) {
  const stale = state === "stale";

  return (
    <main className="min-h-screen bg-[#030712] p-5 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#1F2937] bg-[#0B1117] p-6">
        <div
          className={`text-[10px] font-semibold tracking-[0.25em] ${
            stale ? "text-amber-300" : "text-red-300"
          }`}
        >
          {stale ? "INTELLIGENCE DATA STALE" : "INTELLIGENCE LOAD ERROR"}
        </div>

        <h1 className="mt-3 text-lg font-semibold text-slate-100">
          {stale
            ? "Approved results are not being rendered as current."
            : "Trusted intelligence data is unavailable."}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {stale
            ? "A version, timestamp, quality, or validation mismatch was detected. The application has withheld the affected analytical results until the approved package is aligned."
            : "The application could not safely load and validate the approved intelligence package."}
        </p>

        {detail && (
          <div className="mt-4 rounded-lg border border-[#1F2937] bg-[#030712] p-3 text-xs leading-5 text-slate-500">
            {detail}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg border border-[#38BDF8]/30 px-4 py-2 text-xs text-[#38BDF8]"
            >
              Retry
            </button>
          )}
          <Link
            href="/"
            className="rounded-lg border border-[#1F2937] px-4 py-2 text-xs text-slate-400"
          >
            Operational View
          </Link>
        </div>
      </div>
    </main>
  );
}
