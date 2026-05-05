"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SensorAlarmForm, type SensorAlarmFormValues } from "@/components/greenhouse/sensor-alarm-form";
import { Button } from "@/components/ui/button";
import type { SensorAlarmRule, SensorKind } from "@/lib/greenhouse/types";
import { sensorKindLabel } from "@/lib/greenhouse/mock-data";
import { cn, randomUuid } from "@/lib/utils";

function defaultForm(sensor: SensorKind): SensorAlarmFormValues {
  return {
    sensorKind: sensor,
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

function ruleToForm(rule: SensorAlarmRule): SensorAlarmFormValues {
  return {
    sensorKind: rule.sensorKind,
    alarmName: rule.alarmName,
    sensorLabel: sensorKindLabel(rule.sensorKind),
    setValue: rule.setValue,
    condition: rule.condition,
    enabled: rule.enabled,
    notifyIntervalMin: rule.notifyIntervalMin,
    dndRange: rule.dndRange,
    repeatCount: rule.repeatCount,
  };
}

export type SensorAlarmModalProps = {
  open: boolean;
  greenhouseId: string;
  rules: SensorAlarmRule[];
  /** 수정 시 규칙 id — 없으면 신규 */
  editingRuleId: string | null;
  /** 신규 시 초기 센서(null이면 폼에서 센서 선택) */
  presetSensorKind: SensorKind | null;
  onClose: () => void;
  onSaveRegister: (rule: SensorAlarmRule) => void;
  onSaveEdit: (rule: SensorAlarmRule) => void;
  onDelete: (id: string) => void;
};

export function SensorAlarmModal({
  open,
  greenhouseId,
  rules,
  editingRuleId,
  presetSensorKind,
  onClose,
  onSaveRegister,
  onSaveEdit,
  onDelete,
}: SensorAlarmModalProps) {
  const [form, setForm] = useState<SensorAlarmFormValues>(() => defaultForm("temp"));
  const [localEditingId, setLocalEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editingRuleId) {
      const rule = rules.find((r) => r.id === editingRuleId);
      if (rule) {
        setLocalEditingId(rule.id);
        setForm(ruleToForm(rule));
        return;
      }
    }
    setLocalEditingId(null);
    const base = presetSensorKind ?? "temp";
    setForm(defaultForm(base));
  }, [open, editingRuleId, presetSensorKind, rules]);

  const registryItems = useMemo(
    () =>
      rules
        .filter((r) => r.greenhouseId === greenhouseId && r.sensorKind === form.sensorKind)
        .map((r) => ({ id: r.id, alarmName: r.alarmName })),
    [rules, greenhouseId, form.sensorKind]
  );

  useEffect(() => {
    if (!open) return;
    if (!localEditingId) return;
    if (!registryItems.some((x) => x.id === localEditingId)) {
      setLocalEditingId(null);
      setForm((f) => defaultForm(f.sensorKind));
    }
  }, [open, registryItems, localEditingId]);

  const handleRegistrySelect = useCallback(
    (id: string | null) => {
      if (!id) {
        setLocalEditingId(null);
        setForm((f) => defaultForm(f.sensorKind));
        return;
      }
      const rule = rules.find((r) => r.id === id && r.greenhouseId === greenhouseId);
      if (rule) {
        setLocalEditingId(rule.id);
        setForm(ruleToForm(rule));
      }
    },
    [rules, greenhouseId]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pickSensor = !localEditingId && presetSensorKind == null;

  function toRule(id: string): SensorAlarmRule {
    const name = form.alarmName.trim();
    return {
      id,
      greenhouseId,
      sensorKind: form.sensorKind,
      alarmName: name || `${sensorKindLabel(form.sensorKind)} 알람`,
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
        <p className="text-muted-foreground mt-1 text-[12px]">
          목업 — API 미연동 · 등록 알람은 상단에서 선택하거나 「새 알람 등록」으로 추가합니다.
        </p>
        <div className="mt-4">
          <SensorAlarmForm
            values={form}
            onChange={setForm}
            pickSensor={pickSensor}
            alarmRegistry={{
              items: registryItems,
              selectedId: localEditingId,
              onSelect: handleRegistrySelect,
            }}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {localEditingId ? (
            <>
              <Button type="button" variant="secondary" className="rounded-full text-[12px] font-semibold" onClick={() => onSaveEdit(toRule(localEditingId))}>
                수정
              </Button>
              <Button type="button" variant="destructive" className="rounded-full text-[12px] font-semibold" onClick={() => onDelete(localEditingId)}>
                삭제
              </Button>
            </>
          ) : (
            <Button type="button" className="rounded-full text-[12px] font-semibold" onClick={() => onSaveRegister(toRule(randomUuid()))}>
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
