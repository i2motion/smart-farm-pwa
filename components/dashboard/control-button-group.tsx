"use client";

import type { LucideIcon } from "lucide-react";
import { Fan, PanelRightOpen, SunMedium, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ControlPair({
  icon: Icon,
  label,
  active,
  activeLabel,
  inactiveLabel,
  onActive,
  onInactive,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  onActive: () => void;
  onInactive: () => void;
}) {
  return (
    <div className="group/ctrl flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <Icon className="size-2.5 shrink-0 stroke-[1] text-muted-foreground/80" aria-hidden />
        <span className="text-foreground/85 truncate text-[12px] font-medium tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex shrink-0 gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5">
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
          className={cn(
            "h-7 min-w-[2.5rem] rounded-full px-2 text-[11px] font-medium transition-colors duration-200",
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

export type ControlButtonGroupKey = "irrigation" | "skylight" | "sideWindow" | "fan";

const DEFAULT_KEYS: ControlButtonGroupKey[] = ["irrigation", "skylight", "sideWindow"];

export function ControlButtonGroup({
  irrigationOn,
  skylightOpen,
  sideWindowOpen,
  fanOn = false,
  onIrrigationChange,
  onSkylightChange,
  onSideWindowChange,
  onFanChange,
  visible = DEFAULT_KEYS,
  className,
}: {
  irrigationOn: boolean;
  skylightOpen: boolean;
  sideWindowOpen: boolean;
  fanOn?: boolean;
  onIrrigationChange: (next: boolean) => void;
  onSkylightChange: (next: boolean) => void;
  onSideWindowChange: (next: boolean) => void;
  onFanChange?: (next: boolean) => void;
  /** Subset for pages that split actuators into separate cards */
  visible?: readonly ControlButtonGroupKey[];
  className?: string;
}) {
  const show = new Set(visible);

  return (
    <div className={cn("space-y-2", className)}>
      {show.has("irrigation") ? (
      <ControlPair
        icon={Waves}
        label="관수"
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
        active={sideWindowOpen}
        activeLabel="열기"
        inactiveLabel="닫기"
        onActive={() => onSideWindowChange(true)}
        onInactive={() => onSideWindowChange(false)}
      />
      ) : null}
      {show.has("fan") && onFanChange ? (
        <ControlPair
          icon={Fan}
          label="환기 팬"
          active={fanOn}
          activeLabel="켜기"
          inactiveLabel="끄기"
          onActive={() => onFanChange(true)}
          onInactive={() => onFanChange(false)}
        />
      ) : null}
    </div>
  );
}
