"use client";

import { Bot, Hand } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ControlMode } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export type ModeSelectorProps = {
  mode: ControlMode;
  /** 동일하지 않은 모드가 섞여 있을 때 — 두 버튼 모두 비강조 */
  mixed?: boolean;
  onChange: (next: ControlMode) => void;
  className?: string;
};

export function ModeSelector({ mode, mixed, onChange, className }: ModeSelectorProps) {
  const autoOn = !mixed && mode === "AUTO";
  const manualOn = !mixed && mode === "MANUAL";
  return (
    <div className={cn("flex gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] p-0.5", className)}>
      <Button
        type="button"
        variant={autoOn ? "default" : "ghost"}
        size="sm"
        className={cn(
          "h-7 flex-1 gap-1 rounded-full px-2.5 text-[11px] font-semibold",
          autoOn && "shadow-sm shadow-primary/25"
        )}
        onClick={() => onChange("AUTO")}
      >
        <Bot className="size-3 stroke-[1.5]" aria-hidden />
        자동
      </Button>
      <Button
        type="button"
        variant={manualOn ? "default" : "ghost"}
        size="sm"
        className={cn("h-7 flex-1 gap-1 rounded-full px-2.5 text-[11px] font-semibold", manualOn && "shadow-sm")}
        onClick={() => onChange("MANUAL")}
      >
        <Hand className="size-3 stroke-[1.5]" aria-hidden />
        수동
      </Button>
    </div>
  );
}
