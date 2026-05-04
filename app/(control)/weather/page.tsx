import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MOCK_WEATHER_HOURLY } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "날씨",
};

export default function WeatherPage() {
  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sf-page-title">날씨</h1>
          <p className="sf-page-sub">3일 시간대별 예보 · 목업</p>
        </div>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl")}>
          대시보드
        </Link>
      </div>

      <div className="space-y-5">
        {MOCK_WEATHER_HOURLY.map((day) => (
          <section
            key={day.id}
            className="rounded-2xl bg-muted/15 p-4 shadow-sm ring-1 ring-border/10 dark:bg-muted/10"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-medium text-foreground">{day.label}</h2>
              <p className="text-muted-foreground text-[13px]">{day.condition}</p>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {day.hours.map((h) => (
                <div
                  key={`${day.id}-${h.time}`}
                  className="min-w-[5.5rem] shrink-0 rounded-xl bg-card/80 px-3 py-2.5 text-center shadow-sm ring-1 ring-border/15 dark:bg-card/50"
                >
                  <p className="text-muted-foreground text-[11px] font-medium tabular-nums">{h.time}</p>
                  <p className="mt-1 text-lg font-medium tabular-nums text-foreground">{h.tempC}°</p>
                  <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">강수 {h.precipPct}%</p>
                  <p className="text-muted-foreground text-[10px] tabular-nums">{h.windMs.toFixed(1)} m/s</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
