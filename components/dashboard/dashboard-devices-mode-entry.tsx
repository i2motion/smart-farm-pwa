"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ModeSelector } from "@/components/devices/mode-selector";
import type { ControlMode } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/** 대시보드 요약: 카드 바탕 클릭 시 장비 페이지. 자동/수동 토글은 목업만(이동 없음). */
export function DashboardDevicesModeEntry() {
  const router = useRouter();
  const [fleetMode, setFleetMode] = useState<ControlMode>("AUTO");

  return (
    <section className="space-y-2 md:space-y-2.5" aria-labelledby="dashboard-devices-mode-heading">
      <div
        role="region"
        tabIndex={0}
        aria-label="전체 자동·수동 — 카드 안 빈 곳을 누르면 장비 페이지로 이동합니다"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-devices-mode-toggle]")) return;
          router.push("/devices");
        }}
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-devices-mode-toggle]")) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push("/devices");
          }
        }}
        className={cn(
          "sf-glass sf-tesla-hover group cursor-pointer rounded-2xl p-3 ring-1 ring-white/[0.04] outline-none transition-transform duration-200 md:rounded-3xl md:p-4 md:ring-0 lg:p-3.5",
          "hover:border-white/[0.12] hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.995]"
        )}
      >
        <div className="flex items-center justify-between gap-1 md:gap-2">
          <h2 id="dashboard-devices-mode-heading" className="sf-section-label">
            전체 자동 · 수동
          </h2>
          <span className="text-muted-foreground flex items-center gap-0.5 text-[11px] font-semibold transition-colors duration-200 group-hover:text-primary md:text-[13px]">
            <span className="hidden md:inline">장비</span>
            <ChevronRight
              className="size-3 shrink-0 stroke-[1] transition-transform duration-200 group-hover:translate-x-0.5 md:size-4"
              aria-hidden
            />
          </span>
        </div>
        <p className="text-muted-foreground mt-1 max-w-xl text-[13px] leading-snug md:mt-1.5 md:text-[14px] md:leading-relaxed">
          요약용 목업 토글입니다. 양액·구동 상세는 장비 페이지에서 하세요.
        </p>
        <div className="mt-3 max-w-md md:mt-3.5" data-devices-mode-toggle>
          <ModeSelector mode={fleetMode} onChange={setFleetMode} />
        </div>
      </div>
    </section>
  );
}
