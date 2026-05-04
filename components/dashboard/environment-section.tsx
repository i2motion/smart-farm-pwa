"use client";

import { EnvironmentCompareStack, ForecastThreeDayStrip } from "@/components/dashboard/environment-compare";
import type { ClimateSensor } from "@/lib/dashboard/types";
import type { WeatherDay } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function EnvironmentSection({
  days,
  sensors,
  className,
}: {
  days: WeatherDay[];
  sensors: ClimateSensor[];
  className?: string;
}) {
  const today = days[0];
  if (!today) return null;

  return (
    <section className={cn("sf-surface p-4 sm:p-6", className)}>
      <div className="mb-5">
        <p className="sf-section-label">환경</p>
        <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed">
          실외(오늘)와 센서를 온도·습도 기준으로 같은 열 순서로 비교합니다.
        </p>
      </div>

      <EnvironmentCompareStack today={today} sensors={sensors} />

      <div className="mt-8 border-t border-border/35 pt-6">
        <p className="sf-section-label mb-4">3일 예보</p>
        <ForecastThreeDayStrip days={days} />
      </div>
    </section>
  );
}
