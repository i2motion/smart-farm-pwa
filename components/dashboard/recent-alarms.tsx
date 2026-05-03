"use client";

import { AlertTriangle, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AlarmSeverity, FarmAlarm } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function SeverityBadge({ severity }: { severity: AlarmSeverity }) {
  if (severity === "error") {
    return (
      <Badge variant="destructive" className="rounded-md px-1.5 py-0 text-[10px] font-medium">
        Error
      </Badge>
    );
  }
  if (severity === "warning") {
    return (
      <Badge
        variant="outline"
        className="rounded-md border-amber-500/35 bg-amber-500/[0.08] px-1.5 py-0 text-[10px] font-medium text-amber-950 dark:text-amber-100"
      >
        <AlertTriangle className="mr-0.5 size-3 opacity-80" aria-hidden />
        Warn
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-md border-sky-500/30 bg-sky-500/[0.06] px-1.5 py-0 text-[10px] font-medium text-sky-950 dark:text-sky-100"
    >
      <Info className="mr-0.5 size-3 opacity-80" aria-hidden />
      Info
    </Badge>
  );
}

export function RecentAlarms({
  alarms,
  className,
  scrollClassName,
}: {
  alarms: FarmAlarm[];
  className?: string;
  /** Scroll constraint for desktop rail / nested layouts */
  scrollClassName?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">Recent alarms</CardTitle>
        <CardDescription className="text-xs">
          Latest {alarms.length} · mock bridge
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className={cn(
            "divide-y divide-border/60 px-1 pb-1 overscroll-contain",
            scrollClassName ??
              "max-h-[320px] overflow-y-auto lg:max-h-[38vh]"
          )}
        >
          {alarms.map((row) => (
            <article key={row.id} className="flex gap-3 px-3 py-2.5">
              <div className="text-muted-foreground w-11 shrink-0 pt-0.5 font-mono text-[11px] tabular-nums">
                {row.time}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={row.severity} />
                  <span className="text-muted-foreground text-[11px] font-medium">
                    {row.alarmType}
                  </span>
                </div>
                <p className="text-foreground text-[13px] leading-snug">{row.message}</p>
                <p className="text-muted-foreground truncate text-[11px]">{row.greenhouseName}</p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
