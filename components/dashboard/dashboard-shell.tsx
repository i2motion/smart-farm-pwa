"use client";

import { useEffect, useState } from "react";

import { DashboardCameraPreview } from "@/components/dashboard/dashboard-camera-preview";
import { DashboardDevicesModeEntry } from "@/components/dashboard/dashboard-devices-mode-entry";
import { DashboardWeatherCard } from "@/components/dashboard/dashboard-weather-card";
import { GreenhouseGrid } from "@/components/dashboard/greenhouse-grid";
import { getClimateSensors } from "@/lib/api/climate-api";
import { getDeviceStatus } from "@/lib/api/device-api";
import { shouldUseFarmHttp } from "@/lib/api/farm-env";
import { getGreenhouses } from "@/lib/api/farm-api";
import { getLatestSensors } from "@/lib/api/sensor-api";
import { climateStationDtoToSensor } from "@/lib/dashboard/climate-from-api";
import {
  applyLatestSensorsToZones,
  mergeDashboardZonesFromTemplates,
} from "@/lib/dashboard/merge-from-farm-api";
import {
  MOCK_CAMERAS,
  MOCK_CLIMATE_SENSORS,
  MOCK_DASHBOARD_SKY,
  MOCK_GREENHOUSES,
  MOCK_WEATHER,
} from "@/lib/dashboard/mock-data";
import type { ClimateSensor, GreenhouseZone } from "@/lib/dashboard/types";

const DASHBOARD_POLL_MS = 4_000;

export function DashboardShell() {
  const today = MOCK_WEATHER[0];
  const tomorrow = MOCK_WEATHER[1];
  const climateFallback = MOCK_CLIMATE_SENSORS[0];
  const [climateSensor, setClimateSensor] = useState<ClimateSensor>(climateFallback!);
  const [zones, setZones] = useState<GreenhouseZone[]>(MOCK_GREENHOUSES);

  useEffect(() => {
    let cancelled = false;
    const fallback = MOCK_CLIMATE_SENSORS[0]!;

    async function refresh() {
      if (!shouldUseFarmHttp()) {
        if (!cancelled) {
          setZones(MOCK_GREENHOUSES);
          setClimateSensor(fallback);
        }
        return;
      }

      const [ghRes, devRes, sensRes, climRes] = await Promise.all([
        getGreenhouses(),
        getDeviceStatus(),
        getLatestSensors(),
        getClimateSensors(),
      ]);

      if (cancelled) return;

      if (!ghRes.ok || !devRes.ok) {
        setZones(MOCK_GREENHOUSES);
        setClimateSensor(fallback);
        return;
      }

      let merged = mergeDashboardZonesFromTemplates(MOCK_GREENHOUSES, ghRes.data, devRes.data.greenhouses);
      if (sensRes.ok) {
        merged = applyLatestSensorsToZones(merged, sensRes.data);
      }
      setZones(merged);

      if (climRes.ok && climRes.data.station) {
        setClimateSensor(climateStationDtoToSensor(climRes.data.station, fallback));
      } else {
        setClimateSensor(fallback);
      }
    }

    void refresh();
    const id = setInterval(() => void refresh(), DASHBOARD_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!today || !tomorrow || !climateFallback) return null;

  return (
    <div className="relative mx-auto min-h-0 w-full max-w-[min(100%,1400px)] space-y-3 md:space-y-4 lg:max-w-[min(100%,1520px)] lg:space-y-4">
      <div className="flex flex-col gap-3 md:gap-4">
        <DashboardCameraPreview cameras={MOCK_CAMERAS} />
        <DashboardWeatherCard
          today={today}
          tomorrow={tomorrow}
          sunrise={MOCK_DASHBOARD_SKY.sunrise}
          sunset={MOCK_DASHBOARD_SKY.sunset}
          sensor={climateSensor}
        />
      </div>

      <DashboardDevicesModeEntry />

      <div>
        <p className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-[0.1em]">온실 요약</p>
        <GreenhouseGrid zones={zones} />
      </div>
    </div>
  );
}
