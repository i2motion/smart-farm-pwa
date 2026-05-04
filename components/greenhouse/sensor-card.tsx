"use client";

import type { LucideIcon } from "lucide-react";

import type { SensorKind } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

export type SensorCardProps = {
  kind: SensorKind;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon: LucideIcon;
  onOpenAlarm: (kind: SensorKind) => void;
  className?: string;
};

export function SensorCard({ kind, label, value, unit, sub, icon: Icon, onOpenAlarm, className }: SensorCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenAlarm(kind)}
      className={cn(
        "w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-left backdrop-blur-md transition-colors hover:border-primary/25 hover:bg-white/[0.06] md:rounded-3xl md:px-4 md:py-4",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3 shrink-0 stroke-[1] md:size-3.5" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] md:text-[11px]">{label}</span>
      </div>
      <p className="mt-1.5 text-[1.5rem] font-extralight tabular-nums tracking-tight text-foreground md:mt-2 md:text-[1.75rem]">
        {value}
        {unit ? <span className="ml-0.5 text-[13px] font-medium text-muted-foreground md:text-sm">{unit}</span> : null}
      </p>
      {sub ? <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug md:text-[12px]">{sub}</p> : null}
      <p className="text-primary/80 mt-2 text-[10px] font-medium md:text-[11px]">알람 설정 · 탭</p>
    </button>
  );
}
