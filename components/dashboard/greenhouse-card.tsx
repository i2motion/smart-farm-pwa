"use client";

import { Sprout } from "lucide-react";

import { GreenhouseModeToggle } from "@/components/dashboard/greenhouse-mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GreenhouseZone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function GreenhouseCard({
  zone,
  className,
}: {
  zone: GreenhouseZone;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="space-y-2 p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <CardTitle className="truncate text-sm font-semibold leading-tight tracking-tight">
              {zone.name}
            </CardTitle>
            <CardDescription className="line-clamp-1 text-[11px] leading-snug">
              {zone.crop}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 rounded-full px-2 py-0 text-[10px] font-normal">
            {zone.status}
          </Badge>
        </div>
        <GreenhouseModeToggle greenhouseId={zone.id} mode={zone.mode} compact />
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 border-t border-border/50 p-3 pt-2">
        <div className="rounded-lg bg-muted/25 px-2 py-1.5 text-center ring-1 ring-border/40">
          <p className="text-muted-foreground text-[10px] font-medium">Temp</p>
          <p className="text-sm font-semibold tabular-nums">{zone.tempC.toFixed(1)}°</p>
        </div>
        <div className="rounded-lg bg-muted/25 px-2 py-1.5 text-center ring-1 ring-border/40">
          <p className="text-muted-foreground text-[10px] font-medium">RH</p>
          <p className="text-sm font-semibold tabular-nums">{zone.humidityPct}%</p>
        </div>
        <div className="rounded-lg bg-muted/25 px-2 py-1.5 text-center ring-1 ring-border/40">
          <p className="text-muted-foreground flex items-center justify-center gap-0.5 text-[10px] font-medium">
            <Sprout className="size-3 opacity-70" aria-hidden />
            Sub
          </p>
          <p className="text-sm font-semibold tabular-nums">{zone.soilPct}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
