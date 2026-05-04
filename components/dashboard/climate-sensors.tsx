"use client";

import { Battery, Droplets, Sun, Thermometer, Wind } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ClimateSensor } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function ClimateSensors({
  sensors,
  className,
  embedded = false,
}: {
  sensors: ClimateSensor[];
  className?: string;
  embedded?: boolean;
}) {
  const body = (
    <>
      <CardHeader className={cn("pb-3", embedded && "px-0 pt-0")}>
        <CardTitle className="text-[13px] font-medium tracking-tight sm:text-sm">기후 센서</CardTitle>
        <CardDescription className="text-[12px] leading-snug">기준 채널 1개 · 목업</CardDescription>
      </CardHeader>
      <CardContent className={cn("grid gap-2 pt-0", embedded && "px-0 pb-0")}>
        {sensors.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-2 rounded-lg border border-border/35 bg-muted/15 px-3 py-2.5 transition-colors hover:bg-muted/25 sm:flex-row sm:items-center sm:justify-between dark:bg-muted/10"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-[13px] font-medium leading-snug">{s.name}</p>
              <p className="text-muted-foreground truncate text-[12px] leading-snug">{s.location}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-[12px] tabular-nums text-foreground dark:bg-background/50">
                <Thermometer className="size-3.5 stroke-[1.5] text-muted-foreground" aria-hidden />
                {s.tempC.toFixed(1)}°C
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-[12px] tabular-nums text-foreground dark:bg-background/50">
                <Droplets className="size-3.5 stroke-[1.5] text-muted-foreground" aria-hidden />
                {s.humidityPct}%
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-[12px] tabular-nums text-foreground dark:bg-background/50">
                <Wind className="size-3.5 stroke-[1.5] text-muted-foreground" aria-hidden />
                {s.windMs.toFixed(1)} m/s {s.windDirLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-[12px] tabular-nums text-foreground dark:bg-background/50">
                <Sun className="size-3.5 stroke-[1.5] text-muted-foreground" aria-hidden />
                {s.solarRadiationWm2} W/m²
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-[12px] tabular-nums text-muted-foreground">
                <Battery className="size-3.5 stroke-[1.5]" aria-hidden />
                {s.batteryPct}%
              </span>
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
