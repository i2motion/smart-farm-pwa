"use client";

import { CloudRain, CloudSun, Wind } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WeatherDay } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function WeatherIcon({ day }: { day: WeatherDay }) {
  if (day.condition.toLowerCase().includes("비")) {
    return <CloudRain className="size-4 stroke-[1.5] text-muted-foreground" aria-hidden />;
  }
  return <CloudSun className="size-4 stroke-[1.5] text-muted-foreground" aria-hidden />;
}

export function WeatherForecast({
  days,
  className,
  embedded = false,
}: {
  days: WeatherDay[];
  className?: string;
  embedded?: boolean;
}) {
  const body = (
    <>
      <CardHeader className={cn("pb-3", embedded && "px-0 pt-0")}>
        <CardTitle className="text-[13px] font-medium tracking-tight sm:text-sm">3일 예보</CardTitle>
        <CardDescription className="text-[12px] leading-snug">실외 · 목업</CardDescription>
      </CardHeader>
      <CardContent className={cn("grid gap-3 pt-0 sm:grid-cols-3", embedded && "px-0 pb-0")}>
        {days.map((day) => (
          <div
            key={day.id}
            className="flex gap-3 rounded-lg border border-border/35 bg-muted/15 px-3 py-2.5 transition-colors hover:bg-muted/25 dark:bg-muted/10"
          >
            <div className="text-muted-foreground flex size-9 shrink-0 items-center justify-center">
              <WeatherIcon day={day} />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="truncate text-[13px] font-medium leading-tight">{day.label}</p>
              <p className="text-muted-foreground truncate text-[12px] leading-snug">{day.condition}</p>
              <div className="flex flex-wrap items-center gap-x-2 text-[12px] tabular-nums text-muted-foreground">
                <span>
                  {day.highC}° / {day.lowC}°
                </span>
                <span className="opacity-35">·</span>
                <span>{day.precipPct}%</span>
                <span className="inline-flex items-center gap-1">
                  <Wind className="size-3 stroke-[1.5]" aria-hidden />
                  {day.windMs.toFixed(1)} m/s
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );

  if (embedded) {
    return (
      <div className={cn("rounded-lg border border-border/35 bg-muted/10 p-3 dark:bg-muted/5", className)}>{body}</div>
    );
  }

  return <Card className={cn("sf-surface", className)}>{body}</Card>;
}
