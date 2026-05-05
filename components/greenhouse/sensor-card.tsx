"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
  /** 알람 목록 등 — 카드 테두리 안·측정 영역 하단에 표시 (버튼 밖에 두어 중첩 버튼 방지) */
  children?: ReactNode;
  className?: string;
};

export function SensorCard({
  kind,
  label,
  value,
  unit,
  sub,
  icon: Icon,
  onOpenAlarm,
  children,
  className,
}: SensorCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md transition-colors md:rounded-3xl",
        "hover:border-primary/25 hover:bg-white/[0.06]",
        className
      )}
    >
      {/* 상단 전체(값·라벨 영역) 탭 → 알람 등록 모달. 하단 알람 선택과 중첩 버튼 방지를 위해 오버레이 + pointer-events 분리 */}
      <div className="relative px-3 py-3 md:px-4 md:py-4">
        <button
          type="button"
          onClick={() => onOpenAlarm(kind)}
          aria-label={`${label} 알람 등록`}
          className={cn(
            "absolute inset-0 z-0",
            children ? "rounded-t-2xl md:rounded-t-3xl" : "rounded-2xl md:rounded-3xl",
            "focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
          )}
        />
        <div className="relative z-10 pointer-events-none text-left">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="size-3 shrink-0 stroke-[1] md:size-3.5" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] md:text-[11px]">{label}</span>
          </div>
          <p className="mt-1.5 text-[1.5rem] font-extralight tabular-nums tracking-tight text-foreground md:mt-2 md:text-[1.75rem]">
            {value}
            {unit ? <span className="ml-0.5 text-[13px] font-medium text-muted-foreground md:text-sm">{unit}</span> : null}
          </p>
          {sub ? <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug md:text-[12px]">{sub}</p> : null}
        </div>
      </div>
      {children ? (
        <div className="relative z-20 px-3 pb-3 pt-1.5 md:px-4 md:pb-4">{children}</div>
      ) : null}
    </div>
  );
}
