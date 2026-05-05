import type { GreenhouseSensorSnapshot } from "@/lib/greenhouse/types";

/** Overlay numeric fields from Farm PC `snapshot` JSON onto local mock snapshot. */
export function mergeSensorSnapshotFromApi(
  base: GreenhouseSensorSnapshot,
  snap: Record<string, number | string | boolean | null | undefined>
): GreenhouseSensorSnapshot {
  const num = (k: string, fallback: number) =>
    typeof snap[k] === "number" ? (snap[k] as number) : fallback;

  return {
    ...base,
    tempC: num("tempC", base.tempC),
    humidityPct: num("humidityPct", base.humidityPct),
    soilMoisturePct: typeof snap.soilMoisturePct === "number" ? snap.soilMoisturePct : base.soilMoisturePct,
    soilTempC: typeof snap.soilTempC === "number" ? snap.soilTempC : base.soilTempC,
    ecMScm: typeof snap.ecMScm === "number" ? snap.ecMScm : base.ecMScm,
    ph: typeof snap.ph === "number" ? snap.ph : base.ph,
    solarWm2: typeof snap.solarWm2 === "number" ? snap.solarWm2 : base.solarWm2,
  };
}
