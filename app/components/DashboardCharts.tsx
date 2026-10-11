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

  /* ---------------- LOSS REASON PARETO ---------------- */

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

  const cumulative = paretoValues.reduce<number[]>((values, value) => {
    const running = (values.at(-1) ?? 0) + value;

    values.push(running);
    return values;
  }, []).map((running) =>
    total > 0
      ? Math.round((running / total) * 100)
      : 0
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
        name: "Lost Deals",
        type: "bar",
        data: paretoValues,

        barMaxWidth: 36,

        itemStyle: {
          color: "#38bdf8",
          borderRadius: [5, 5, 0, 0],
        },
      },

      {
        name: "Cumulative",
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
    ...new Set(
      segments.map((item) => item.segment)
    ),
  ];

  const reasonLabels = [
    ...new Set(
      segments.map((item) => item.reason)
    ),
  ];

  const heatmapData = segments.map((item) => {
    const x = segmentLabels.indexOf(item.segment);
    const y = reasonLabels.indexOf(item.reason);

    return [x, y, item.value];
  });

  const heatmapMax =
    segments.length > 0
      ? Math.max(
          1,
          ...segments.map((item) => item.value)
        )
      : 1;

  const heatmapOption = {
    backgroundColor: "transparent",

    tooltip: {
      position: "top",

      formatter: (params: {
        data: [number, number, number];
      }) => {
        const [x, y, value] = params.data;

        return `
          <div>
            <strong>${segmentLabels[x]}</strong><br/>
            ${reasonLabels[y]}<br/>
            Lost deals: ${value}
          </div>
        `;
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
            shadowColor:
              "rgba(56,189,248,.5)",
          },
        },
      },
    ],
  };

  /* ---------------- COMPETITOR MATRIX ---------------- */

  const competitorOption = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
    },

    legend: {
      textStyle: {
        color: "#94a3b8",
      },
    },

    grid: {
      left: 45,
      right: 20,
      top: 50,
      bottom: 55,
    },

    xAxis: {
      type: "category",

      data: competitors.map(
        (item) => item.competitor
      ),

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
        name: "Wins",
        type: "bar",

        data: competitors.map(
          (item) => item.wins
        ),

        itemStyle: {
          color: "#38bdf8",
          borderRadius: [4, 4, 0, 0],
        },
      },

      {
        name: "Losses",
        type: "bar",

        data: competitors.map(
          (item) => item.losses
        ),

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

        {/* ================= PARETO ================= */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              LOSS-REASON PARETO
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Identifies the loss reasons contributing most
              to missed opportunities. Click a reason for
              intelligence.
            </p>
          </div>

          <ReactECharts
            option={paretoOption}
            style={{
              height: 300,
              width: "100%",
            }}
            opts={{
              renderer: "canvas",
            }}
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

                const item =
                  lossReasons[params.dataIndex];

                if (!item) return;

                setSelected({
                  type: "reason",
                  title: item.reason,
                  value: item.count,

                  secondary:
                    `${item.count} lost deals`,

                  tertiary:
                    "Loss Reason",

                  description:
                    `The loss reason "${item.reason}" contributes ${item.count} lost opportunities in the current filtered dataset. Management should investigate whether this pattern can be addressed through pricing, product fit, positioning or follow-up improvements.`,

                  action:
                    "Review the affected deals, identify recurring buyer objections and prioritize high-value opportunities where this loss reason may be recoverable.",
                });
              },
            }}
          />

        </section>

        {/* ================= HEATMAP ================= */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              SEGMENT HEATMAP
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Shows where specific loss reasons are
              concentrated.
            </p>
          </div>

          <ReactECharts
            option={heatmapOption}
            style={{
              height: 300,
              width: "100%",
            }}
            opts={{
              renderer: "canvas",
            }}
          />

        </section>

        {/* ================= COMPETITOR ================= */}

        <section className="rounded-2xl border border-[#1F2937] bg-[#0B1117] p-4">

          <div className="mb-3">
            <div className="text-[10px] font-semibold tracking-[0.25em] text-[#38BDF8]">
              COMPETITOR MATRIX
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Compares competitive wins and losses. Click a
              competitor for intelligence.
            </p>
          </div>

          <ReactECharts
            option={competitorOption}
            style={{
              height: 300,
              width: "100%",
            }}
            opts={{
              renderer: "canvas",
            }}
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

                const item =
                  competitors[params.dataIndex];

                if (!item) return;

                setSelected({
                  type: "competitor",

                  title: item.competitor,

                  value: item.losses,

                  secondary:
                    `${item.losses} competitive losses`,

                  tertiary:
                    `${item.wins} wins / ${item.losses} losses`,

                  description:
                    `${item.competitor} appears in ${item.losses} competitive losses in the current filtered dataset. This signal can help management investigate pricing, feature gaps, positioning and buyer-stage objections.`,

                  action:
                    "Compare competitive losses against wins, review recurring objections and identify high-value accounts where re-engagement may still be possible.",
                });
              },
            }}
          />

        </section>
      </div>

      {/* ================= INTELLIGENCE PANEL ================= */}

      <IntelligencePanel
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}