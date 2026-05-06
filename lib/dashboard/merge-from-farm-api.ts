import type { DeviceFleetStatusDto, GreenhouseSummaryDto, SensorReadingDto } from "@/lib/api/types";

import type { ControlMode, GreenhouseZone, HealthLevel } from "@/lib/dashboard/types";

function healthFromApi(h: GreenhouseSummaryDto["health"]): HealthLevel {
  if (h === "error") return "error";
  if (h === "warning") return "warning";
  return "normal";
}

function cropFromSummary(summary: GreenhouseSummaryDto): string {
  const n = summary.cropName?.trim();
  if (n) return n;
  return summary.crop;
}

export type FleetGhRow = DeviceFleetStatusDto["greenhouses"][number];

/** Merge Farm PC summary + optional fleet row into UI zone (template fills temps/UI-only fields). */
/**
 * 대시보드용: `templates`(보통 `MOCK_GREENHOUSES` 제1~7동 순서)를 유지하고,
 * Farm PC가 내려준 요약·플릿만 해당 id에 덮어씁니다. API 목록에 없는 동은 목업 그대로 둡니다.
 */
export function mergeDashboardZonesFromTemplates(
  templates: GreenhouseZone[],
  summaries: GreenhouseSummaryDto[],
  fleet: FleetGhRow[]
): GreenhouseZone[] {
  return templates.map((template) => {
    const s = summaries.find((x) => x.id === template.id);
    if (!s) return template;
    const row = fleet.find((g) => g.greenhouseId === s.id);
    return mergeGreenhouseZoneFromFarmApi(s, row, template);
  });
}

export function mergeGreenhouseZoneFromFarmApi(
  summary: GreenhouseSummaryDto,
  fleet: FleetGhRow | undefined,
  template: GreenhouseZone | undefined
): GreenhouseZone {
  const t = template;
  const summaryMode: ControlMode = summary.mode === "MANUAL" ? "MANUAL" : "AUTO";

  const hasLeft = fleet?.skylightLeftOpenPct != null;
  const hasRight = fleet?.skylightRightOpenPct != null;
  const skylightLeftOpen = hasLeft ? (fleet!.skylightLeftOpenPct! > 0) : (fleet ? fleet.skylightOpenPct > 0 : (t?.skylightLeftOpen ?? false));
  const skylightRightOpen = hasRight
    ? (fleet!.skylightRightOpenPct! > 0)
    : (fleet ? fleet.skylightOpenPct > 0 : (t?.skylightRightOpen ?? false));
  const skylightOpen = skylightLeftOpen || skylightRightOpen;
  const sideWindowOpen = fleet ? fleet.sideWindowOpenPct > 0 : (t?.sideWindowOpen ?? false);

  return {
    id: summary.id,
    name: summary.name,
    crop: cropFromSummary(summary),
    tempC: t?.tempC ?? 22,
    humidityPct: t?.humidityPct ?? 65,
    soilPct: t?.soilPct ?? 55,
    status: t?.status ?? "",
    mode: fleet?.mode ?? summaryMode,
    healthStatus: healthFromApi(summary.health),
    irrigationRunning: fleet?.irrigationOn ?? t?.irrigationRunning ?? false,
    nutrientSupplyRunning: fleet?.nutrientSupplyActive ?? t?.nutrientSupplyRunning ?? false,
    skylightLeftOpen,
    skylightRightOpen,
    sideWindowLeftOpen: sideWindowOpen ? true : (t?.sideWindowLeftOpen ?? false),
    sideWindowRightOpen: sideWindowOpen ? true : (t?.sideWindowRightOpen ?? false),
    skylightOpen,
    sideWindowOpen,
    thermalCurtainOpen: t?.thermalCurtainOpen ?? false,
  };
}

type SensorPatch = Pick<GreenhouseZone, "tempC" | "humidityPct" | "soilPct">;

/** `/v1/sensors/latest` 읽기값으로 카드 온·습·토양수분만 덮어씁니다. */
export function applyLatestSensorsToZones(zones: GreenhouseZone[], readings: SensorReadingDto[]): GreenhouseZone[] {
  const byGh = new Map<string, SensorPatch>();
  for (const r of readings) {
    if (!r.greenhouseId) continue;
    let p = byGh.get(r.greenhouseId);
    if (!p) {
      p = {};
      byGh.set(r.greenhouseId, p);
    }
    const k = r.kind?.toLowerCase() ?? "";
    if (k === "temp") {
      p.tempC = r.value;
    } else if (k === "humidity") {
      p.humidityPct = Math.round(r.value);
    } else if (k === "soilmoisture") {
      p.soilPct = Math.round(r.value);
    }
  }
  return zones.map((z) => {
    const patch = byGh.get(z.id);
    if (!patch || Object.keys(patch).length === 0) return z;
    return { ...z, ...patch };
  });
}
