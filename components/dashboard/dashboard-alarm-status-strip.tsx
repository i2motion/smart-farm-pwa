"use client";

import { AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

import type { FarmAlarm } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function DashboardAlarmStatusStrip({ alarm }: { alarm: FarmAlarm }) {
  const shell =
    alarm.severity === "error"
      ? "border-rose-400/35 bg-rose-500/[0.14] text-rose-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      : alarm.severity === "warning"
        ? "border-amber-400/35 bg-amber-500/[0.12] text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : "border-white/[0.1] bg-white/[0.06] text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

  const dot =
    alarm.severity === "error"
      ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.55)]"
      : alarm.severity === "warning"
        ? "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.45)]"
        : "bg-sky-400/90";

  return (
    <Link
      href="/alarms"
      className={cn(
        "flex w-full max-w-full items-center gap-1.5 rounded-full border px-2 py-1 transition-[background-color,border-color,transform] duration-200 active:scale-[0.99] md:gap-2 md:px-2.5 md:py-1",
        shell
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden />
      {alarm.severity === "info" ? (
        <Info className="size-3 shrink-0 opacity-90 md:size-3.5" aria-hidden />
      ) : (
        <AlertTriangle className="size-3 shrink-0 opacity-90 md:size-3.5" aria-hidden />
      )}
      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-tight tracking-tight md:text-[12px]">
        <span className="text-current/85">{alarm.alarmType}</span>
        <span className="text-current/45"> · </span>
        <span className="font-medium text-current/90">{alarm.message}</span>
      </span>
      <time className="shrink-0 text-[10px] font-semibold tabular-nums text-current/50 md:text-[11px]" dateTime={alarm.time}>
        {alarm.time}
      </time>
    </Link>
  );
}
