import { MOCK_GREENHOUSE_SENSOR_EXTRA, MOCK_GREENHOUSES } from "@/lib/dashboard/mock-data";
import type { GreenhouseZone } from "@/lib/dashboard/types";

import type { GreenhouseSensorSnapshot, SensorKind, TrendRange } from "./types";

/** 게이트웨이 온라인 여부(목업) */
export const MOCK_GREENHOUSE_EDGE_ONLINE: Record<string, boolean> = {
  "gh-01": true,
  "gh-02": true,
  "gh-03": true,
  "gh-04": true,
  "gh-05": true,
  "gh-06": true,
  "gh-07": false,
};

export function getGreenhouseEdgeOnline(zoneId: string): boolean {
  return MOCK_GREENHOUSE_EDGE_ONLINE[zoneId] ?? true;
}

export function getSensorSnapshot(zone: GreenhouseZone): GreenhouseSensorSnapshot {
  const extra = MOCK_GREENHOUSE_SENSOR_EXTRA[zone.id] ?? {
    ecMScm: 1.5,
    ph: 6.0,
    waterTankPct: 70,
  };
  const n = parseInt(zone.id.replace(/\D/g, ""), 10) || 1;
  return {
    tempC: zone.tempC,
    humidityPct: zone.humidityPct,
    rainMm: Math.max(0, 2.4 + (n % 4) * 0.35 + Math.sin(n) * 0.2),
    windMs: 1.8 + (n % 5) * 0.4,
    soilMoisturePct: zone.soilPct,
    soilTempC: zone.tempC - 1.2 - (n % 3) * 0.3,
    ecMScm: extra.ecMScm,
    ph: extra.ph,
  };
}

const SENSOR_LABEL: Record<SensorKind, string> = {
  temp: "온도",
  humidity: "습도",
  rain: "강수량",
  wind: "풍속",
  soilMoisture: "토양 수분",
  soilTemp: "토양 온도",
  ec: "EC",
  ph: "pH",
};

export function sensorKindLabel(kind: SensorKind): string {
  return SENSOR_LABEL[kind];
}

function trendPointCount(range: TrendRange): number {
  if (range === "1d") return 24;
  if (range === "1w") return 28;
  return 30;
}

function baseValueForSensor(snapshot: GreenhouseSensorSnapshot, sensor: SensorKind): number {
  switch (sensor) {
    case "temp":
      return snapshot.tempC;
    case "humidity":
      return snapshot.humidityPct;
    case "rain":
      return snapshot.rainMm;
    case "wind":
      return snapshot.windMs;
    case "soilMoisture":
      return snapshot.soilMoisturePct;
    case "soilTemp":
      return snapshot.soilTempC;
    case "ec":
      return snapshot.ecMScm;
    case "ph":
      return snapshot.ph;
    default:
      return 0;
  }
}

export function unitForSensor(sensor: SensorKind): string {
  switch (sensor) {
    case "temp":
    case "soilTemp":
      return "°C";
    case "humidity":
    case "soilMoisture":
      return "%";
    case "rain":
      return "mm";
    case "wind":
      return "m/s";
    case "ec":
      return "mS/cm";
    case "ph":
      return "";
    default:
      return "";
  }
}

export function getTrendSeries(
  snapshot: GreenhouseSensorSnapshot,
  range: TrendRange,
  sensor: SensorKind
): { labels: string[]; values: number[] } {
  const n = trendPointCount(range);
  const base = baseValueForSensor(snapshot, sensor);
  const amp =
    sensor === "temp" || sensor === "soilTemp"
      ? 1.8
      : sensor === "humidity" || sensor === "soilMoisture"
        ? 5
        : sensor === "rain"
          ? 0.8
          : sensor === "wind"
            ? 0.6
            : sensor === "ec"
              ? 0.25
              : 0.15;
  const labels: string[] = [];
  const values: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(n - 1, 1);
    const wobble = Math.sin(i * 0.7) * amp * 0.45 + Math.cos(i * 0.35) * amp * 0.25;
    values.push(base + wobble + (t - 0.5) * amp * 0.15);
    if (range === "1d") {
      labels.push(`${String(i).padStart(2, "0")}:00`);
    } else if (range === "1w") {
      labels.push(`${i + 1}일`);
    } else {
      labels.push(`${i + 1}일`);
    }
  }
  return { labels, values };
}

export function findGreenhouseZone(id: string): GreenhouseZone | undefined {
  return MOCK_GREENHOUSES.find((z) => z.id === id);
}
