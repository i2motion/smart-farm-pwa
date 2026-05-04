"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SensorAlarmForm, type SensorAlarmFormValues } from "@/components/greenhouse/sensor-alarm-form";
import { Button } from "@/components/ui/button";
import type { SensorAlarmRule, SensorKind } from "@/lib/greenhouse/types";
import { sensorKindLabel } from "@/lib/greenhouse/mock-data";
import { cn } from "@/lib/utils";

function defaultForm(sensor: SensorKind): SensorAlarmFormValues {
  return {
    alarmName: `${sensorKindLabel(sensor)} 알람`,
    sensorLabel: sensorKindLabel(sensor),
    setValue: 0,
    condition: "above",
    enabled: true,
    notifyIntervalMin: 15,
    dndRange: "22:00-06:00",
    repeatCount: 3,
  };
}

export type SensorAlarmModalProps = {
  open: boolean;
  greenhouseId: string;
  sensor: SensorKind | null;
  rules: SensorAlarmRule[];
  onClose: () => void;
  onSaveRegister: (rule: SensorAlarmRule) => void;
  onSaveEdit: (rule: SensorAlarmRule) => void;
  onDelete: (id: string) => void;
};

export function SensorAlarmModal({
  open,
  greenhouseId,
  sensor,
  rules,
  onClose,
  onSaveRegister,
  onSaveEdit,
  onDelete,
}: SensorAlarmModalProps) {
  const existing = useMemo(() => {
    if (!sensor) return undefined;
    return rules.find((r) => r.greenhouseId === greenhouseId && r.sensorKind === sensor);
  }, [rules, greenhouseId, sensor]);

  const [form, setForm] = useState<SensorAlarmFormValues>(() => defaultForm("temp"));
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !sensor) return;
    if (existing) {
      setEditingId(existing.id);
      setForm({
        alarmName: existing.alarmName,
        sensorLabel: sensorKindLabel(sensor),
        setValue: existing.setValue,
        condition: existing.condition,
        enabled: existing.enabled,
        notifyIntervalMin: existing.notifyIntervalMin,
        dndRange: existing.dndRange,
        repeatCount: existing.repeatCount,
      });
    } else {
      setEditingId(null);
      setForm(defaultForm(sensor));
    }
  }, [open, sensor, existing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  if (sensor == null) return null;

  function toRule(id: string): SensorAlarmRule {
    if (sensor == null) {
      throw new Error("SensorAlarmModal: sensor required when building rule");
    }
    return {
      id,
      greenhouseId,
      sensorKind: sensor,
      alarmName: form.alarmName,
      setValue: form.setValue,
      condition: form.condition,
      enabled: form.enabled,
      notifyIntervalMin: form.notifyIntervalMin,
      dndRange: form.dndRange,
      repeatCount: form.repeatCount,
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sensor-alarm-title"
        className={cn(
          "relative z-[1] mb-0 max-h-[min(92dvh,720px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[oklch(0.24_0.02_264)] p-4 shadow-2xl md:mb-0 md:rounded-2xl md:p-5"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 id="sensor-alarm-title" className="text-[16px] font-semibold tracking-tight text-foreground md:text-lg">
            센서 알람 설정
          </h2>
          <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-full" onClick={onClose} aria-label="취소">
            <X className="size-4 stroke-[1]" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-1 text-[12px]">목업 — API 미연동</p>
        <div className="mt-4">
          <SensorAlarmForm values={form} onChange={setForm} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {editingId ? (
            <>
              <Button type="button" variant="secondary" className="rounded-full text-[12px] font-semibold" onClick={() => onSaveEdit(toRule(editingId))}>
                수정
              </Button>
              <Button type="button" variant="destructive" className="rounded-full text-[12px] font-semibold" onClick={() => onDelete(editingId)}>
                삭제
              </Button>
            </>
          ) : (
            <Button type="button" className="rounded-full text-[12px] font-semibold" onClick={() => onSaveRegister(toRule(crypto.randomUUID()))}>
              등록
            </Button>
          )}
          <Button type="button" variant="ghost" className="rounded-full text-[12px] font-semibold" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
