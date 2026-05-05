"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FarmDiaryPhotoPicker } from "@/components/work/farm-diary-photo-picker";
import {
  DIARY_IMPORTANCE_LABELS,
  MOCK_DIARY_EQUIPMENT_OPTIONS,
  MOCK_DIARY_SENSOR_OPTIONS,
  WORK_TYPE_LABELS,
} from "@/lib/work/mock-data";
import type { DiaryImportance, FarmDiaryEntry, FarmDiaryPhotoAttachment, WorkType } from "@/lib/work/types";
import { cn } from "@/lib/utils";

const inputAreaClass =
  "min-h-[88px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30 md:text-sm";

export type GreenhouseOption = { id: string; name: string; crop: string };

export type FarmDiaryFormProps = {
  greenhouseOptions: GreenhouseOption[];
  cropOptions: string[];
  onSubmit: (payload: Omit<FarmDiaryEntry, "id" | "createdAt">) => void;
  className?: string;
};

export function FarmDiaryForm({ greenhouseOptions, cropOptions, onSubmit, className }: FarmDiaryFormProps) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("09:00");
  const [greenhouseId, setGreenhouseId] = useState(greenhouseOptions[0]?.id ?? "");
  const [crop, setCrop] = useState(() => greenhouseOptions[0]?.crop ?? cropOptions[0] ?? "");
  const [workType, setWorkType] = useState<WorkType>("irrigation");
  const [description, setDescription] = useState("");
  const [operator, setOperator] = useState("");
  const [importance, setImportance] = useState<DiaryImportance>("normal");
  const [aiAnalysisTarget, setAiAnalysisTarget] = useState(true);
  const [sensorIds, setSensorIds] = useState<string[]>([]);
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<FarmDiaryPhotoAttachment[]>([]);

  const selectedGh = useMemo(
    () => greenhouseOptions.find((g) => g.id === greenhouseId),
    [greenhouseOptions, greenhouseId]
  );

  function toggleId(list: string[], id: string, set: (next: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!greenhouseId || !selectedGh) return;
    const relatedSensorLabels = MOCK_DIARY_SENSOR_OPTIONS.filter((s) => sensorIds.includes(s.id)).map((s) => s.label);
    const relatedEquipmentLabels = MOCK_DIARY_EQUIPMENT_OPTIONS.filter((eq) => equipmentIds.includes(eq.id)).map(
      (eq) => eq.label
    );
    onSubmit({
      date,
      time,
      greenhouseId,
      greenhouseName: selectedGh.name,
      crop,
      workType,
      description: description.trim(),
      operator: operator.trim() || "—",
      photos: [...pendingPhotos],
      relatedSensorIds: sensorIds,
      relatedSensorLabels,
      relatedEquipmentIds: equipmentIds,
      relatedEquipmentLabels,
      importance,
      aiAnalysisTarget,
    });
    setDescription("");
    setOperator("");
    setSensorIds([]);
    setEquipmentIds([]);
    setPendingPhotos([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "sf-surface space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md md:p-5",
        className
      )}
    >
      <div>
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">농사일지 입력</h3>
        <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed md:text-[12px]">
          구조화된 기록 → 향후 AI 분석·제안 명령의 입력 레이어입니다. 지금은 목업만 저장됩니다.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="fd-date">날짜</FieldLabel>
          <Input id="fd-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="fd-time">시간</FieldLabel>
          <Input id="fd-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="fd-gh">온실 선택</FieldLabel>
        <select
          id="fd-gh"
          value={greenhouseId}
          onChange={(e) => {
            const id = e.target.value;
            setGreenhouseId(id);
            const g = greenhouseOptions.find((x) => x.id === id);
            if (g) setCrop(g.crop);
          }}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30"
          required
        >
          {greenhouseOptions.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </Field>

      <Field>
        <FieldLabel htmlFor="fd-crop">작물 선택</FieldLabel>
        <select
          id="fd-crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30"
        >
          {cropOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field>
        <FieldLabel htmlFor="fd-work">작업 유형</FieldLabel>
        <select
          id="fd-work"
          value={workType}
          onChange={(e) => setWorkType(e.target.value as WorkType)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30"
        >
          {(Object.keys(WORK_TYPE_LABELS) as WorkType[]).map((k) => (
            <option key={k} value={k}>
              {WORK_TYPE_LABELS[k]}
            </option>
          ))}
        </select>
      </Field>

      <Field>
        <FieldLabel htmlFor="fd-desc">작업 내용</FieldLabel>
        <textarea
          id="fd-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          placeholder="현장 상황·용량·비고 등"
          className={inputAreaClass}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="fd-op">작업자</FieldLabel>
        <Input id="fd-op" value={operator} onChange={(e) => setOperator(e.target.value)} placeholder="이름 또는 팀" />
      </Field>

      <FarmDiaryPhotoPicker photos={pendingPhotos} onPhotosChange={setPendingPhotos} />

      <div>
        <p className="text-muted-foreground mb-2 text-[11px] font-medium">관련 센서 선택</p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {MOCK_DIARY_SENSOR_OPTIONS.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 text-[12px]"
            >
              <input
                type="checkbox"
                checked={sensorIds.includes(s.id)}
                onChange={() => toggleId(sensorIds, s.id, setSensorIds)}
                className="rounded border-input"
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-[11px] font-medium">관련 장비 선택</p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {MOCK_DIARY_EQUIPMENT_OPTIONS.map((eq) => (
            <label
              key={eq.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 text-[12px]"
            >
              <input
                type="checkbox"
                checked={equipmentIds.includes(eq.id)}
                onChange={() => toggleId(equipmentIds, eq.id, setEquipmentIds)}
                className="rounded border-input"
              />
              <span>{eq.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Field>
        <FieldLabel htmlFor="fd-importance">중요도</FieldLabel>
        <select
          id="fd-importance"
          value={importance}
          onChange={(e) => setImportance(e.target.value as DiaryImportance)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm dark:bg-input/30"
        >
          {(Object.keys(DIARY_IMPORTANCE_LABELS) as DiaryImportance[]).map((k) => (
            <option key={k} value={k}>
              {DIARY_IMPORTANCE_LABELS[k]}
            </option>
          ))}
        </select>
      </Field>

      <Field orientation="horizontal" className="items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
        <div>
          <FieldLabel className="mb-0">AI 분석 대상</FieldLabel>
          <FieldDescription className="text-[10px]">분석 파이프라인에 포함(향후). 목업 플래그만 저장.</FieldDescription>
        </div>
        <Switch checked={aiAnalysisTarget} onCheckedChange={setAiAnalysisTarget} />
      </Field>

      <Button type="submit" className="w-full rounded-xl md:w-auto">
        일지 등록 (목업)
      </Button>
    </form>
  );
}
