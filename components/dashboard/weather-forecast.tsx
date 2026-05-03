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
  if (day.condition.toLowerCase().includes("rain")) {
    return <CloudRain className="size-4 text-muted-foreground" aria-hidden />;
  }
  return <CloudSun className="size-4 text-muted-foreground" aria-hidden />;
}

export function WeatherForecast({
  days,
  className,
}: {
  days: WeatherDay[];
  className?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">
          Outdoor · 3-day
        </CardTitle>
        <CardDescription className="text-xs">Planning reference · mock</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 sm:grid-cols-3">
        {days.map((day) => (
          <div
            key={day.id}
            className="flex gap-3 rounded-xl border border-border/50 bg-muted/15 px-3 py-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 shadow-sm ring-1 ring-border/60">
              <WeatherIcon day={day} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-xs font-medium leading-none">{day.label}</p>
              <p className="text-muted-foreground truncate text-[11px]">{day.condition}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] tabular-nums text-muted-foreground">
                <span>
                  {day.highC}° / {day.lowC}°
                </span>
                <span className="text-border">·</span>
                <span>{day.precipPct}% rain</span>
                <span className="inline-flex items-center gap-0.5">
                  <Wind className="size-3" aria-hidden />
                  {day.windMs.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
