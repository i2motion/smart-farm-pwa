"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AirVent, Fan, Flame, PanelRightOpen, Plus, SunMedium, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { OperationSchedule } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

function ControlPair({
  icon: Icon,
  label,
  active,
  activeLabel,
  inactiveLabel,
  onActive,
  onInactive,
  scheduleSlot,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  onActive: () => void;
  onInactive: () => void;
  /** 타이틀 옆 스케줄(이름 선택 등) — 온실 상세에서만 전달 */
  scheduleSlot?: ReactNode;
}) {
  return (
    <div className="group/ctrl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:items-center">
        <Icon className="mt-0.5 size-2.5 shrink-0 stroke-[1] text-muted-foreground/80 sm:mt-0" aria-hidden />
        {scheduleSlot ? (
          <div className="min-w-0 flex-1 text-muted-foreground">{scheduleSlot}</div>
        ) : (
          <span className="text-foreground/85 truncate text-[12px] font-medium tracking-tight">{label}</span>
        )}
      </div>
      <div className="flex shrink-0 gap-0.5 self-end rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5 sm:self-center">
        <Button
          type="button"
          variant={!active ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 min-w-[2.5rem] rounded-full px-2 text-[11px] font-medium transition-colors duration-200",
            !active && "bg-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={onInactive}
        >
          {inactiveLabel}
        </Button>
        <Button
          type="button"
          variant={active ? "default" : "ghost"}
          size="sm"
          className={cn("h-7 min-w-[2.5rem] rounded-full px-2 text-[11px] font-medium transition-colors duration-200", active && "shadow-sm")}
          onClick={onActive}
        >
          {activeLabel}
        </Button>
      </div>
    </div>
  );
}

export type ControlButtonGroupKey =
  | "irrigation"
  | "skylight"
  | "sideWindow"
  | "flowFan"
  | "hotAirBlower"
  | "exhaustFan";

const DEFAULT_KEYS: ControlButtonGroupKey[] = ["irrigation", "skylight", "sideWindow"];

const KEY_TO_OPERATION: Record<ControlButtonGroupKey, OperationSchedule["kind"]> = {
  irrigation: "irrigation",
  skylight: "skylight",
  sideWindow: "sideWindow",
  flowFan: "flowFan",
  hotAirBlower: "hotAirBlower",
  exhaustFan: "exhaustFan",
};

export type ControlScheduleSlotProps = {
  kind: OperationSchedule["kind"];
  schedules: OperationSchedule[];
  selectedScheduleId: string | null | undefined;
  onSelectScheduleId: (id: string | null) => void;
  onTitleRegister: () => void;
  onEdit: (id: string) => void;
  onPatchSchedule: (id: string, patch: Partial<OperationSchedule>) => void;
};

function ScheduleSlot({
  label,
  kind,
  schedules,
  selectedScheduleId,
  onSelectScheduleId,
  onTitleRegister,
  onEdit,
  onPatchSchedule,
}: ControlScheduleSlotProps & { label: string }) {
  const rows = schedules.filter((s) => s.kind === kind);
  const sel = selectedScheduleId ? rows.find((r) => r.id === selectedScheduleId) : undefined;

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        title={`${label} 스케줄 등록`}
        aria-label={`${label} 스케줄 등록`}
        onClick={onTitleRegister}
        className={cn(
          "h-7 shrink-0 touch-manipulation gap-1 rounded-full border-white/[0.1] bg-white/[0.04] px-2.5 text-[11px] font-semibold shadow-none",
          "hover:border-primary/35 hover:bg-primary/[0.1] hover:text-foreground",
          "active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        <Plus className="size-3 shrink-0 stroke-[1.75] opacity-80" aria-hidden />
        {label}
      </Button>
      <select
        value={selectedScheduleId ?? ""}
        onChange={(e) => onSelectScheduleId(e.target.value || null)}
        className={cn(
          "h-7 min-w-0 max-w-[min(100%,12rem)] flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-1.5 text-[11px] outline-none",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
        aria-label={`${label} 등록 스케줄 이름`}
      >
        <option value="">이름</option>
        {rows.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      {sel ? (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-[10px]">구동</span>
            <Switch checked={Boolean(sel.driveOn)} onCheckedChange={(c) => onPatchSchedule(sel.id, { driveOn: Boolean(c) })} className="scale-90" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-[10px]">사용</span>
            <Switch checked={Boolean(sel.enabled)} onCheckedChange={(c) => onPatchSchedule(sel.id, { enabled: Boolean(c) })} className="scale-90" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 rounded-full border-white/[0.1] bg-white/[0.04] px-2.5 text-[10px] font-semibold shadow-none hover:border-primary/35 hover:bg-primary/[0.08]"
            onClick={() => onEdit(sel.id)}
          >
            편집
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export type ControlScheduleBundle = {
  schedules: OperationSchedule[];
  onSchedulesChange: (next: OperationSchedule[]) => void;
  selectedScheduleIdByKey: Partial<Record<ControlButtonGroupKey, string | null>>;
  onSelectScheduleIdByKey: (key: ControlButtonGroupKey, id: string | null) => void;
  onOpenScheduleRegister: (key: ControlButtonGroupKey) => void;
  onOpenScheduleEdit: (key: ControlButtonGroupKey, id: string) => void;
};

export function ControlButtonGroup({
  irrigationOn,
  skylightOpen,
  sideWindowOpen,
  flowFanOn = false,
  hotAirBlowerOn = false,
  exhaustFanOn = false,
  onIrrigationChange,
  onSkylightChange,
  onSideWindowChange,
  onFlowFanChange,
  onHotAirBlowerChange,
  onExhaustFanChange,
  visible = DEFAULT_KEYS,
  schedule,
  className,
}: {
  irrigationOn: boolean;
  skylightOpen: boolean;
  sideWindowOpen: boolean;
  flowFanOn?: boolean;
  hotAirBlowerOn?: boolean;
  exhaustFanOn?: boolean;
  onIrrigationChange: (next: boolean) => void;
  onSkylightChange: (next: boolean) => void;
  onSideWindowChange: (next: boolean) => void;
  onFlowFanChange?: (next: boolean) => void;
  onHotAirBlowerChange?: (next: boolean) => void;
  onExhaustFanChange?: (next: boolean) => void;
  visible?: readonly ControlButtonGroupKey[];
  /** 온실 상세: 구분별 스케줄 등록·이름 선택 */
  schedule?: ControlScheduleBundle;
  className?: string;
}) {
  const show = new Set(visible);

  function patchById(id: string, patch: Partial<OperationSchedule>) {
    if (!schedule) return;
    schedule.onSchedulesChange(schedule.schedules.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function slot(key: ControlButtonGroupKey, label: string): ReactNode | undefined {
    if (!schedule) return undefined;
    const kind = KEY_TO_OPERATION[key];
    return (
      <ScheduleSlot
        label={label}
        kind={kind}
        schedules={schedule.schedules}
        selectedScheduleId={schedule.selectedScheduleIdByKey[key]}
        onSelectScheduleId={(id) => schedule.onSelectScheduleIdByKey(key, id)}
        onTitleRegister={() => schedule.onOpenScheduleRegister(key)}
        onEdit={(id) => schedule.onOpenScheduleEdit(key, id)}
        onPatchSchedule={patchById}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {show.has("irrigation") ? (
        <ControlPair
          icon={Waves}
          label="관수"
          scheduleSlot={slot("irrigation", "관수")}
          active={irrigationOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onIrrigationChange(true)}
          onInactive={() => onIrrigationChange(false)}
        />
      ) : null}
      {show.has("skylight") ? (
        <ControlPair
          icon={SunMedium}
          label="천창"
          scheduleSlot={slot("skylight", "천창")}
          active={skylightOpen}
          activeLabel="열기"
          inactiveLabel="닫기"
          onActive={() => onSkylightChange(true)}
          onInactive={() => onSkylightChange(false)}
        />
      ) : null}
      {show.has("sideWindow") ? (
        <ControlPair
          icon={PanelRightOpen}
          label="측면창"
          scheduleSlot={slot("sideWindow", "측면창")}
          active={sideWindowOpen}
          activeLabel="열기"
          inactiveLabel="닫기"
          onActive={() => onSideWindowChange(true)}
          onInactive={() => onSideWindowChange(false)}
        />
      ) : null}
      {show.has("flowFan") && onFlowFanChange ? (
        <ControlPair
          icon={Fan}
          label="유동팬"
          scheduleSlot={slot("flowFan", "유동팬")}
          active={flowFanOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onFlowFanChange(true)}
          onInactive={() => onFlowFanChange(false)}
        />
      ) : null}
      {show.has("hotAirBlower") && onHotAirBlowerChange ? (
        <ControlPair
          icon={Flame}
          label="온풍기"
          scheduleSlot={slot("hotAirBlower", "온풍기")}
          active={hotAirBlowerOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onHotAirBlowerChange(true)}
          onInactive={() => onHotAirBlowerChange(false)}
        />
      ) : null}
      {show.has("exhaustFan") && onExhaustFanChange ? (
        <ControlPair
          icon={AirVent}
          label="배기팬"
          scheduleSlot={slot("exhaustFan", "배기팬")}
          active={exhaustFanOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onExhaustFanChange(true)}
          onInactive={() => onExhaustFanChange(false)}
        />
      ) : null}
    </div>
  );
}
