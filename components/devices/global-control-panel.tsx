"use client";

import { Layers } from "lucide-react";

import { DeviceControlButton } from "@/components/devices/device-control-button";
import { ModeSelector } from "@/components/devices/mode-selector";
import type { GreenhouseDeviceRow } from "@/lib/devices/types";
import type { ControlMode } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

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

function all(rows: GreenhouseDeviceRow[], key: keyof GreenhouseDeviceRow): boolean {
  return rows.length > 0 && rows.every((r) => Boolean(r[key]));
}

/** Mixed if not uniform */
function fleetModeVisual(rows: GreenhouseDeviceRow[]): ControlMode | "MIXED" {
  if (!rows.length) return "MANUAL";
  const first = rows[0]!.mode;
  return rows.every((r) => r.mode === first) ? first : "MIXED";
}

export type GlobalControlPanelProps = {
  rows: GreenhouseDeviceRow[];
  globalLastAt: string | null;
  globalLastSummary: string;
  onFleetMode: (mode: ControlMode) => void;
  onFleetIrrigation: (next: boolean) => void;
  onFleetSkylight: (next: boolean) => void;
  onFleetSideWindow: (next: boolean) => void;
  onFleetFlowFan: (next: boolean) => void;
  onFleetHotAir: (next: boolean) => void;
  onFleetSprayer: (next: boolean) => void;
};

export function GlobalControlPanel({
  rows,
  globalLastAt,
  globalLastSummary,
  onFleetMode,
  onFleetIrrigation,
  onFleetSkylight,
  onFleetSideWindow,
  onFleetFlowFan,
  onFleetHotAir,
  onFleetSprayer,
}: GlobalControlPanelProps) {
  const modeVis = fleetModeVisual(rows);
  const modeMixed = modeVis === "MIXED";
  const modeForSelector: ControlMode = modeMixed ? "MANUAL" : modeVis;

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-gradient-to-br from-primary/[0.08] via-white/[0.04] to-transparent p-4 shadow-xl shadow-black/25",
        "md:p-5"
      )}
      aria-labelledby="global-devices-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Layers className="size-4 stroke-[1.5]" aria-hidden />
          </div>
          <div>
            <h2 id="global-devices-heading" className="text-[15px] font-semibold tracking-tight text-foreground">
              전체 제어
            </h2>
            <p className="text-muted-foreground mt-0.5 max-w-prose text-[11px] leading-relaxed">
              7개 온실 일괄 명령 — 목업 로컬 상태만 갱신됩니다.
            </p>
          </div>
        </div>
        {modeVis === "MIXED" ? (
          <span className="text-amber-400/90 shrink-0 rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold">
            동별 모드 혼합
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-black/25 p-3">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">전체 자동 / 수동</p>
          <p className="text-muted-foreground/90 mt-1 text-[10px] leading-snug">선택 시 모든 동에 동일 모드를 적용합니다.</p>
          <div className="mt-2">
            <ModeSelector mode={modeForSelector} mixed={modeMixed} onChange={(m) => onFleetMode(m)} />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-black/25 p-3 sm:col-span-2 lg:col-span-2">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">전체 구동</p>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 lg:grid-cols-3">
            <FleetRow label="관수" active={all(rows, "irrigationOn")} onOn={() => onFleetIrrigation(true)} onOff={() => onFleetIrrigation(false)} variant="onoff" />
            <FleetRow label="천창" active={all(rows, "skylightOpen")} onOn={() => onFleetSkylight(true)} onOff={() => onFleetSkylight(false)} variant="openclose" />
            <FleetRow label="측창" active={all(rows, "sideWindowOpen")} onOn={() => onFleetSideWindow(true)} onOff={() => onFleetSideWindow(false)} variant="openclose" />
            <FleetRow label="유동팬" active={all(rows, "flowFanOn")} onOn={() => onFleetFlowFan(true)} onOff={() => onFleetFlowFan(false)} variant="onoff" />
            <FleetRow label="온풍기" active={all(rows, "hotAirBlowerOn")} onOn={() => onFleetHotAir(true)} onOff={() => onFleetHotAir(false)} variant="onoff" />
            <FleetRow label="분무기" active={all(rows, "sprayerOn")} onOn={() => onFleetSprayer(true)} onOff={() => onFleetSprayer(false)} variant="onoff" />
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mt-4 border-t border-white/[0.06] pt-3 text-[10px]">
        <p>
          <span className="font-medium text-foreground/85">전체 마지막 명령</span> · {formatLastAt(globalLastAt)}
        </p>
        <p className="text-primary/90 mt-0.5 font-medium">{globalLastSummary}</p>
      </div>
    </section>
  );
}

function FleetRow({
  label,
  active,
  onOn,
  onOff,
  variant,
}: {
  label: string;
  active: boolean;
  onOn: () => void;
  onOff: () => void;
  variant: "onoff" | "openclose";
}) {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <span className="text-muted-foreground truncate text-[10px] font-medium">{label}</span>
      <DeviceControlButton variant={variant} active={active} onActive={onOn} onInactive={onOff} />
    </div>
  );
}
