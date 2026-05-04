"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  OperationScheduleForm,
  defaultScheduleForm,
  type OperationScheduleFormValues,
} from "@/components/greenhouse/operation-schedule-form";
import { Button } from "@/components/ui/button";
import { operationKindLabel } from "@/lib/greenhouse/mock-data";
import type { OperationKind, OperationSchedule } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

function toPayload(
  greenhouseId: string,
  kind: OperationKind,
  form: OperationScheduleFormValues
): Omit<OperationSchedule, "id"> {
  const label = operationKindLabel(kind);
  return {
    greenhouseId,
    kind,
    name: form.name.trim() || `${label} 스케줄`,
    driveOn: form.driveOn,
    startTime: form.startTime,
    endTime: form.endTime,
    durationMin: form.durationMin,
    repeat: form.repeat,
    enabled: form.enabled,
  };
}

export type OperationScheduleModalProps = {
  open: boolean;
  kind: OperationKind | null;
  /** 열 때 해당 id 행을 바로 편집 모드로 로드 */
  initialEditId?: string | null;
  greenhouseId: string;
  schedules: OperationSchedule[];
  onClose: () => void;
  onSaveRegister: (row: OperationSchedule) => void;
  onSaveEdit: (row: OperationSchedule) => void;
  onDelete: (id: string) => void;
};

export function OperationScheduleModal({
  open,
  kind,
  initialEditId = null,
  greenhouseId,
  schedules,
  onClose,
  onSaveRegister,
  onSaveEdit,
  onDelete,
}: OperationScheduleModalProps) {
  const [form, setForm] = useState<OperationScheduleFormValues>(() => defaultScheduleForm("관수"));
  const [editingId, setEditingId] = useState<string | null>(null);
  const schedulesRef = useRef(schedules);
  schedulesRef.current = schedules;

  const kindLabel = kind ? operationKindLabel(kind) : "";
  const rows = useMemo(() => (kind ? schedules.filter((s) => s.kind === kind) : []), [schedules, kind]);

  useEffect(() => {
    if (!open || !kind) return;
    if (initialEditId) {
      const row = schedulesRef.current.find((s) => s.id === initialEditId && s.kind === kind);
      if (row) {
        setEditingId(row.id);
        setForm({
          name: row.name?.trim() ? row.name : `${operationKindLabel(row.kind)} 스케줄`,
          driveOn: row.driveOn,
          startTime: row.startTime,
          endTime: row.endTime,
          durationMin: row.durationMin,
          repeat: row.repeat,
          enabled: row.enabled,
        });
        return;
      }
    }
    setEditingId(null);
    setForm(defaultScheduleForm(operationKindLabel(kind)));
  }, [open, kind, initialEditId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || kind == null) return null;

  function loadRow(row: OperationSchedule) {
    setEditingId(row.id);
    setForm({
      name: row.name?.trim() ? row.name : `${operationKindLabel(row.kind)} 스케줄`,
      driveOn: row.driveOn,
      startTime: row.startTime,
      endTime: row.endTime,
      durationMin: row.durationMin,
      repeat: row.repeat,
      enabled: row.enabled,
    });
  }

  function resetNew() {
    if (kind == null) return;
    setEditingId(null);
    setForm(defaultScheduleForm(operationKindLabel(kind)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-label="닫기" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="op-sched-modal-title"
        className={cn(
          "relative z-[1] mb-0 max-h-[min(92dvh,720px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[oklch(0.24_0.02_264)] p-4 shadow-2xl md:mb-0 md:rounded-2xl md:p-5"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 id="op-sched-modal-title" className="text-[16px] font-semibold tracking-tight text-foreground md:text-lg">
            구동 스케줄 설정
          </h2>
          <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-full" onClick={onClose} aria-label="취소">
            <X className="size-4 stroke-[1]" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-1 text-[12px]">목업 — API 미연동 · 센서 알람과 동일한 등록 흐름</p>

        {rows.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">등록된 스케줄</p>
            <ul className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
              {rows.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => loadRow(r)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-xl border px-3 py-2 text-left text-[12px] transition-colors",
                      editingId === r.id
                        ? "border-primary/35 bg-primary/[0.08] text-foreground"
                        : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.1] hover:bg-white/[0.04]"
                    )}
                  >
                    <span className="font-medium text-foreground">{r.name}</span>
                    <span className="tabular-nums">
                      {r.startTime} — {r.endTime} · {r.durationMin}분 · {r.repeat}
                      <span className={r.enabled ? "text-primary/85" : "text-muted-foreground"}> · {r.enabled ? "사용" : "중지"}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {editingId ? (
              <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[11px]" onClick={resetNew}>
                새 스케줄 입력
              </Button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4">
          <OperationScheduleForm values={form} onChange={setForm} kindLabel={kindLabel} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {editingId ? (
            <>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full text-[12px] font-semibold"
                onClick={() => onSaveEdit({ id: editingId, ...toPayload(greenhouseId, kind, form) })}
              >
                수정
              </Button>
              <Button type="button" variant="destructive" className="rounded-full text-[12px] font-semibold" onClick={() => onDelete(editingId)}>
                삭제
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="rounded-full text-[12px] font-semibold"
              onClick={() => onSaveRegister({ id: crypto.randomUUID(), ...toPayload(greenhouseId, kind, form) })}
            >
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
