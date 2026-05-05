"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type OperationScheduleFormValues = {
  name: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  repeat: string;
};

export function defaultScheduleForm(displayKind: string): OperationScheduleFormValues {
  return {
    name: `${displayKind} 스케줄`,
    startTime: "06:00",
    endTime: "06:30",
    durationMin: 30,
    repeat: "매일",
  };
}

type OperationScheduleFormProps = {
  values: OperationScheduleFormValues;
  onChange: (next: OperationScheduleFormValues) => void;
  kindLabel: string;
  disabled?: boolean;
};

export function OperationScheduleForm({ values, onChange, kindLabel, disabled }: OperationScheduleFormProps) {
  function patch<K extends keyof OperationScheduleFormValues>(key: K, v: OperationScheduleFormValues[K]) {
    onChange({ ...values, [key]: v });
  }

  return (
    <div className="space-y-3.5 md:space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sched-name" className="text-[11px] text-muted-foreground md:text-xs">
          스케줄명
        </Label>
        <Input
          id="sched-name"
          value={values.name}
          disabled={disabled}
          onChange={(e) => patch("name", e.target.value)}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground md:text-xs">구분</Label>
        <Input readOnly value={kindLabel} className="h-9 border-white/[0.06] bg-white/[0.02] text-[13px] text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sched-start" className="text-[11px] text-muted-foreground md:text-xs">
            시작 시간
          </Label>
          <Input
            id="sched-start"
            type="time"
            value={values.startTime}
            disabled={disabled}
            onChange={(e) => patch("startTime", e.target.value)}
            className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sched-end" className="text-[11px] text-muted-foreground md:text-xs">
            종료 시간
          </Label>
          <Input
            id="sched-end"
            type="time"
            value={values.endTime}
            disabled={disabled}
            onChange={(e) => patch("endTime", e.target.value)}
            className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sched-dur" className="text-[11px] text-muted-foreground md:text-xs">
            작동 시간 (분)
          </Label>
          <Input
            id="sched-dur"
            type="number"
            min={1}
            value={values.durationMin}
            disabled={disabled}
            onChange={(e) => patch("durationMin", Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sched-repeat" className="text-[11px] text-muted-foreground md:text-xs">
            반복
          </Label>
          <select
            id="sched-repeat"
            disabled={disabled}
            value={values.repeat}
            onChange={(e) => patch("repeat", e.target.value)}
            className={cn(
              "h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 text-[13px] outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            )}
          >
            <option>매일</option>
            <option>주중</option>
            <option>사용자</option>
          </select>
        </div>
      </div>
    </div>
  );
}
