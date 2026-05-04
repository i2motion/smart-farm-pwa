"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DeviceControlVariant = "onoff" | "openclose";

export type DeviceControlButtonProps = {
  variant: DeviceControlVariant;
  active: boolean;
  onActive: () => void;
  onInactive: () => void;
  /** When greenhouse is AUTO — controls stay usable but show caution chrome */
  cautionInAuto?: boolean;
  className?: string;
};

const labels = {
  onoff: { active: "켜기", inactive: "끄기" },
  openclose: { active: "열기", inactive: "닫기" },
} as const;

export function DeviceControlButton({
  variant,
  active,
  onActive,
  onInactive,
  cautionInAuto,
  className,
}: DeviceControlButtonProps) {
  const L = labels[variant];
  return (
    <div
      className={cn(
        "flex shrink-0 gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.04] p-0.5",
        cautionInAuto && "ring-1 ring-amber-400/35 ring-offset-0 ring-offset-transparent",
        className
      )}
    >
      <Button
        type="button"
        variant={!active ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "h-7 min-w-[2.25rem] rounded-full px-2 text-[10px] font-semibold",
          !active && "bg-transparent text-muted-foreground hover:text-foreground"
        )}
        onClick={onInactive}
      >
        {L.inactive}
      </Button>
      <Button
        type="button"
        variant={active ? "default" : "ghost"}
        size="sm"
        className={cn("h-7 min-w-[2.25rem] rounded-full px-2 text-[10px] font-semibold", active && "shadow-sm")}
        onClick={onActive}
      >
        {L.active}
      </Button>
    </div>
  );
}
