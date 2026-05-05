"use client";

import { AlertTriangle, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CameraStillFrame } from "@/components/cameras/camera-still-frame";
import type { ControlButtonGroupKey } from "@/components/dashboard/control-button-group";
import { ControlButtonGroup } from "@/components/dashboard/control-button-group";
import { OperationScheduleModal } from "@/components/greenhouse/operation-schedule-modal";
import { SensorAlarmModal } from "@/components/greenhouse/sensor-alarm-modal";
import { SensorSummary } from "@/components/greenhouse/sensor-summary";
import { TrendChartPanel } from "@/components/greenhouse/trend-chart-panel";
import { Button } from "@/components/ui/button";
import { getGreenhouseCameras, getLatestAlarmForGreenhouse, MOCK_GREENHOUSE_FAN_ACTUATORS } from "@/lib/dashboard/mock-data";
import { getSensorSnapshot } from "@/lib/greenhouse/mock-data";
import type { AlarmSeverity, ControlMode, GreenhouseZone } from "@/lib/dashboard/types";
import type { OperationKind, OperationSchedule, SensorAlarmRule, SensorKind } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

function keyToOperationKind(key: ControlButtonGroupKey): OperationKind {
  const m: Record<ControlButtonGroupKey, OperationKind> = {
    irrigation: "irrigation",
    nutrientSupply: "nutrientSupply",
    skylight: "skylight",
    sideWindow: "sideWindow",
    thermalCurtain: "thermalCurtain",
    flowFan: "flowFan",
    hotAirBlower: "hotAirBlower",
    exhaustFan: "exhaustFan",
    sprayer: "sprayer",
  };
  return m[key];
}

function ModePill({ mode }: { mode: ControlMode }) {
  const auto = mode === "AUTO";
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide md:px-3 md:py-1 md:text-[12px]",
        auto ? "border-primary/30 bg-primary/[0.12] text-primary" : "border-white/[0.1] bg-white/[0.05] text-muted-foreground"
      )}
    >
      {auto ? "AUTO" : "MANUAL"}
    </span>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ControlMode;
  onChange: (m: ControlMode) => void;
}) {
  return (
    <div className="flex gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-sm">
      <Button
        type="button"
        variant={mode === "AUTO" ? "default" : "ghost"}
        size="sm"
        className={cn("h-8 flex-1 rounded-full text-[12px] font-medium md:h-9", mode === "AUTO" && "shadow-sm")}
        onClick={() => onChange("AUTO")}
      >
        자동
      </Button>
      <Button
        type="button"
        variant={mode === "MANUAL" ? "default" : "ghost"}
        size="sm"
        className={cn("h-8 flex-1 rounded-full text-[12px] font-medium md:h-9", mode === "MANUAL" && "shadow-sm")}
        onClick={() => onChange("MANUAL")}
      >
        수동
      </Button>
    </div>
  );
}

function alarmTone(severity: AlarmSeverity) {
  if (severity === "error") return "border-rose-400/30 bg-rose-500/[0.12] text-rose-50";
  if (severity === "warning") return "border-amber-400/30 bg-amber-500/[0.1] text-amber-50";
  return "border-white/[0.08] bg-white/[0.05] text-foreground/90";
}

export type GreenhouseDetailShellProps = {
  zone: GreenhouseZone;
};

export function GreenhouseDetailShell({ zone }: GreenhouseDetailShellProps) {
  const snapshot = useMemo(() => getSensorSnapshot(zone), [zone]);
  const cam = useMemo(() => getGreenhouseCameras(zone)[0]!, [zone]);

  const [mode, setMode] = useState<ControlMode>(zone.mode);
  const [irrigationOn, setIrrigationOn] = useState(zone.irrigationRunning);
  const [nutrientSupplyOn, setNutrientSupplyOn] = useState(zone.nutrientSupplyRunning);
  const [skylightOpen, setSkylightOpen] = useState(zone.skylightOpen);
  const [sideWindowOpen, setSideWindowOpen] = useState(zone.sideWindowOpen);
  const [thermalCurtainOpen, setThermalCurtainOpen] = useState(zone.thermalCurtainOpen);
  const initialFans =
    MOCK_GREENHOUSE_FAN_ACTUATORS[zone.id] ?? { flowFan: false, hotAirBlower: false, exhaustFan: false, sprayer: false };
  const [flowFanOn, setFlowFanOn] = useState(initialFans.flowFan);
  const [hotAirBlowerOn, setHotAirBlowerOn] = useState(initialFans.hotAirBlower);
  const [exhaustFanOn, setExhaustFanOn] = useState(initialFans.exhaustFan);
  const [sprayerOn, setSprayerOn] = useState(initialFans.sprayer);

  const [sensorAlarms, setSensorAlarms] = useState<SensorAlarmRule[]>([]);
  const [schedules, setSchedules] = useState<OperationSchedule[]>([]);
  const [schedulePick, setSchedulePick] = useState<Partial<Record<ControlButtonGroupKey, string | null>>>({});
  const [scheduleDialog, setScheduleDialog] = useState<{ kind: OperationKind; editId?: string } | null>(null);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [alarmEditingRuleId, setAlarmEditingRuleId] = useState<string | null>(null);
  const [alarmPresetSensor, setAlarmPresetSensor] = useState<SensorKind | null>(null);

  useEffect(() => {
    setSchedulePick((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const k of Object.keys(next) as ControlButtonGroupKey[]) {
        const id = next[k];
        if (id && !schedules.some((s) => s.id === id)) {
          delete next[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [schedules]);

  const zoneAlarm = getLatestAlarmForGreenhouse(zone.name);

  const actuators = {
    irrigationOn,
    nutrientSupplyOn,
    skylightOpen,
    sideWindowOpen,
    thermalCurtainOpen,
    flowFanOn,
    hotAirBlowerOn,
    exhaustFanOn,
    sprayerOn,
    onIrrigationChange: setIrrigationOn,
    onNutrientSupplyChange: setNutrientSupplyOn,
    onSkylightChange: setSkylightOpen,
    onSideWindowChange: setSideWindowOpen,
    onThermalCurtainChange: setThermalCurtainOpen,
    onFlowFanChange: setFlowFanOn,
    onHotAirBlowerChange: setHotAirBlowerOn,
    onExhaustFanChange: setExhaustFanOn,
    onSprayerChange: setSprayerOn,
  };

  const controlVisible: ControlButtonGroupKey[] =
    zone.id === "gh-05"
      ? [
          "irrigation",
          "nutrientSupply",
          "skylight",
          "sideWindow",
          "thermalCurtain",
          "flowFan",
          "hotAirBlower",
          "exhaustFan",
          "sprayer",
        ]
      : ["irrigation", "nutrientSupply", "skylight", "sideWindow", "flowFan", "hotAirBlower", "exhaustFan", "sprayer"];

  return (
    <div className="mx-auto w-full max-w-[min(100%,960px)] space-y-5 pb-16 md:space-y-7 md:pb-20">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border border-transparent px-1 py-0.5 text-[12px] font-medium transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
        >
          <ArrowLeft className="size-3.5 stroke-[1]" aria-hidden />
          대시보드
        </Link>
      </div>

      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground md:text-3xl">{zone.name}</h1>
            <p className="text-[15px] leading-snug text-muted-foreground md:text-[16px]">{zone.crop}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <ModePill mode={mode} />
          </div>
        </div>
      </header>

      <section aria-labelledby="gh-camera-heading" className="space-y-2">
        <div className="flex items-end justify-between gap-2">
          <h2 id="gh-camera-heading" className="sf-section-label">
            카메라
          </h2>
          <Link href="/cameras" className="text-primary/90 hover:text-primary text-[12px] font-semibold transition-colors">
            전체 보기 →
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.08] md:rounded-3xl">
          <div className="relative aspect-[16/10] w-full bg-black md:aspect-video">
            <Link href="/cameras" className="absolute inset-0 z-0 block bg-black" aria-label="카메라 페이지로 이동">
              <CameraStillFrame imageUrl={cam.imageUrl} priority />
            </Link>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/35 to-transparent" aria-hidden />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] px-3 pb-3 pt-10 md:px-5 md:pb-4 md:pt-14">
              <p className="mt-0.5 truncate text-[16px] font-semibold tracking-tight text-white/95 md:text-lg">{cam.name}</p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed md:text-[12px]">목업 정지 화면입니다. 미리보기를 누르면 카메라 목록으로 이동합니다.</p>
      </section>

      <SensorSummary
        snapshot={snapshot}
        onOpenAlarm={(kind) => {
          setAlarmEditingRuleId(null);
          setAlarmPresetSensor(kind);
          setAlarmOpen(true);
        }}
      />

      <section aria-labelledby="gh-controls-heading" className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-md sm:p-4 md:rounded-3xl md:p-5">
        <h2 id="gh-controls-heading" className="sf-section-label mb-2 sm:mb-3">
          구동 제어
        </h2>
        <p className="text-muted-foreground mb-2 text-[11px] leading-relaxed sm:mb-3 md:text-[12px]">목업 토글 및 스케줄 — 실제 PLC·MQTT 미연결</p>
        <div className="mb-3 max-w-md sm:mb-4">
          <p className="text-muted-foreground mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] sm:mb-2">운전 모드</p>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <ControlButtonGroup
          {...actuators}
          visible={controlVisible}
          className="w-full max-w-xl"
          schedule={{
            schedules,
            onSchedulesChange: setSchedules,
            selectedScheduleIdByKey: schedulePick,
            onSelectScheduleIdByKey: (key, id) => setSchedulePick((p) => ({ ...p, [key]: id })),
            onOpenScheduleRegister: (key) => setScheduleDialog({ kind: keyToOperationKind(key) }),
          }}
        />
      </section>

      <section aria-labelledby="gh-alarm-heading" className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-md md:rounded-3xl md:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="gh-alarm-heading" className="sf-section-label mb-0">
            시설 알람
          </h2>
          <Link href="/alarms" className="text-primary/90 hover:text-primary shrink-0 text-[12px] font-semibold transition-colors">
            알람 페이지 →
          </Link>
        </div>
        {zoneAlarm ? (
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-2xl border px-3 py-3 md:gap-3 md:rounded-3xl md:px-4 md:py-3.5",
              alarmTone(zoneAlarm.severity)
            )}
          >
            {zoneAlarm.severity === "info" ? (
              <Info className="mt-0.5 size-4 shrink-0 opacity-90" aria-hidden />
            ) : (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 opacity-90" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold tracking-tight md:text-[13px]">
                <span className="text-current/90">{zoneAlarm.alarmType}</span>
                <span className="text-current/45"> · </span>
                <span className="font-medium text-current/85">{zoneAlarm.message}</span>
              </p>
              <time className="mt-1 block text-[11px] font-semibold tabular-nums text-current/50" dateTime={zoneAlarm.time}>
                {zoneAlarm.time}
              </time>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            이 온실과 직접 매칭된 최근 알람이 없습니다. 전체 알람은 알람 페이지에서 확인하세요.
          </p>
        )}
      </section>

      <TrendChartPanel snapshot={snapshot} />

      <OperationScheduleModal
        open={scheduleDialog != null}
        kind={scheduleDialog?.kind ?? null}
        initialEditId={scheduleDialog?.editId ?? null}
        greenhouseId={zone.id}
        schedules={schedules}
        onClose={() => setScheduleDialog(null)}
        onSaveRegister={(row) => {
          setSchedules((prev) => [...prev, row]);
          setScheduleDialog(null);
          const k = row.kind as ControlButtonGroupKey;
          setSchedulePick((p) => ({ ...p, [k]: row.id }));
        }}
        onSaveEdit={(row) => {
          setSchedules((prev) => prev.map((s) => (s.id === row.id ? row : s)));
          setScheduleDialog(null);
        }}
        onDelete={(id) => {
          setSchedules((prev) => prev.filter((s) => s.id !== id));
          setScheduleDialog(null);
          setSchedulePick((p) => {
            const next = { ...p };
            for (const key of Object.keys(next) as ControlButtonGroupKey[]) {
              if (next[key] === id) delete next[key];
            }
            return next;
          });
        }}
      />

      <SensorAlarmModal
        open={alarmOpen}
        greenhouseId={zone.id}
        rules={sensorAlarms}
        editingRuleId={alarmEditingRuleId}
        presetSensorKind={alarmPresetSensor}
        onClose={() => {
          setAlarmOpen(false);
          setAlarmEditingRuleId(null);
          setAlarmPresetSensor(null);
        }}
        onSaveRegister={(rule) => {
          setSensorAlarms((prev) => [...prev, rule]);
          setAlarmOpen(false);
          setAlarmEditingRuleId(null);
          setAlarmPresetSensor(null);
        }}
        onSaveEdit={(rule) => {
          setSensorAlarms((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
          setAlarmOpen(false);
          setAlarmEditingRuleId(null);
          setAlarmPresetSensor(null);
        }}
        onDelete={(id) => {
          setSensorAlarms((prev) => prev.filter((r) => r.id !== id));
          setAlarmOpen(false);
          setAlarmEditingRuleId(null);
          setAlarmPresetSensor(null);
        }}
      />
    </div>
  );
}
