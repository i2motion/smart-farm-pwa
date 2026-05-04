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
    <div className="relative mx-auto min-h-0 w-full max-w-[min(100%,1400px)] space-y-1 md:space-y-4 lg:max-w-[min(100%,1520px)] lg:space-y-3.5 xl:max-w-[min(100%,1680px)] xl:space-y-3.5 2xl:max-w-[min(100%,1820px)]">
      <DashboardCameraPreview cameras={MOCK_CAMERAS} />

      <DashboardWeatherCard
        today={today}
        tomorrow={tomorrow}
        sunrise={MOCK_DASHBOARD_SKY.sunrise}
        sunset={MOCK_DASHBOARD_SKY.sunset}
        sensor={sensor}
      />

      <DashboardDevicesModeEntry />

      <GreenhouseGrid zones={MOCK_GREENHOUSES} />
    </div>
  );
}
