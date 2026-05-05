import type { ClimateStationDto } from "@/lib/api/types";
import type { ClimateSensor } from "@/lib/dashboard/types";

function num(x: unknown, fallback: number): number {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() !== "") {
    const v = Number(x);
    if (Number.isFinite(v)) return v;
  }
  return fallback;
}

export function climateStationDtoToSensor(dto: ClimateStationDto, fallback: ClimateSensor): ClimateSensor {
  return {
    id: dto.id?.trim() ? dto.id : fallback.id,
    name: dto.name?.trim() ? dto.name : fallback.name,
    location: dto.location?.trim() ? dto.location : fallback.location,
    tempC: num(dto.tempC, fallback.tempC),
    humidityPct: Math.round(num(dto.humidityPct, fallback.humidityPct)),
    dewpointC: num(dto.dewpointC, fallback.dewpointC),
    batteryPct: Math.round(num(dto.batteryPct, fallback.batteryPct)),
    windMs: num(dto.windMs, fallback.windMs),
    windDirLabel: dto.windDirLabel?.trim() ? dto.windDirLabel : fallback.windDirLabel,
    solarRadiationWm2: Math.round(num(dto.solarRadiationWm2, fallback.solarRadiationWm2)),
    rainfallMm: num(dto.rainfallMm, fallback.rainfallMm),
  };
}
