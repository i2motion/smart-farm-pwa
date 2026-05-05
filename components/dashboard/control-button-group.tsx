"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Beaker,
  Blinds,
  Droplets,
  Fan,
  Flame,
  PanelRightOpen,
  Plus,
  SunMedium,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  scheduleSlot?: ReactNode;
}) {
  return (
    <div className="group/ctrl flex w-full min-w-0 flex-row items-center justify-between gap-2 sm:gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        <div className="flex w-6 shrink-0 justify-center sm:w-7" aria-hidden>
          <Icon className="size-3.5 stroke-[1] text-muted-foreground/80" />
        </div>
        {scheduleSlot ? (
          <div className="flex min-h-7 min-w-0 flex-1 items-center text-muted-foreground">{scheduleSlot}</div>
        ) : (
          <span className="text-foreground/85 flex min-h-7 items-center truncate text-[11px] font-medium tracking-tight sm:text-[12px]">{label}</span>
        )}
      </div>
      <div className="flex shrink-0 justify-end gap-0.5 self-center rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5">
        <Button
          type="button"
          variant={!active ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 min-w-[2.25rem] rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200 sm:min-w-[2.5rem] sm:px-2 sm:text-[11px]",
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
          className={cn(
            "h-7 min-w-[2.25rem] rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200 sm:min-w-[2.5rem] sm:px-2 sm:text-[11px]",
            active && "shadow-sm"
          )}
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
  | "nutrientSupply"
  | "skylight"
  | "sideWindow"
  | "thermalCurtain"
  | "flowFan"
  | "hotAirBlower"
  | "exhaustFan"
  | "sprayer";

const DEFAULT_KEYS: ControlButtonGroupKey[] = ["irrigation", "skylight", "sideWindow"];

const KEY_TO_OPERATION: Record<ControlButtonGroupKey, OperationSchedule["kind"]> = {
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

export type ControlScheduleSlotProps = {
  kind: OperationSchedule["kind"];
  schedules: OperationSchedule[];
  selectedScheduleId: string | null | undefined;
  onSelectScheduleId: (id: string | null) => void;
  onTitleRegister: () => void;
};

function ScheduleSlot({
  label,
  kind,
  schedules,
  selectedScheduleId,
  onSelectScheduleId,
  onTitleRegister,
}: ControlScheduleSlotProps & { label: string }) {
  const rows = schedules.filter((s) => s.kind === kind);

  return (
    <div className="flex w-full min-w-0 flex-row items-stretch gap-1.5 sm:gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        title={`${label} 스케줄 등록`}
        aria-label={`${label} 스케줄 등록`}
        onClick={onTitleRegister}
        className={cn(
          "h-7 min-w-[5rem] max-w-[5.85rem] shrink-0 touch-manipulation gap-0.5 rounded-full border-white/[0.1] bg-white/[0.04] px-2 text-[10px] font-semibold shadow-none sm:min-w-[6.25rem] sm:max-w-[7.1rem] sm:gap-1 sm:px-2.5 sm:text-[11px] sm:justify-center",
          "hover:border-primary/35 hover:bg-primary/[0.1] hover:text-foreground",
          "active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
      >
        <Plus className="size-2.5 shrink-0 stroke-[1.75] opacity-80 sm:size-3" aria-hidden />
        <span className="min-w-0 truncate text-left">{label}</span>
      </Button>
      <select
        value={selectedScheduleId ?? ""}
        onChange={(e) => onSelectScheduleId(e.target.value || null)}
        className={cn(
          "h-7 min-h-7 min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-1 text-[10px] text-foreground outline-none sm:px-1.5 sm:text-[11px]",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
        aria-label={`${label} 등록 스케줄 이름`}
      >
        <option value="">스케줄명 선택</option>
        {rows.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export type ControlScheduleBundle = {
  schedules: OperationSchedule[];
  onSchedulesChange: (next: OperationSchedule[]) => void;
  selectedScheduleIdByKey: Partial<Record<ControlButtonGroupKey, string | null>>;
  onSelectScheduleIdByKey: (key: ControlButtonGroupKey, id: string | null) => void;
  onOpenScheduleRegister: (key: ControlButtonGroupKey) => void;
};

export function ControlButtonGroup({
  irrigationOn,
  nutrientSupplyOn = false,
  skylightOpen,
  sideWindowOpen,
  thermalCurtainOpen = false,
  flowFanOn = false,
  hotAirBlowerOn = false,
  exhaustFanOn = false,
  sprayerOn = false,
  onIrrigationChange,
  onNutrientSupplyChange,
  onSkylightChange,
  onSideWindowChange,
  onThermalCurtainChange,
  onFlowFanChange,
  onHotAirBlowerChange,
  onExhaustFanChange,
  onSprayerChange,
  visible = DEFAULT_KEYS,
  schedule,
  className,
}: {
  irrigationOn: boolean;
  nutrientSupplyOn?: boolean;
  skylightOpen: boolean;
  sideWindowOpen: boolean;
  thermalCurtainOpen?: boolean;
  flowFanOn?: boolean;
  hotAirBlowerOn?: boolean;
  exhaustFanOn?: boolean;
  sprayerOn?: boolean;
  onIrrigationChange: (next: boolean) => void;
  onNutrientSupplyChange?: (next: boolean) => void;
  onSkylightChange: (next: boolean) => void;
  onSideWindowChange: (next: boolean) => void;
  onThermalCurtainChange?: (next: boolean) => void;
  onFlowFanChange?: (next: boolean) => void;
  onHotAirBlowerChange?: (next: boolean) => void;
  onExhaustFanChange?: (next: boolean) => void;
  onSprayerChange?: (next: boolean) => void;
  visible?: readonly ControlButtonGroupKey[];
  schedule?: ControlScheduleBundle;
  className?: string;
}) {
  const show = new Set(visible);

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
      />
    );
  }

  return (
    <div className={cn("space-y-2 sm:space-y-3", className)}>
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
      {show.has("nutrientSupply") && onNutrientSupplyChange ? (
        <ControlPair
          icon={Beaker}
          label="양액공급"
          scheduleSlot={slot("nutrientSupply", "양액공급")}
          active={nutrientSupplyOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onNutrientSupplyChange(true)}
          onInactive={() => onNutrientSupplyChange(false)}
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
          label="측창"
          scheduleSlot={slot("sideWindow", "측창")}
          active={sideWindowOpen}
          activeLabel="열기"
          inactiveLabel="닫기"
          onActive={() => onSideWindowChange(true)}
          onInactive={() => onSideWindowChange(false)}
        />
      ) : null}
      {show.has("thermalCurtain") && onThermalCurtainChange ? (
        <ControlPair
          icon={Blinds}
          label="보온커튼"
          scheduleSlot={slot("thermalCurtain", "보온커튼")}
          active={thermalCurtainOpen}
          activeLabel="열기"
          inactiveLabel="닫기"
          onActive={() => onThermalCurtainChange(true)}
          onInactive={() => onThermalCurtainChange(false)}
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
      {show.has("sprayer") && onSprayerChange ? (
        <ControlPair
          icon={Droplets}
          label="분무기"
          scheduleSlot={slot("sprayer", "분무기")}
          active={sprayerOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onSprayerChange(true)}
          onInactive={() => onSprayerChange(false)}
        />
      ) : null}
    </div>
  );
}
