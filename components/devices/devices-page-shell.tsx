"use client";

import { useCallback, useEffect, useState } from "react";

import { DevicesConfirmDialog } from "@/components/devices/devices-confirm-dialog";
import { GlobalControlPanel } from "@/components/devices/global-control-panel";
import { GreenhouseDevicePanel } from "@/components/devices/greenhouse-device-panel";
import { NutrientSolutionPanel } from "@/components/devices/nutrient-solution-panel";
import type { ControlMode } from "@/lib/dashboard/types";
import { buildInitialDeviceRows } from "@/lib/devices/mock-data";
import type { DeviceActuatorKey, GreenhouseDeviceRow } from "@/lib/devices/types";

const HEATER_CHECKBOX_LABEL =
  "온풍기 가동의 화재·과열 위험을 이해했고, 현장 확인 후 실행함을 확인합니다.";

type PendingConfirm = {
  title: string;
  description: string;
  onConfirm: () => void;
  requireAcknowledgement?: boolean;
  acknowledgementLabel?: string;
} | null;

export function DevicesPageShell() {
  const [rows, setRows] = useState<GreenhouseDeviceRow[]>(() => buildInitialDeviceRows());
  const [globalLastAt, setGlobalLastAt] = useState<string | null>(null);
  const [globalLastSummary, setGlobalLastSummary] = useState<string>("—");
  const [pending, setPending] = useState<PendingConfirm>(null);
  const [confirmAck, setConfirmAck] = useState(false);

  useEffect(() => {
    setConfirmAck(false);
  }, [pending?.title]);

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

  const openConfirm = useCallback((opts: NonNullable<PendingConfirm>) => {
    setPending(opts);
  }, []);

  const onModeChange = useCallback(
    (zoneId: string, mode: ControlMode) => {
      patchZone(zoneId, { mode }, mode === "AUTO" ? "자동 모드" : "수동 모드");
    },
    [patchZone]
  );

  const requestActuator = useCallback(
    (zoneId: string, key: DeviceActuatorKey, next: boolean, summary: string) => {
      if (key === "hotAirBlowerOn" && next) {
        openConfirm({
          title: "온풍기 켜기",
          description:
            "온풍기는 연료·과열·연소 위험이 있습니다. 목업 로컬 상태만 갱신되며 실제 PLC 출력은 없습니다. 현장 확인은 필수입니다.",
          requireAcknowledgement: true,
          acknowledgementLabel: HEATER_CHECKBOX_LABEL,
          onConfirm: () => {
            patchZone(zoneId, { hotAirBlowerOn: true }, summary);
            setPending(null);
          },
        });
        return;
      }
      patchZone(zoneId, { [key]: next } as Partial<GreenhouseDeviceRow>, summary);
    },
    [openConfirm, patchZone]
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
        openConfirm({
          title: "전체 급수 켜기",
          description:
            "7개 동 모두 원수 급수를 켭니다. 목업이며 실제 밸브는 동작하지 않습니다. 현장 적용 전 항상 현장 확인이 필요합니다.",
          onConfirm: () => {
            patchAll({ irrigationOn: true }, "전체 급수 켜기");
            setPending(null);
          },
        });
      } else {
        patchAll({ irrigationOn: false }, "전체 급수 끄기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSkylight = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm({
          title: "전체 천창 열기",
          description: "기상·안전 조건을 확인하세요. 목업 로컬 상태만 바뀝니다.",
          onConfirm: () => {
            patchAll({ skylightOpen: true }, "전체 천창 열기");
            setPending(null);
          },
        });
      } else {
        patchAll({ skylightOpen: false }, "전체 천창 닫기");
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSideWindow = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm({
          title: "전체 측창 열기",
          description: "풍속·강우에 따라 수동 개방이 제한될 수 있습니다. 목업 상태만 갱신됩니다.",
          onConfirm: () => {
            patchAll({ sideWindowOpen: true }, "전체 측창 열기");
            setPending(null);
          },
        });
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
        openConfirm({
          title: "전체 온풍기 켜기",
          description:
            "전 동 온풍기를 켭니다. 연료·과열 위험이 있습니다. 목업 로컬 상태만 변경되며 실제 출력은 없습니다.",
          requireAcknowledgement: true,
          acknowledgementLabel: HEATER_CHECKBOX_LABEL,
          onConfirm: () => {
            patchAll({ hotAirBlowerOn: true }, "전체 온풍기 켜기");
            setPending(null);
          },
        });
      } else {
        openConfirm({
          title: "전체 온풍기 끄기",
          description: "전 동 온풍기를 끕니다. 목업 로컬 상태만 갱신됩니다.",
          onConfirm: () => {
            patchAll({ hotAirBlowerOn: false }, "전체 온풍기 끄기");
            setPending(null);
          },
        });
      }
    },
    [openConfirm, patchAll]
  );

  const onFleetSprayer = useCallback(
    (next: boolean) => {
      if (next) {
        openConfirm({
          title: "전체 분무기 켜기",
          description: "약액·습윤 과다에 주의하세요. 목업 로컬 상태만 변경됩니다.",
          onConfirm: () => {
            patchAll({ sprayerOn: true }, "전체 분무기 켜기");
            setPending(null);
          },
        });
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
          PLC 명령은 확인 후 목업 반영만 됩니다. 양액공급·온풍기는 추가 확인이 필요합니다. 실제 장비 제어는 연동 후 정책에 따릅니다.
        </p>
      </header>

      <NutrientSolutionPanel />

      <DevicesConfirmDialog
        open={pending != null}
        title={pending?.title ?? ""}
        description={pending?.description ?? ""}
        confirmLabel="확인"
        requireAcknowledgement={Boolean(pending?.requireAcknowledgement)}
        acknowledgementLabel={pending?.acknowledgementLabel}
        acknowledged={confirmAck}
        onAcknowledgedChange={setConfirmAck}
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
            <GreenhouseDevicePanel key={row.zoneId} row={row} onModeChange={onModeChange} onActuatorChange={requestActuator} />
          ))}
        </div>
      </div>
    </div>
  );
}
