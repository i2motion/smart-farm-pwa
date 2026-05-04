"use client";

import { useMemo, useState } from "react";

import { GreenhouseMockTrendChart } from "@/components/greenhouse/greenhouse-mock-trend-chart";
import { Button } from "@/components/ui/button";
import { getTrendSeries, trendMetricLabel, TREND_METRIC_ORDER, unitForTrendMetric } from "@/lib/greenhouse/mock-data";
import type { GreenhouseSensorSnapshot, TrendMetricKind, TrendRange } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

const RANGES: { key: TrendRange; label: string }[] = [
  { key: "1d", label: "1일" },
  { key: "1w", label: "1주" },
  { key: "1m", label: "1개월" },
];

/** 지표마다 서로 다른 선·범례 색 (다중 선택 시 구분) */
const METRIC_CHART_COLOR: Record<TrendMetricKind, string> = {
  temp: "#38bdf8",
  humidity: "#a78bfa",
  soilMoisture: "#4ade80",
  soilTemp: "#fb923c",
  ec: "#f472b6",
  ph: "#2dd4bf",
  solar: "#fbbf24",
};

function strokeColorFor(metric: TrendMetricKind): string {
  return METRIC_CHART_COLOR[metric] ?? "#38bdf8";
}

export type TrendChartPanelProps = {
  snapshot: GreenhouseSensorSnapshot;
};

export function TrendChartPanel({ snapshot }: TrendChartPanelProps) {
  const [selected, setSelected] = useState<TrendMetricKind[]>(["temp", "humidity"]);
  const [range, setRange] = useState<TrendRange>("1d");

  function toggleMetric(m: TrendMetricKind) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(m)) {
        if (next.size <= 1) return prev;
        next.delete(m);
      } else {
        next.add(m);
      }
      return TREND_METRIC_ORDER.filter((k) => next.has(k));
    });
  }

  const { labels, series, title } = useMemo(() => {
    const rangeLabel = RANGES.find((x) => x.key === range)?.label ?? "";
    const first = selected[0] ?? "temp";
    const { labels: lb } = getTrendSeries(snapshot, range, first);
    const ser = selected.map((m) => {
      const r = getTrendSeries(snapshot, range, m);
      return {
        key: m,
        label: trendMetricLabel(m),
        values: r.values,
        unit: unitForTrendMetric(m),
        strokeColor: strokeColorFor(m),
      };
    });
    const titleBase =
      selected.length === 1 ? trendMetricLabel(selected[0]!) : `통합 (${selected.length}개 지표)`;
    return {
      labels: lb,
      series: ser,
      title: `${titleBase} · ${rangeLabel}`,
    };
  }, [snapshot, range, selected]);

  return (
    <section aria-labelledby="trend-chart-heading" className="space-y-3">
      <h2 id="trend-chart-heading" className="sf-section-label">
        추세 차트 (목업)
      </h2>
      <p className="text-muted-foreground text-[11px] leading-relaxed md:text-[12px]">
        지표를 여러 개 선택하면 한 차트에 겹쳐 표시하고, 하나만 선택하면 해당 지표만 표시합니다(세로축은 지표별 정규화).
      </p>
      <div className="flex flex-wrap gap-1.5">
        {TREND_METRIC_ORDER.map((k) => {
          const active = selected.includes(k);
          return (
            <Button
              key={k}
              type="button"
              size="sm"
              variant={active ? "secondary" : "ghost"}
              className={cn("h-8 rounded-full px-3 text-[11px] font-semibold md:text-[12px]", active && "shadow-sm")}
              onClick={() => toggleMetric(k)}
            >
              {trendMetricLabel(k)}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <Button
            key={r.key}
            type="button"
            size="sm"
            variant={range === r.key ? "secondary" : "ghost"}
            className={cn("h-8 rounded-full px-3 text-[11px] font-semibold md:text-[12px]")}
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </Button>
        ))}
      </div>
      <GreenhouseMockTrendChart title={title} labels={labels} series={series} className="md:py-5" />
    </section>
  );
}
