"use client";

import { DashboardCameraPreview } from "@/components/dashboard/dashboard-camera-preview";
import { DashboardDevicesModeEntry } from "@/components/dashboard/dashboard-devices-mode-entry";
import { DashboardWeatherCard } from "@/components/dashboard/dashboard-weather-card";
import { GreenhouseGrid } from "@/components/dashboard/greenhouse-grid";
import {
  MOCK_CAMERAS,
  MOCK_CLIMATE_SENSORS,
  MOCK_DASHBOARD_SKY,
  MOCK_GREENHOUSES,
  MOCK_WEATHER,
} from "@/lib/dashboard/mock-data";

export function DashboardShell() {
  const today = MOCK_WEATHER[0];
  const tomorrow = MOCK_WEATHER[1];
  const sensor = MOCK_CLIMATE_SENSORS[0];
  if (!today || !tomorrow || !sensor) return null;

  return (
    <div className="relative mx-auto min-h-0 w-full max-w-[min(100%,1400px)] space-y-3 md:space-y-4 lg:max-w-[min(100%,1520px)] lg:space-y-4">
      <div className="flex flex-col gap-3 md:gap-4">
        <DashboardCameraPreview cameras={MOCK_CAMERAS} />
        <DashboardWeatherCard
          today={today}
          tomorrow={tomorrow}
          sunrise={MOCK_DASHBOARD_SKY.sunrise}
          sunset={MOCK_DASHBOARD_SKY.sunset}
          sensor={sensor}
        />
      </div>

      <DashboardDevicesModeEntry />

      <div>
        <p className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-[0.1em]">온실 요약</p>
        <GreenhouseGrid zones={MOCK_GREENHOUSES} />
      </div>
    </div>
  );
}
