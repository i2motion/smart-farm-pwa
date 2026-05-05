"use client";

import {
  Droplets,
  FlaskConical,
  Gauge,
  LandPlot,
  Thermometer,
} from "lucide-react";

import { SensorCard } from "@/components/greenhouse/sensor-card";
import type { GreenhouseSensorSnapshot, SensorKind } from "@/lib/greenhouse/types";
import { unitForSensor } from "@/lib/greenhouse/mock-data";

const SENSOR_CONFIG: {
  kind: SensorKind;
  label: string;
  sub?: string;
  icon: typeof Thermometer;
  format: (s: GreenhouseSensorSnapshot) => string;
}[] = [
  { kind: "temp", label: "온도", sub: "캐노피 근처", icon: Thermometer, format: (s) => s.tempC.toFixed(1) },
  { kind: "humidity", label: "습도", sub: "상대습도", icon: Droplets, format: (s) => String(Math.round(s.humidityPct)) },
  { kind: "soilMoisture", label: "토양 수분", sub: "체적수분 추정", icon: LandPlot, format: (s) => String(Math.round(s.soilMoisturePct)) },
  { kind: "soilTemp", label: "토양 온도", sub: "루트존", icon: Thermometer, format: (s) => s.soilTempC.toFixed(1) },
  { kind: "ec", label: "EC", sub: "배액", icon: Gauge, format: (s) => s.ecMScm.toFixed(1) },
  { kind: "ph", label: "pH", sub: "배액", icon: FlaskConical, format: (s) => s.ph.toFixed(1) },
];

export type SensorSummaryProps = {
  snapshot: GreenhouseSensorSnapshot;
  onOpenAlarm: (kind: SensorKind) => void;
};

export function SensorSummary({ snapshot, onOpenAlarm }: SensorSummaryProps) {
  return (
    <section aria-labelledby="sensor-summary-heading" className="space-y-3">
      <h2 id="sensor-summary-heading" className="sf-section-label">
        센서 요약
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {SENSOR_CONFIG.map((c) => (
          <SensorCard
            key={c.kind}
            kind={c.kind}
            label={c.label}
            value={c.format(snapshot)}
            unit={unitForSensor(c.kind)}
            sub={c.sub}
            icon={c.icon}
            onOpenAlarm={onOpenAlarm}
            className="min-w-0"
          />
        ))}
      </div>
    </section>
  );
}
