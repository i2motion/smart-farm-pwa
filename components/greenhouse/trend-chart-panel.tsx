"use client";

import { useMemo, useState } from "react";

import { GreenhouseMockTrendChart } from "@/components/greenhouse/greenhouse-mock-trend-chart";
import { Button } from "@/components/ui/button";
import { getTrendSeries, sensorKindLabel, unitForSensor } from "@/lib/greenhouse/mock-data";
import type { GreenhouseSensorSnapshot, SensorKind, TrendRange } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

const TREND_SENSORS: SensorKind[] = ["temp", "humidity", "soilMoisture", "soilTemp", "ec", "ph"];

const RANGES: { key: TrendRange; label: string }[] = [
  { key: "1d", label: "1일" },
  { key: "1w", label: "1주" },
  { key: "1m", label: "1개월" },
];

function strokeFor(sensor: SensorKind): string {
  switch (sensor) {
    case "temp":
    case "soilTemp":
      return "stroke-primary";
    case "humidity":
    case "soilMoisture":
      return "stroke-sky-400/90";
    case "ec":
      return "stroke-violet-400/85";
    case "ph":
      return "stroke-emerald-400/85";
    default:
      return "stroke-primary";
  }
}

export type TrendChartPanelProps = {
  snapshot: GreenhouseSensorSnapshot;
};

export function TrendChartPanel({ snapshot }: TrendChartPanelProps) {
  const [sensor, setSensor] = useState<SensorKind>("temp");
  const [range, setRange] = useState<TrendRange>("1d");

  const { labels, values } = useMemo(() => getTrendSeries(snapshot, range, sensor), [snapshot, range, sensor]);
  const unit = unitForSensor(sensor);

  return (
    <section aria-labelledby="trend-chart-heading" className="space-y-3">
      <h2 id="trend-chart-heading" className="sf-section-label">
        추세 차트 (목업)
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {TREND_SENSORS.map((k) => (
          <Button
            key={k}
            type="button"
            size="sm"
            variant={sensor === k ? "default" : "ghost"}
            className={cn("h-8 rounded-full px-3 text-[11px] font-semibold md:text-[12px]", sensor === k && "shadow-sm")}
            onClick={() => setSensor(k)}
          >
            {sensorKindLabel(k)}
          </Button>
        ))}
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
      <GreenhouseMockTrendChart
        title={`${sensorKindLabel(sensor)} · ${RANGES.find((x) => x.key === range)?.label ?? ""}`}
        values={values}
        labels={labels}
        unit={unit || "—"}
        strokeClassName={strokeFor(sensor)}
        className="md:py-5"
      />
    </section>
  );
}
