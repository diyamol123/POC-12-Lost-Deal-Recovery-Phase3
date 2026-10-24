"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import IntelligencePanel from "./IntelligencePanel";

type ChartProps = {
  lossReasons: {
    reason: string;
    count: number;
  }[];

  segments: {
    segment: string;
    reason: string;
    value: number;
  }[];

  competitors: {
    competitor: string;
    wins: number;
    losses: number;
  }[];
};

type SelectedSignal = {
  type: "reason" | "competitor";
  title: string;
  value?: number;
  secondary?: string;
  tertiary?: string;
  description?: string;
  action?: string;
};

export default function DashboardCharts({
  lossReasons,
  segments,
  competitors,
}: ChartProps) {
  const [selected, setSelected] =
    useState<SelectedSignal | null>(null);

  /* ---------------- LOSS REASON COUNT PARETO ---------------- */

  const paretoLabels = lossReasons.map(
    (item) => item.reason
  );

  const paretoValues = lossReasons.map(
    (item) => item.count
  );

  const total = paretoValues.reduce(
    (sum, value) => sum + value,
    0
  );

  const cumulative = paretoValues
    .reduce<number[]>((values, value) => {
      const running = (values.at(-1) ?? 0) + value;
      values.push(running);
      return values;
    }, [])
    .map((running) =>
      total > 0 ? Math.round((running / total) * 100) : 0
    );

  const paretoOption = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 45,
      right: 45,
      top: 35,
      bottom: 70,
    },

    xAxis: {
      type: "category",
      data: paretoLabels,
      axisLabel: {
        color: "#94a3b8",
        rotate: 25,
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#1f2937",
        },
      },
    },

    yAxis: [
      {
        type: "value",
        name: "Deals",
        nameTextStyle: {
          color: "#64748b",
        },
        axisLabel: {
          color: "#64748b",
        },
        splitLine: {
          lineStyle: {
            color: "#1f2937",
          },
        },
      },
      {
        type: "value",
        name: "%",
        min: 0,
        max: 100,
        axisLabel: {
          color: "#64748b",
        },
        splitLine: {
          show: false,
        },
      },
    ],

    series: [
      {
        name: "Lost deals",
        type: "bar",
        data: paretoValues,
        barMaxWidth: 36,
        itemStyle: {
          color: "#38bdf8",
          borderRadius: [5, 5, 0, 0],
        },
      },
      {
        name: "Cumulative percentage",
        type: "line",
        yAxisIndex: 1,
        data: cumulative,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "#818cf8",
        },
        lineStyle: {
          width: 2,
          color: "#818cf8",
        },
      },
    ],
  };

  /* ---------------- SEGMENT HEATMAP ---------------- */

  const segmentLabels = [
    ...new Set(segments.map((item) => item.segment)),
  ];

  const reasonLabels = [
    ...new Set(segments.map((item) => item.reason)),
  ];

  const heatmapData = segments.map((item) => {
    const x = segmentLabels.indexOf(item.segment);
    const y = reasonLabels.indexOf(item.reason);

    return [x, y, item.value];
  });

  const heatmapMax =
    segments.length > 0
      ? Math.max(1, ...segments.map((item) => item.value))
      : 1;

  const heatmapOption = {
    backgroundColor: "transparent",

    tooltip: {
      position: "top",
      formatter: (params: {
        data: [number, number, number];
      }) => {
        const [x, y, value] = params.data;

        return [
          `<strong>${segmentLabels[x]}</strong>`,
          reasonLabels[y],
          `Lost deals: ${value}`,
        ].join("<br/>");
      },
    },

    grid: {
      left: 95,
      right: 20,
      top: 20,
      bottom: 55,
    },

    xAxis: {
      type: "category",
      data: segmentLabels,
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#1f2937",
        },
      },
    },

    yAxis: {
      type: "category",
      data: reasonLabels,
      axisLabel: {
        color: "#94a3b8",
        fontSize: 9,
      },
      axisLine: {
        lineStyle: {
          color: "#1f2937",
        },
      },
    },

    visualMap: {
      min: 0,
      max: heatmapMax,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      textStyle: {
        color: "#64748b",
      },
    },

    series: [
      {
        type: "heatmap",
        data: heatmapData,
        label: {
          show: true,
          color: "#e2e8f0",
          fontSize: 10,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(56,189,248,.5)",
          },
        },
      },
    ],
  };

  /* ---------------- COMPETITOR LOSS COUNTS ---------------- */

  const competitorOption = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 45,
      right: 20,
      top: 30,
      bottom: 65,
    },

    xAxis: {
      type: "category",
      data: competitors.map((item) => item.competitor),
      axisLabel: {
        color: "#94a3b8",
        fontSize: 10,
        rotate: 20,
      },
      axisLine: {
        lineStyle: {
          color: "#1f2937",
        },
      },
    },

    yAxis: {
      type: "value",
      name: "Recorded losses",
      nameTextStyle: {
        color: "#64748b",
      },
      axisLabel: {
        color: "#64748b",
      },
      splitLine: {
        lineStyle: {
          color: "#1f2937",
        },
      },
    },

    series: [
      {
        name: "Recorded competitive losses",
        type: "bar",
        data: competitors.map((item) => item.losses),
        barMaxWidth: 36,
        itemStyle: {
          color: "#818cf8",
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <>
      <div className="space-y-5">
        {/* LOSS REASON PARETO */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              LOSS-REASON COUNT PARETO
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ranks loss reasons by deal count, not by total observed
              lost-deal value. Click a bar to inspect the count-based
              signal.
            </p>
          </div>

          <ReactECharts
            option={paretoOption}
            style={{ height: 300, width: "100%" }}
            opts={{ renderer: "canvas" }}
            onEvents={{
              click: (params: {
                seriesType?: string;
                dataIndex?: number;
              }) => {
                if (
                  params.seriesType !== "bar" ||
                  params.dataIndex === undefined
                ) {
                  return;
                }

                const item = lossReasons[params.dataIndex];
                if (!item) return;

                setSelected({
                  type: "reason",
                  title: item.reason,
                  value: item.count,
                  secondary: `${item.count} lost deals`,
                  tertiary: "Loss reason",
                  description:
                    `The loss reason "${item.reason}" accounts for ` +
                    `${item.count} lost deals in the current filtered dataset. ` +
                    "This is a count-based observation and does not indicate " +
                    "the total value associated with this category or prove causality.",
                  action:
                    "Review the affected deal records, documented buyer objections " +
                    "and deal values before deciding whether targeted follow-up is appropriate.",
                });
              },
            }}
          />
        </section>

        {/* SEGMENT HEATMAP */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              SEGMENT HEATMAP
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Shows the distribution of recorded lost-deal counts
              across customer segments and loss reasons.
            </p>
          </div>

          <ReactECharts
            option={heatmapOption}
            style={{ height: 300, width: "100%" }}
            opts={{ renderer: "canvas" }}
          />
        </section>

        {/* COMPETITOR LOSS COUNTS */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">
          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              COMPETITOR LOSS COUNTS
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Shows recorded competitive-loss counts only. Win counts
              are not available in this dataset. Click a bar to inspect
              the selected competitor.
            </p>
          </div>

          <ReactECharts
            option={competitorOption}
            style={{ height: 300, width: "100%" }}
            opts={{ renderer: "canvas" }}
            onEvents={{
              click: (params: {
                seriesType?: string;
                dataIndex?: number;
              }) => {
                if (
                  params.seriesType !== "bar" ||
                  params.dataIndex === undefined
                ) {
                  return;
                }

                const item = competitors[params.dataIndex];
                if (!item) return;

                setSelected({
                  type: "competitor",
                  title: item.competitor,
                  value: item.losses,
                  secondary: `${item.losses} recorded competitive losses`,
                  tertiary: "Recorded competitive losses",
                  description:
                    `${item.competitor} appears in ${item.losses} ` +
                    "competitive losses in the current filtered dataset. " +
                    "This is a descriptive count, not a win/loss rate or proof " +
                    "of why the deals were lost.",
                  action:
                    "Review the associated deal records and documented buyer " +
                    "objections, pricing and product requirements before deciding " +
                    "on follow-up.",
                });
              },
            }}
          />
        </section>
      </div>

      <IntelligencePanel
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
