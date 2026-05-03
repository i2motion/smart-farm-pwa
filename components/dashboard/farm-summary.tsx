"use client";

import { Activity, Cpu, Droplets, ThermometerSun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FarmSummarySnapshot } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export function FarmSummary({
  summary,
  updatedLabel = "Updated 14:36 · KST",
  className,
}: {
  summary: FarmSummarySnapshot;
  updatedLabel?: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-border/60 bg-card/80 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold tracking-tight">
            Farm overview
          </CardTitle>
          <CardDescription className="text-xs">{updatedLabel}</CardDescription>
        </div>
        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px] font-normal">
          Mock telemetry
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
          <Activity className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium">Alarms</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="destructive" className="rounded-md px-1.5 py-0 text-[10px]">
                {summary.openAlarms.critical} err
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md border-amber-500/30 bg-amber-500/[0.08] px-1.5 py-0 text-[10px] text-amber-950 dark:text-amber-100"
              >
                {summary.openAlarms.warning} warn
              </Badge>
              <Badge variant="outline" className="rounded-md px-1.5 py-0 text-[10px]">
                {summary.openAlarms.info} info
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
          <ThermometerSun className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
          <div className="min-w-0 space-y-0.5">
            <p className="text-muted-foreground text-[11px] font-medium">Avg canopy</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight">
              {summary.avgGreenhouseTempC.toFixed(1)}
              <span className="text-muted-foreground ml-0.5 text-sm font-normal">°C</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
          <Droplets className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
          <div className="min-w-0 space-y-0.5">
            <p className="text-muted-foreground text-[11px] font-medium">Irrigation queue</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight">
              {summary.irrigationQueuedZones}
              <span className="text-muted-foreground ml-1 text-sm font-normal">zones</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
          <Cpu className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="text-muted-foreground text-[11px] font-medium">Gateway</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-md bg-emerald-600 px-2 py-0 text-[11px] text-white hover:bg-emerald-600 dark:bg-emerald-600">
                {summary.gatewayStatus}
              </Badge>
              <span className="text-muted-foreground text-xs tabular-nums">
                {summary.lastPlcPollMs} ms
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
