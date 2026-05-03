"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { ControlMode } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export type GreenhouseModeToggleProps = {
  /** Stable id for future API routes (`PATCH /api/greenhouses/:id/mode`). */
  greenhouseId: string;
  /** Display mode from PLC / supervisory layer (mock for now). */
  mode: ControlMode;
  /** When true, UI is visible but interaction is blocked until backend wiring exists. */
  disabled?: boolean;
  /** Future hook: persist mode via gateway — signature kept stable for drop-in integration. */
  onModeChange?: (next: ControlMode) => void | Promise<void>;
  /** Dense layout for greenhouse tiles / grid views. */
  compact?: boolean;
  className?: string;
};

/**
 * AUTO/MANUAL presentation + toggle scaffold.
 * Toggle is disabled by default; enable when `onModeChange` + gateway auth are ready.
 */
export function GreenhouseModeToggle({
  greenhouseId,
  mode,
  disabled = true,
  onModeChange,
  compact = false,
  className,
}: GreenhouseModeToggleProps) {
  const isAuto = mode === "AUTO";

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30",
        compact ? "px-2 py-1.5" : "px-3 py-2",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {!compact ? (
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
            Mode
          </span>
        ) : null}
        <Badge
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0 font-mono text-[9px] font-semibold uppercase tracking-wide",
            isAuto
              ? "border-emerald-600/30 bg-emerald-600/90 text-emerald-50 dark:bg-emerald-600"
              : "border-amber-600/25 bg-amber-500/12 text-amber-950 dark:bg-amber-400/12 dark:text-amber-50"
          )}
          variant="outline"
        >
          {mode}
        </Badge>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!compact ? (
          <span className="text-muted-foreground font-mono text-[10px] uppercase">
            Man
          </span>
        ) : null}
        <Switch
          size="sm"
          checked={isAuto}
          disabled={disabled}
          onCheckedChange={(checked) =>
            onModeChange?.(checked ? "AUTO" : "MANUAL")
          }
          aria-label={`Greenhouse ${greenhouseId} auto/manual`}
          data-greenhouse-id={greenhouseId}
          data-mode={mode}
        />
        {!compact ? (
          <span className="text-muted-foreground font-mono text-[10px] uppercase">
            Auto
          </span>
        ) : null}
      </div>
    </div>
  );
}
