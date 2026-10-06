
type Props = {
  group: string;
  quality: string;
  category: string;
  groups: string[];
  categories: string[];
  qualities: string[];
  onGroup: (value: string) => void;
  onQuality: (value: string) => void;
  onCategory: (value: string) => void;
};

export default function IntelligenceFilters({
  group,
  quality,
  category,
  groups,
  categories,
  qualities,
  onGroup,
  onQuality,
  onCategory,
}: Props) {
  const field = (
    label: string,
    value: string,
    options: string[],
    onChange: (value: string) => void,
  ) => (
    <label>
      <div className="mb-1.5 text-[8px] tracking-widest text-slate-500">{label}</div>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#1F2937] bg-[#030712] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-[#38BDF8]/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section
      aria-label="Intelligence filters"
      className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4"
    >
      <div className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
        INTELLIGENCE FILTERS
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {field("GROUP", group, ["ALL", ...groups], onGroup)}
        {field("RESULT CATEGORY", category, ["ALL", ...categories], onCategory)}
        {field("QUALITY", quality, ["ALL", ...qualities], onQuality)}
      </div>
    </section>
  );
}
