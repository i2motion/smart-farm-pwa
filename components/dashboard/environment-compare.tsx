"use client";

import { CloudRain, CloudSun } from "lucide-react";

import type { ClimateSensor } from "@/lib/dashboard/types";
import type { WeatherDay } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function WeatherGlyph({ day }: { day: WeatherDay }) {
  if (day.condition.includes("비")) {
    return <CloudRain className="size-4 shrink-0 stroke-[1.5] text-muted-foreground" aria-hidden />;
  }
  return <CloudSun className="size-4 shrink-0 stroke-[1.5] text-muted-foreground" aria-hidden />;
}

/** 공통 열: 구분 | 온도 | 습도 | (실외:강수% / 센서:이슬점) | (실외:풍속 / 센서:풍향·일사) */
const COL_GRID =
  "grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-[minmax(8.5rem,11rem)_repeat(4,minmax(0,1fr))] sm:gap-x-4 sm:gap-y-0";

function CompareHeader() {
  return (
    <div
      className={cn(
        COL_GRID,
        "text-muted-foreground hidden border-b border-border/35 bg-muted/25 px-3 py-2.5 text-[11px] font-medium sm:grid dark:bg-muted/15"
      )}
    >
      <span className="min-w-0">구분</span>
      <span>온도</span>
      <span>습도</span>
      <span className="min-w-0">강수 · 이슬점</span>
      <span className="min-w-0">풍속 · 풍향·일사</span>
    </div>
  );
}

function OutdoorTodayRow({ day }: { day: WeatherDay }) {
  const rh = day.humidityPct != null ? `${day.humidityPct}%` : "—";
  return (
    <div className={cn(COL_GRID, "border-b border-border/30 bg-muted/15 px-3 py-3 dark:bg-muted/10 sm:items-center sm:py-2.5")}>
      <div className="col-span-2 flex min-w-0 items-start gap-2 sm:col-span-1 sm:flex-col sm:gap-1">
        <div className="flex items-center gap-2">
          <WeatherGlyph day={day} />
          <div className="min-w-0">
            <p className="text-[13px] font-medium leading-tight text-foreground">실외 · 오늘</p>
            <p className="text-muted-foreground truncate text-[12px]">{day.condition}</p>
          </div>
        </div>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">온도 </span>
        <span className="text-[15px] font-medium text-foreground">
          {day.lowC.toFixed(0)}–{day.highC.toFixed(0)}°C
        </span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">습도 </span>
        <span className="text-[15px] font-medium text-foreground">{rh}</span>
        <span className="text-muted-foreground mt-0.5 block text-[10px] sm:hidden">예보·추정</span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">강수 </span>
        <span className="text-[15px] font-medium text-foreground">{day.precipPct}%</span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">풍속 </span>
        <span className="text-[15px] font-medium text-foreground">{day.windMs.toFixed(1)} m/s</span>
      </div>
    </div>
  );
}

function SensorRow({ sensor }: { sensor: ClimateSensor }) {
  return (
    <div className={cn(COL_GRID, "border-b border-border/30 px-3 py-3 last:border-b-0 sm:items-center sm:py-2.5")}>
      <div className="col-span-2 min-w-0 sm:col-span-1">
        <p className="truncate text-[13px] font-medium text-foreground">{sensor.name}</p>
        <p className="text-muted-foreground truncate text-[12px] leading-snug">{sensor.location}</p>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">온도 </span>
        <span className="text-[15px] font-medium text-foreground">{sensor.tempC.toFixed(1)}°C</span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">습도 </span>
        <span className="text-[15px] font-medium text-foreground">{sensor.humidityPct}%</span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">이슬 </span>
        <span className="text-[15px] font-medium text-foreground">{sensor.dewpointC.toFixed(1)}°C</span>
      </div>
      <div className="tabular-nums">
        <span className="text-muted-foreground sm:hidden">풍향·일사 </span>
        <span className="text-[15px] font-medium text-foreground">
          {sensor.windDirLabel} · {sensor.windMs.toFixed(1)} m/s · {sensor.solarRadiationWm2} W/m²
        </span>
      </div>
    </div>
  );
}

/**
 * 실외(오늘)를 첫 행, 기후 센서를 그 아래 같은 열에 배치해 비교합니다.
 */
export function EnvironmentCompareStack({
  today,
  sensors,
  className,
}: {
  today: WeatherDay;
  sensors: ClimateSensor[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/40", className)}>
      <CompareHeader />
      <OutdoorTodayRow day={today} />
      {sensors.map((s) => (
        <SensorRow key={s.id} sensor={s} />
      ))}
    </div>
  );
}

/** 3일 예보 — 비교 블록 아래 가로 요약 */
export function ForecastThreeDayStrip({ days }: { days: WeatherDay[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {days.map((day) => (
        <div
          key={day.id}
          className="flex gap-3 rounded-lg border border-border/35 bg-muted/15 px-3 py-2.5 dark:bg-muted/10"
        >
          <div className="text-muted-foreground flex size-9 shrink-0 items-center justify-center">
            <WeatherGlyph day={day} />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[13px] font-medium leading-tight">{day.label}</p>
            <p className="text-muted-foreground text-[12px] leading-snug">{day.condition}</p>
            <p className="text-muted-foreground text-[12px] tabular-nums">
              {day.highC}° / {day.lowC}° · 강수 {day.precipPct}% · {day.windMs.toFixed(1)} m/s
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
