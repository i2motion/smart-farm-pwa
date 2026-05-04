"use client";

import { ChevronRight, Cloud, CloudRain, Sunrise, Sunset, Wind } from "lucide-react";
import Link from "next/link";

import type { ClimateSensor } from "@/lib/dashboard/types";
import type { WeatherDay } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function Glyph({ day, className }: { day: WeatherDay; className?: string }) {
  if (day.condition.includes("비")) {
    return <CloudRain className={cn("size-3.5 shrink-0 stroke-[1] text-muted-foreground md:size-4", className)} aria-hidden />;
  }
  return <Cloud className={cn("size-3.5 shrink-0 stroke-[1] text-muted-foreground md:size-4", className)} aria-hidden />;
}

function DayBlock({
  title,
  day,
  align,
}: {
  title: string;
  day: WeatherDay;
  align: "left" | "right";
}) {
  const rh = day.humidityPct != null ? `${day.humidityPct}%` : "—";
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <div className={cn("flex gap-1.5 md:gap-3", align === "right" && "flex-row-reverse")}>
        <div className="mt-0 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] md:mt-0.5 md:size-11 md:rounded-2xl">
          <Glyph day={day} />
        </div>
        <div className={cn("min-w-0 flex-1 leading-tight", align === "right" && "text-right")}>
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.08em] md:text-[12px] md:tracking-[0.1em]">
            {title}
          </p>
          <p className="mt-0 truncate text-[15px] font-semibold text-foreground md:mt-0.5 md:text-[17px]">{day.condition}</p>
          <p className="text-muted-foreground mt-0 text-[12px] tabular-nums leading-snug md:mt-0.5 md:text-[14px]">
            {day.lowC}–{day.highC}°C · 습 {rh}
          </p>
        </div>
      </div>
    </div>
  );
}

function WeatherCompactMobile({
  today,
  tomorrow,
  sunrise,
  sunset,
  sensor,
}: {
  today: WeatherDay;
  tomorrow: WeatherDay;
  sunrise: string;
  sunset: string;
  sensor: ClimateSensor;
}) {
  const rhToday = today.humidityPct != null ? `${today.humidityPct}%` : "—";
  const rhTom = tomorrow.humidityPct != null ? `${tomorrow.humidityPct}%` : "—";

  return (
    <div className="mt-1.5 space-y-1.5 md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex min-w-0 gap-1.5 rounded-lg bg-white/[0.03] p-1.5 ring-1 ring-white/[0.05]">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
            <Glyph day={today} />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">오늘</p>
            <p className="truncate text-[13px] font-semibold text-foreground">{today.condition}</p>
            <p className="text-[11px] tabular-nums text-muted-foreground">
              {today.lowC}–{today.highC}° · {rhToday}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 gap-1.5 rounded-lg bg-white/[0.03] p-1.5 text-right ring-1 ring-white/[0.05]">
          <div className="order-2 flex size-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
            <Glyph day={tomorrow} />
          </div>
          <div className="order-1 min-w-0 flex-1 leading-tight">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">내일</p>
            <p className="truncate text-[13px] font-semibold text-foreground">{tomorrow.condition}</p>
            <p className="text-[11px] tabular-nums text-muted-foreground">
              {tomorrow.lowC}–{tomorrow.highC}° · {rhTom}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.02] px-2 py-1.5 ring-1 ring-white/[0.04]">
        <div className="flex min-w-0 items-center gap-1">
          <Sunrise className="size-3 shrink-0 text-muted-foreground" aria-hidden />
          <div className="min-w-0 leading-none">
            <p className="text-[9px] font-semibold uppercase text-muted-foreground">일출</p>
            <p className="text-[13px] font-semibold tabular-nums text-foreground">{sunrise}</p>
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-1 text-right">
          <div className="min-w-0 leading-none">
            <p className="text-[9px] font-semibold uppercase text-muted-foreground">일몰</p>
            <p className="text-[13px] font-semibold tabular-nums text-foreground">{sunset}</p>
          </div>
          <Sunset className="size-3 shrink-0 text-muted-foreground" aria-hidden />
        </div>
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">기후 · {sensor.name}</p>
        <div className="mt-1 grid grid-cols-3 gap-x-1.5 gap-y-1">
          <div className="rounded-md bg-white/[0.03] px-1.5 py-1 ring-1 ring-white/[0.04]">
            <p className="text-[9px] text-muted-foreground">온도</p>
            <p className="text-[14px] font-semibold tabular-nums leading-none text-foreground">{sensor.tempC.toFixed(1)}°</p>
          </div>
          <div className="rounded-md bg-white/[0.03] px-1.5 py-1 ring-1 ring-white/[0.04]">
            <p className="text-[9px] text-muted-foreground">습도</p>
            <p className="text-[14px] font-semibold tabular-nums leading-none text-foreground">{sensor.humidityPct}%</p>
          </div>
          <div className="rounded-md bg-white/[0.03] px-1.5 py-1 ring-1 ring-white/[0.04]">
            <p className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <Wind className="size-2.5 shrink-0" aria-hidden />
              풍속
            </p>
            <p className="text-[14px] font-semibold tabular-nums leading-none text-foreground">{sensor.windMs.toFixed(1)}</p>
          </div>
          <div className="col-span-2 rounded-md bg-white/[0.03] px-1.5 py-1 ring-1 ring-white/[0.04]">
            <p className="text-[9px] text-muted-foreground">풍향</p>
            <p className="truncate text-[12px] font-semibold text-foreground">{sensor.windDirLabel}</p>
          </div>
          <div className="rounded-md bg-white/[0.03] px-1.5 py-1 ring-1 ring-white/[0.04]">
            <p className="text-[9px] text-muted-foreground">일사</p>
            <p className="text-[12px] font-semibold tabular-nums text-foreground">{sensor.solarRadiationWm2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardWeatherCard({
  today,
  tomorrow,
  sunrise,
  sunset,
  sensor,
  className,
}: {
  today: WeatherDay;
  tomorrow: WeatherDay;
  sunrise: string;
  sunset: string;
  sensor: ClimateSensor;
  className?: string;
}) {
  return (
    <Link
      href="/weather"
      className={cn(
        "sf-glass sf-tesla-hover group block rounded-2xl p-3 ring-1 ring-white/[0.04] md:rounded-3xl md:p-4 md:ring-0 lg:p-3.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-1 md:gap-2">
        <p className="sf-section-label">날씨</p>
        <span className="text-muted-foreground flex items-center gap-0.5 text-[11px] font-semibold transition-colors duration-200 group-hover:text-primary md:text-[13px]">
          <span className="hidden md:inline">상세</span>
          <ChevronRight className="size-3 shrink-0 stroke-[1] transition-transform duration-200 group-hover:translate-x-0.5 md:size-4" aria-hidden />
        </span>
      </div>

      <WeatherCompactMobile
        today={today}
        tomorrow={tomorrow}
        sunrise={sunrise}
        sunset={sunset}
        sensor={sensor}
      />

      <div className="mt-1.5 hidden border-b border-white/[0.06] pb-1.5 md:mt-3 md:grid md:grid-cols-2 md:gap-6 md:border-0 md:pb-0 lg:mt-2.5 lg:gap-5">
        <DayBlock title="오늘" day={today} align="left" />
        <DayBlock title="내일" day={tomorrow} align="right" />
      </div>

      <div className="mt-1.5 hidden border-b border-white/[0.06] pb-1.5 md:mt-4 md:flex md:gap-5 md:border-0 md:pb-0 lg:mt-3 lg:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-2.5">
          <Sunrise className="size-3.5 shrink-0 stroke-[1] text-muted-foreground md:size-4" aria-hidden />
          <div className="min-w-0 leading-tight">
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.06em] md:text-[12px]">일출</p>
            <p className="text-[15px] font-semibold tabular-nums text-foreground md:text-[16px]">{sunrise}</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-2.5">
          <Sunset className="size-3.5 shrink-0 stroke-[1] text-muted-foreground md:size-4" aria-hidden />
          <div className="min-w-0 leading-tight">
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.06em] md:text-[12px]">일몰</p>
            <p className="text-[15px] font-semibold tabular-nums text-foreground md:text-[16px]">{sunset}</p>
          </div>
        </div>
      </div>

      <div className="mt-1.5 hidden md:mt-4 md:block lg:mt-3">
        <p className="text-muted-foreground mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] md:mb-1.5 md:text-[12px]">
          기후 · {sensor.name}
        </p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[13px] tabular-nums leading-tight md:grid-cols-3 md:gap-x-3 md:gap-y-2 md:text-[14px] md:leading-normal lg:gap-x-3 lg:gap-y-1.5">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium md:text-[12px]">온도</p>
            <p className="mt-0 text-[16px] font-semibold text-foreground md:mt-0.5 md:text-[17px]">{sensor.tempC.toFixed(1)}°C</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium md:text-[12px]">습도</p>
            <p className="mt-0 text-[16px] font-semibold text-foreground md:mt-0.5 md:text-[17px]">{sensor.humidityPct}%</p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-0.5 text-[11px] font-medium md:gap-1 md:text-[12px]">
              <Wind className="size-3 shrink-0 stroke-[1] md:size-3.5" aria-hidden />
              풍속
            </p>
            <p className="mt-0 text-[16px] font-semibold text-foreground md:mt-0.5 md:text-[17px]">{sensor.windMs.toFixed(1)} m/s</p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium md:text-[12px]">풍향</p>
            <p className="mt-0 text-[15px] font-semibold text-foreground md:mt-0.5 md:text-[16px]">{sensor.windDirLabel}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-muted-foreground text-[11px] font-medium md:text-[12px]">일사</p>
            <p className="mt-0 text-[15px] font-semibold text-foreground md:mt-0.5 md:text-[16px]">{sensor.solarRadiationWm2} W/m²</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
