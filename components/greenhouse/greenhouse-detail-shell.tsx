"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { CameraStillFrame } from "@/components/cameras/camera-still-frame";
import { ControlButtonGroup } from "@/components/dashboard/control-button-group";
import { OperationSchedulePanel } from "@/components/greenhouse/operation-schedule-panel";
import { SensorAlarmModal } from "@/components/greenhouse/sensor-alarm-modal";
import { SensorSummary } from "@/components/greenhouse/sensor-summary";
import { TrendChartPanel } from "@/components/greenhouse/trend-chart-panel";
import { Button } from "@/components/ui/button";
import { getGreenhouseCameras, getLatestAlarmForGreenhouse, MOCK_GREENHOUSE_FAN_ON } from "@/lib/dashboard/mock-data";
import { getGreenhouseEdgeOnline, getSensorSnapshot } from "@/lib/greenhouse/mock-data";
import type { AlarmSeverity, ControlMode, GreenhouseZone } from "@/lib/dashboard/types";
import type { OperationSchedule, SensorAlarmRule, SensorKind } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

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

function EdgeStatusPill({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tabular-nums md:px-3 md:py-1 md:text-[12px]",
        online ? "border-emerald-400/25 bg-emerald-500/[0.1] text-emerald-100/95" : "border-white/[0.08] bg-white/[0.04] text-muted-foreground"
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", online ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]" : "bg-muted-foreground/50")}
        aria-hidden
      />
      {online ? "온라인" : "오프라인"}
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
  const edgeOnline = getGreenhouseEdgeOnline(zone.id);
  const cameras = useMemo(() => getGreenhouseCameras(zone), [zone]);
  const [camIndex, setCamIndex] = useState(0);
  const cam = cameras[camIndex] ?? cameras[0]!;

  const prevCam = useCallback(() => {
    setCamIndex((i) => (i - 1 + cameras.length) % cameras.length);
  }, [cameras.length]);

  const nextCam = useCallback(() => {
    setCamIndex((i) => (i + 1) % cameras.length);
  }, [cameras.length]);

  const [mode, setMode] = useState<ControlMode>(zone.mode);
  const [irrigationOn, setIrrigationOn] = useState(zone.irrigationRunning);
  const [skylightOpen, setSkylightOpen] = useState(zone.skylightOpen);
  const [sideWindowOpen, setSideWindowOpen] = useState(zone.sideWindowOpen);
  const [fanOn, setFanOn] = useState(MOCK_GREENHOUSE_FAN_ON[zone.id] ?? false);

  const [sensorAlarms, setSensorAlarms] = useState<SensorAlarmRule[]>([]);
  const [schedules, setSchedules] = useState<OperationSchedule[]>([]);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [alarmSensor, setAlarmSensor] = useState<SensorKind | null>(null);

  const zoneAlarm = getLatestAlarmForGreenhouse(zone.name);

  const actuators = {
    irrigationOn,
    skylightOpen,
    sideWindowOpen,
    fanOn,
    onIrrigationChange: setIrrigationOn,
    onSkylightChange: setSkylightOpen,
    onSideWindowChange: setSideWindowOpen,
    onFanChange: setFanOn,
  };

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
            <EdgeStatusPill online={edgeOnline} />
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45 md:text-[11px]">
                {camIndex + 1} / {cameras.length}
              </p>
              <p className="mt-0.5 truncate text-[16px] font-semibold tracking-tight text-white/95 md:text-lg">{cam.name}</p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[3] flex -translate-y-1/2 justify-between px-2 md:px-3">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="pointer-events-auto size-9 rounded-full border border-white/[0.12] bg-black/55 text-white shadow-lg backdrop-blur-md hover:bg-black/70 md:size-10"
              aria-label="이전 카메라"
              onClick={(e) => {
                e.preventDefault();
                prevCam();
              }}
            >
              <ChevronLeft className="size-4 stroke-[1.5]" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="pointer-events-auto size-9 rounded-full border border-white/[0.12] bg-black/55 text-white shadow-lg backdrop-blur-md hover:bg-black/70 md:size-10"
              aria-label="다음 카메라"
              onClick={(e) => {
                e.preventDefault();
                nextCam();
              }}
            >
              <ChevronRight className="size-4 stroke-[1.5]" aria-hidden />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed md:text-[12px]">목업 정지 화면입니다. 미리보기를 누르면 카메라 목록으로 이동합니다.</p>
      </section>

      <SensorSummary
        snapshot={snapshot}
        onOpenAlarm={(kind) => {
          setAlarmSensor(kind);
          setAlarmOpen(true);
        }}
      />

      <section aria-labelledby="gh-controls-heading" className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-md md:rounded-3xl md:p-5">
        <h2 id="gh-controls-heading" className="sf-section-label mb-4">
          구동 제어
        </h2>
        <p className="text-muted-foreground mb-4 text-[11px] leading-relaxed md:text-[12px]">목업 토글 — 실제 PLC·MQTT 미연결</p>
        <div className="mb-5 max-w-md">
          <p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase tracking-[0.08em]">운전 모드</p>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <ControlButtonGroup {...actuators} visible={["irrigation", "skylight", "sideWindow", "fan"]} className="max-w-xl" />
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

      <OperationSchedulePanel greenhouseId={zone.id} schedules={schedules} onChange={setSchedules} />

      <SensorAlarmModal
        open={alarmOpen}
        greenhouseId={zone.id}
        sensor={alarmSensor}
        rules={sensorAlarms}
        onClose={() => {
          setAlarmOpen(false);
          setAlarmSensor(null);
        }}
        onSaveRegister={(rule) => {
          setSensorAlarms((prev) => [...prev.filter((r) => !(r.greenhouseId === rule.greenhouseId && r.sensorKind === rule.sensorKind)), rule]);
          setAlarmOpen(false);
          setAlarmSensor(null);
        }}
        onSaveEdit={(rule) => {
          setSensorAlarms((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
          setAlarmOpen(false);
          setAlarmSensor(null);
        }}
        onDelete={(id) => {
          setSensorAlarms((prev) => prev.filter((r) => r.id !== id));
          setAlarmOpen(false);
          setAlarmSensor(null);
        }}
      />
    </div>
  );
}
