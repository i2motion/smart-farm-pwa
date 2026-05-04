"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { DeviceControlButton } from "@/components/devices/device-control-button";
import { ModeSelector } from "@/components/devices/mode-selector";
import type { ControlMode, HealthLevel } from "@/lib/dashboard/types";
import type { DeviceActuatorKey, GreenhouseDeviceRow } from "@/lib/devices/types";
import { cn } from "@/lib/utils";

function healthLabel(h: HealthLevel): string {
  if (h === "normal") return "정상";
  if (h === "warning") return "주의";
  return "점검 필요";
}

function healthTone(h: HealthLevel): string {
  if (h === "normal") return "text-emerald-400/95";
  if (h === "warning") return "text-amber-400/95";
  return "text-rose-400/95";
}

function formatLastAt(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

export type GreenhouseDevicePanelProps = {
  row: GreenhouseDeviceRow;
  onModeChange: (zoneId: string, mode: ControlMode) => void;
  onActuatorChange: (zoneId: string, key: DeviceActuatorKey, next: boolean, summary: string) => void;
};

export function GreenhouseDevicePanel({ row, onModeChange, onActuatorChange }: GreenhouseDevicePanelProps) {
  const caution = row.mode === "AUTO";
  const modeLabel = row.mode === "AUTO" ? "자동" : "수동";

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 shadow-lg shadow-black/20",
        "backdrop-blur-md"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/greenhouses/${row.zoneId}`}
            className="group inline-flex max-w-full items-center gap-0.5 text-[15px] font-semibold tracking-tight text-foreground hover:text-primary"
          >
            <span className="truncate">{row.zoneName}</span>
            <ChevronRight className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden />
          </Link>
          <p className="text-muted-foreground mt-0.5 truncate text-[12px]">{row.crop}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">운전</span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              row.mode === "AUTO"
                ? "border-primary/35 bg-primary/15 text-primary"
                : "border-white/[0.1] bg-white/[0.06] text-foreground/90"
            )}
          >
            {modeLabel}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">종합 상태</p>
          <p className={cn("text-lg font-semibold tabular-nums tracking-tight md:text-xl", healthTone(row.healthStatus))}>{healthLabel(row.healthStatus)}</p>
        </div>
        <div className="min-w-[9.5rem] flex-1 sm:max-w-[11rem]">
          <p className="text-muted-foreground mb-1 text-[10px] font-medium">자동 / 수동</p>
          <ModeSelector mode={row.mode} onChange={(m) => onModeChange(row.zoneId, m)} />
        </div>
      </div>

      {caution ? (
        <p className="text-amber-400/85 mt-2 rounded-lg border border-amber-400/20 bg-amber-500/[0.08] px-2 py-1.5 text-[10px] leading-snug">
          자동 모드 — 아래 수동 구동은 목업으로만 반영됩니다. 현장 PLC와 다를 수 있습니다.
        </p>
      ) : null}

      <div className={cn("mt-3 space-y-2.5 rounded-xl border border-white/[0.05] bg-black/20 p-3", caution && "border-amber-400/15")}>
        <ControlRow label="관수" caution={caution}>
          <DeviceControlButton
            variant="onoff"
            active={row.irrigationOn}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "irrigationOn", true, "관수 켜기")}
            onInactive={() => onActuatorChange(row.zoneId, "irrigationOn", false, "관수 끄기")}
          />
        </ControlRow>
        <ControlRow label="천창" caution={caution}>
          <DeviceControlButton
            variant="openclose"
            active={row.skylightOpen}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "skylightOpen", true, "천창 열기")}
            onInactive={() => onActuatorChange(row.zoneId, "skylightOpen", false, "천창 닫기")}
          />
        </ControlRow>
        <ControlRow label="측창" caution={caution}>
          <DeviceControlButton
            variant="openclose"
            active={row.sideWindowOpen}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "sideWindowOpen", true, "측창 열기")}
            onInactive={() => onActuatorChange(row.zoneId, "sideWindowOpen", false, "측창 닫기")}
          />
        </ControlRow>
        <ControlRow label="유동팬" caution={caution}>
          <DeviceControlButton
            variant="onoff"
            active={row.flowFanOn}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "flowFanOn", true, "유동팬 켜기")}
            onInactive={() => onActuatorChange(row.zoneId, "flowFanOn", false, "유동팬 끄기")}
          />
        </ControlRow>
        <ControlRow label="온풍기" caution={caution}>
          <DeviceControlButton
            variant="onoff"
            active={row.hotAirBlowerOn}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "hotAirBlowerOn", true, "온풍기 켜기")}
            onInactive={() => onActuatorChange(row.zoneId, "hotAirBlowerOn", false, "온풍기 끄기")}
          />
        </ControlRow>
        <ControlRow label="분무기" caution={caution}>
          <DeviceControlButton
            variant="onoff"
            active={row.sprayerOn}
            cautionInAuto={caution}
            onActive={() => onActuatorChange(row.zoneId, "sprayerOn", true, "분무기 켜기")}
            onInactive={() => onActuatorChange(row.zoneId, "sprayerOn", false, "분무기 끄기")}
          />
        </ControlRow>
      </div>

      <div className="text-muted-foreground mt-3 space-y-0.5 border-t border-white/[0.06] pt-3 text-[10px]">
        <p>
          <span className="font-medium text-foreground/80">마지막 명령</span> · {formatLastAt(row.lastCommandAt)}
        </p>
        <p className="text-primary/90 font-medium">{row.lastCommandSummary}</p>
      </div>
    </article>
  );
}

function ControlRow({ label, caution, children }: { label: string; caution: boolean; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn("text-[11px] font-medium", caution ? "text-amber-200/75" : "text-muted-foreground")}>{label}</span>
      {children}
    </div>
  );
}
