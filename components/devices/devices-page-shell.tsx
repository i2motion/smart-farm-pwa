"use client";

import { useCallback, useState } from "react";

import { DevicesConfirmDialog } from "@/components/devices/devices-confirm-dialog";
import { GlobalControlPanel } from "@/components/devices/global-control-panel";
import { GreenhouseDevicePanel } from "@/components/devices/greenhouse-device-panel";
import type { ControlMode } from "@/lib/dashboard/types";
import { buildInitialDeviceRows } from "@/lib/devices/mock-data";
import type { DeviceActuatorKey, GreenhouseDeviceRow } from "@/lib/devices/types";

type PendingConfirm = {
  title: string;
  description: string;
  onConfirm: () => void;
} | null;

export function DevicesPageShell() {
  const [rows, setRows] = useState<GreenhouseDeviceRow[]>(() => buildInitialDeviceRows());
  const [globalLastAt, setGlobalLastAt] = useState<string | null>(null);
  const [globalLastSummary, setGlobalLastSummary] = useState<string>("—");
  const [pending, setPending] = useState<PendingConfirm>(null);

  const stampRow = useCallback((iso: string, summary: string): Pick<GreenhouseDeviceRow, "lastCommandAt" | "lastCommandSummary"> => {
    return { lastCommandAt: iso, lastCommandSummary: summary };
  }, []);

  const patchZone = useCallback(
    (zoneId: string, patch: Partial<GreenhouseDeviceRow>, summary: string) => {
      const iso = new Date().toISOString();
      setRows((prev) => prev.map((r) => (r.zoneId === zoneId ? { ...r, ...patch, ...stampRow(iso, summary) } : r)));
    },
    [stampRow]
  );

  const patchAll = useCallback(
    (patch: Partial<Pick<GreenhouseDeviceRow, DeviceActuatorKey | "mode">>, summary: string) => {
      const iso = new Date().toISOString();
      setGlobalLastAt(iso);
      setGlobalLastSummary(summary);
      setRows((prev) => prev.map((r) => ({ ...r, ...patch, ...stampRow(iso, summary) })));
    },
    [stampRow]
  );

  const openConfirm = useCallback((title: string, description: string, onConfirm: () => void) => {
    setPending({ title, description, onConfirm });
  }, []);

  const onModeChange = useCallback(
    (zoneId: string, mode: ControlMode) => {
      patchZone(zoneId, { mode }, mode === "AUTO" ? "자동 모드" : "수동 모드");
    },
    [patchZone]
  );

  const onActuatorChange = useCallback(
    (zoneId: string, key: DeviceActuatorKey, next: boolean, summary: string) => {
      patchZone(zoneId, { [key]: next } as Partial<GreenhouseDeviceRow>, summary);
    },
    [patchZone]
  );

  const onFleetMode = useCallback(
    (mode: ControlMode) => {
      patchAll({ mode }, mode === "AUTO" ? "전체 자동 모드" : "전체 수동 모드");
    },
    [patchAll]
  );

  const onFleetIrrigation = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm(
          "전체 관수 켜기",
          "7개 동 모두 관수를 켭니다. 목업이며 실제 밸브는 동작하지 않습니다. 현장 적용 전 항상 현장 확인이 필요합니다.",
          () => {
            patchAll({ irrigationOn: true }, "전체 관수 켜기");
            setPending(null);
          }
        );
      } else {
        patchAll({ irrigationOn: false }, "전체 관수 끄기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSkylight = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm(
          "전체 천창 열기",
          "기상·안전 조건을 확인하세요. 목업 로컬 상태만 바뀝니다.",
          () => {
            patchAll({ skylightOpen: true }, "전체 천창 열기");
            setPending(null);
          }
        );
      } else {
        patchAll({ skylightOpen: false }, "전체 천창 닫기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSideWindow = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm(
          "전체 측창 열기",
          "풍속·강우에 따라 수동 개방이 제한될 수 있습니다. 목업 상태만 갱신됩니다.",
          () => {
            patchAll({ sideWindowOpen: true }, "전체 측창 열기");
            setPending(null);
          }
        );
      } else {
        patchAll({ sideWindowOpen: false }, "전체 측창 닫기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetFlowFan = useCallback(
    (next: boolean) => {
      patchAll({ flowFanOn: next }, next ? "전체 유동팬 켜기" : "전체 유동팬 끄기");
    },
    [patchAll]
  );

  const onFleetHotAir = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm(
          "전체 온풍기 켜기",
          "연료·과열 위험 구역을 확인하세요. 목업 로컬 상태만 변경됩니다.",
          () => {
            patchAll({ hotAirBlowerOn: true }, "전체 온풍기 켜기");
            setPending(null);
          }
        );
      } else {
        patchAll({ hotAirBlowerOn: false }, "전체 온풍기 끄기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSprayer = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm(
          "전체 분무기 켜기",
          "약액·습윤 과다에 주의하세요. 목업 로컬 상태만 변경됩니다.",
          () => {
            patchAll({ sprayerOn: true }, "전체 분무기 켜기");
            setPending(null);
          }
        );
      } else {
        patchAll({ sprayerOn: false }, "전체 분무기 끄기");
      }
    },
    [openConfirm, patchAll]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">장비 · 구동 센터</h1>
        <p className="text-muted-foreground max-w-prose text-[13px] leading-relaxed sm:text-sm">
          온실별 자동/수동 모드와 관수·환기·분무 구동을 한 화면에서 조작합니다. PLC·MQTT 미연결 — 목업 상태만 유지됩니다.
        </p>
      </header>

      <DevicesConfirmDialog
        open={pending != null}
        title={pending?.title ?? ""}
        description={pending?.description ?? ""}
        confirmLabel="확인"
        onCancel={() => setPending(null)}
        onConfirm={() => pending?.onConfirm()}
      />

      <GlobalControlPanel
        rows={rows}
        globalLastAt={globalLastAt}
        globalLastSummary={globalLastSummary}
        onFleetMode={onFleetMode}
        onFleetIrrigation={onFleetIrrigation}
        onFleetSkylight={onFleetSkylight}
        onFleetSideWindow={onFleetSideWindow}
        onFleetFlowFan={onFleetFlowFan}
        onFleetHotAir={onFleetHotAir}
        onFleetSprayer={onFleetSprayer}
      />

      <div>
        <h2 className="text-muted-foreground mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]">온실별 패널</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <GreenhouseDevicePanel key={row.zoneId} row={row} onModeChange={onModeChange} onActuatorChange={onActuatorChange} />
          ))}
        </div>
      </div>
    </div>
  );
}
