"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AlarmCondition, SensorAlarmRule } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

export type SensorAlarmFormValues = Omit<SensorAlarmRule, "id" | "greenhouseId" | "sensorKind"> & {
  sensorLabel: string;
};

type SensorAlarmFormProps = {
  values: SensorAlarmFormValues;
  onChange: (next: SensorAlarmFormValues) => void;
  disabled?: boolean;
};

const conditionOptions: { value: AlarmCondition; label: string }[] = [
  { value: "above", label: "이상" },
  { value: "below", label: "이하" },
  { value: "equalOrBelow", label: "같거나 이하" },
];

export function SensorAlarmForm({ values, onChange, disabled }: SensorAlarmFormProps) {
  function patch<K extends keyof SensorAlarmFormValues>(key: K, v: SensorAlarmFormValues[K]) {
    onChange({ ...values, [key]: v });
  }

  return (
    <div className="space-y-3.5 md:space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="alarm-name" className="text-[11px] text-muted-foreground md:text-xs">
          알람명
        </Label>
        <Input
          id="alarm-name"
          value={values.alarmName}
          disabled={disabled}
          onChange={(e) => patch("alarmName", e.target.value)}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground md:text-xs">센서</Label>
        <Input readOnly value={values.sensorLabel} className="h-9 border-white/[0.06] bg-white/[0.02] text-[13px] text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="set-value" className="text-[11px] text-muted-foreground md:text-xs">
          설정값
        </Label>
        <Input
          id="set-value"
          type="number"
          step="any"
          value={Number.isFinite(values.setValue) ? String(values.setValue) : ""}
          disabled={disabled}
          onChange={(e) => patch("setValue", parseFloat(e.target.value) || 0)}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="condition" className="text-[11px] text-muted-foreground md:text-xs">
          조건
        </Label>
        <select
          id="condition"
          disabled={disabled}
          value={values.condition}
          onChange={(e) => patch("condition", e.target.value as AlarmCondition)}
          className={cn(
            "h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 text-[13px] outline-none",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          )}
        >
          {conditionOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div>
          <p className="text-[12px] font-medium text-foreground">알람 사용</p>
          <p className="text-muted-foreground text-[10px]">목업 토글</p>
        </div>
        <Switch checked={values.enabled} onCheckedChange={(c) => patch("enabled", Boolean(c))} disabled={disabled} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="interval" className="text-[11px] text-muted-foreground md:text-xs">
          알림 주기 (분)
        </Label>
        <Input
          id="interval"
          type="number"
          min={1}
          value={values.notifyIntervalMin}
          disabled={disabled}
          onChange={(e) => patch("notifyIntervalMin", Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dnd" className="text-[11px] text-muted-foreground md:text-xs">
          방해금지 시간
        </Label>
        <Input
          id="dnd"
          placeholder="22:00-06:00"
          value={values.dndRange}
          disabled={disabled}
          onChange={(e) => patch("dndRange", e.target.value)}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="repeat" className="text-[11px] text-muted-foreground md:text-xs">
          반복 횟수
        </Label>
        <Input
          id="repeat"
          type="number"
          min={0}
          value={values.repeatCount}
          disabled={disabled}
          onChange={(e) => patch("repeatCount", Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="h-9 border-white/[0.08] bg-white/[0.04] text-[13px]"
        />
      </div>
    </div>
  );
}
