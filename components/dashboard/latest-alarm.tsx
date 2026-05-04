"use client";

import { ChevronRight, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AlarmSeverity, FarmAlarm } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function SeverityBadge({ severity }: { severity: AlarmSeverity }) {
  if (severity === "error") {
    return (
      <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-[11px] font-medium">
        오류
      </Badge>
    );
  }
  if (severity === "warning") {
    return (
      <Badge
        variant="outline"
        className="rounded-md border-amber-500/25 bg-amber-500/[0.06] px-2 py-0.5 text-[11px] font-medium text-amber-950 dark:text-amber-100"
      >
        경고
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] font-medium">
      정보
    </Badge>
  );
}

export function LatestAlarm({
  alarm,
  className,
  compact = false,
}: {
  alarm: FarmAlarm;
  className?: string;
  /** 대시보드 사이드바용 컴팩트 레이아웃 */
  compact?: boolean;
}) {
  return (
    <Card
      className={cn(
        "sf-surface flex flex-col border-border/40 shadow-sm",
        compact && "ring-1 ring-black/[0.02] dark:ring-white/[0.04]",
        className
      )}
    >
      <CardHeader
        className={cn(
          "flex flex-row flex-wrap items-start gap-3 space-y-0 sm:gap-4",
          compact ? "p-3 pb-2" : "pb-3"
        )}
      >
        <div className={cn("text-muted-foreground shrink-0", compact ? "mt-0.5" : "mt-0.5")}>
          <TriangleAlert className={cn("stroke-[1.5]", compact ? "size-3.5" : "size-4")} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className={cn("font-medium tracking-tight", compact ? "text-[13px]" : "text-[15px]")}>
              최근 알람
            </CardTitle>
            <SeverityBadge severity={alarm.severity} />
          </div>
          <CardDescription className={cn("leading-snug", compact ? "text-[12px]" : "text-[13px]")}>
            {alarm.time} · {alarm.alarmType}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-1.5 pt-0", compact ? "px-3 pb-3" : "space-y-2")}>
        <p className={cn("leading-relaxed text-foreground", compact ? "text-[13px]" : "text-[15px]")}>
          {alarm.message}
        </p>
        <p className={cn("text-muted-foreground", compact ? "text-[12px]" : "text-[13px]")}>{alarm.greenhouseName}</p>
      </CardContent>
      <CardFooter className={cn("mt-auto border-t border-border/35 bg-transparent", compact ? "px-3 py-2.5" : "pt-4")}>
        <Link
          href="/alarms"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "group gap-1 px-1 font-medium text-primary hover:bg-transparent",
            compact ? "h-8 text-[12px]" : "h-9 text-[13px]"
          )}
        >
          알람 보기
          <ChevronRight className={cn("transition-transform group-hover:translate-x-0.5", compact ? "size-3.5" : "size-4")} aria-hidden />
        </Link>
      </CardFooter>
    </Card>
  );
}
