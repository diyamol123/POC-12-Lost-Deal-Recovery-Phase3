
import Link from "next/link";

export default function AppNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="border-b border-[#1F2937] bg-[#030712] px-4 py-3 sm:px-5 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 text-[10px]">
        <span className="mr-2 font-semibold tracking-[0.18em] text-slate-500">
          LOST DEAL INTELLIGENCE
        </span>
        <Link
          href="/"
          className="rounded-lg border border-[#1F2937] px-3 py-2 text-slate-300 hover:border-[#38BDF8]/30 hover:text-[#38BDF8]"
        >
          Operational View
        </Link>
        <Link
          href="/data-intelligence"
          className="rounded-lg border border-[#1F2937] px-3 py-2 text-slate-300 hover:border-[#38BDF8]/30 hover:text-[#38BDF8]"
        >
          Data Intelligence
        </Link>
      </div>
    </nav>
  );
}
