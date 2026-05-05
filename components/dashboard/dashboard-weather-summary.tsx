"use client";

import { ChevronRight, Cloud } from "lucide-react";
import Link from "next/link";

import type { WeatherDay } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function DashboardWeatherSummary({
  today,
  className,
}: {
  today: WeatherDay;
  className?: string;
}) {
  const rh = today.humidityPct != null ? `${today.humidityPct}%` : "—";

  return (
    <Link
      href="/weather"
      className={cn(
        "sf-glass sf-tesla-hover group flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 ring-1 ring-white/[0.04] md:rounded-2xl md:p-3.5",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-muted-foreground ring-1 ring-white/[0.08]">
          <Cloud className="size-4 stroke-[1.25]" aria-hidden />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="sf-section-label">날씨 요약</p>
          <p className="mt-0.5 truncate text-[14px] font-semibold text-foreground md:text-[15px]">{today.condition}</p>
          <p className="text-muted-foreground text-[11px] tabular-nums md:text-[12px]">
            오늘 {today.lowC}–{today.highC}°C · 습 {rh}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px] md:text-[11px]">3일 시간별 예보는 날씨 페이지에서 확인</p>
        </div>
      </div>
      <span className="text-muted-foreground flex shrink-0 items-center gap-0.5 text-[11px] font-semibold transition-colors group-hover:text-primary md:text-[12px]">
        상세
        <ChevronRight className="size-3.5 stroke-[1]" aria-hidden />
      </span>
    </Link>
  );
}
