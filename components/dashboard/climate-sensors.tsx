"use client";

import { Battery, Droplets, ThermometerSun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
}: {
  sensors: ClimateSensor[];
  className?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">Field climate</CardTitle>
        <CardDescription className="text-xs">Reference probes · 2 channels</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 pt-0">
        {sensors.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/15 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-xs font-medium">{s.name}</p>
              <p className="text-muted-foreground truncate text-[11px]">{s.location}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <div className="flex items-center gap-1 rounded-lg bg-background/70 px-2 py-1 text-[11px] tabular-nums ring-1 ring-border/60">
                <ThermometerSun className="size-3.5 text-muted-foreground" aria-hidden />
                {s.tempC.toFixed(1)}°C
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-background/70 px-2 py-1 text-[11px] tabular-nums ring-1 ring-border/60">
                <Droplets className="size-3.5 text-muted-foreground" aria-hidden />
                {s.humidityPct}%
              </div>
              <Badge variant="outline" className="h-7 rounded-lg px-2 text-[10px] font-normal">
                <Battery className="mr-1 size-3 opacity-70" aria-hidden />
                {s.batteryPct}%
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
