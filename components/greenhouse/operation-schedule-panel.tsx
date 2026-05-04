"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { OperationKind, OperationSchedule } from "@/lib/greenhouse/types";
import { cn } from "@/lib/utils";

type Draft = {
  driveOn: boolean;
  startTime: string;
  endTime: string;
  durationMin: number;
  repeat: string;
  enabled: boolean;
};

const emptyDraft = (): Draft => ({
  driveOn: false,
  startTime: "06:00",
  endTime: "06:30",
  durationMin: 30,
  repeat: "매일",
  enabled: true,
});

const SECTIONS: {
  kind: OperationKind;
  title: string;
  description?: string;
}[] = [
  { kind: "irrigation", title: "관수", description: "관수 밸브·펌프 구동 스케줄(목업)" },
  { kind: "flowFan", title: "유동팬", description: "하우스 내부 공기 순환" },
  { kind: "hotAirBlower", title: "온풍기", description: "난방 및 온도 유지" },
  { kind: "sprayer", title: "분무기", description: "분무/습도 보조" },
  { kind: "exhaustFan", title: "배기팬", description: "하우스 외벽 환기팬" },
];

function ScheduleRow({
  row,
  onEdit,
  onDelete,
}: {
  row: OperationSchedule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[12px] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
        <span
          className={cn(
            "rounded-full border px-2 py-px text-[10px] font-semibold uppercase tabular-nums",
            row.driveOn ? "border-primary/35 bg-primary/15 text-primary" : "border-white/[0.08] bg-white/[0.04] text-muted-foreground"
          )}
        >
          {row.driveOn ? "ON" : "OFF"}
        </span>
        <span className="font-medium text-foreground">{row.startTime}</span>
        <span>—</span>
        <span className="font-medium text-foreground">{row.endTime}</span>
        <span className="tabular-nums">작동 {row.durationMin}분</span>
        <span>{row.repeat}</span>
        <span className={row.enabled ? "text-primary/90" : "text-muted-foreground"}>{row.enabled ? "사용" : "중지"}</span>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button type="button" variant="ghost" size="sm" className="h-7 rounded-full px-2 text-[11px]" onClick={onEdit}>
          수정
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 rounded-full px-2 text-[11px] text-rose-300" onClick={onDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}

export type OperationSchedulePanelProps = {
  greenhouseId: string;
  schedules: OperationSchedule[];
  onChange: (next: OperationSchedule[]) => void;
};

export function OperationSchedulePanel({ greenhouseId, schedules, onChange }: OperationSchedulePanelProps) {
  const [drafts, setDrafts] = useState<Record<OperationKind, Draft>>({
    irrigation: emptyDraft(),
    flowFan: emptyDraft(),
    hotAirBlower: emptyDraft(),
    sprayer: emptyDraft(),
    exhaustFan: emptyDraft(),
  });
  const [editing, setEditing] = useState<OperationSchedule | null>(null);

  function setDraft(kind: OperationKind, patch: Partial<Draft>) {
    setDrafts((d) => ({ ...d, [kind]: { ...d[kind], ...patch } }));
  }

  function upsert(kind: OperationKind) {
    const dr = drafts[kind];
    const payload: Omit<OperationSchedule, "id"> = {
      greenhouseId,
      kind,
      driveOn: dr.driveOn,
      startTime: dr.startTime,
      endTime: dr.endTime,
      durationMin: dr.durationMin,
      repeat: dr.repeat,
      enabled: dr.enabled,
    };
    if (editing && editing.id && editing.kind === kind) {
      onChange(schedules.map((s) => (s.id === editing.id ? { ...s, ...payload } : s)));
    } else {
      onChange([...schedules, { id: crypto.randomUUID(), ...payload }]);
    }
    setEditing(null);
    setDraft(kind, emptyDraft());
  }

  function remove(id: string) {
    onChange(schedules.filter((s) => s.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <section aria-labelledby="op-schedule-heading" className="space-y-4">
      <h2 id="op-schedule-heading" className="sf-section-label">
        구동 제어 · 스케줄 (목업)
      </h2>
      <p className="text-muted-foreground text-[11px] leading-relaxed md:text-[12px]">
        관수·유동팬·온풍기·분무기·배기팬별 구동 ON/OFF와 시간 스케줄을 목업으로 등록합니다.
      </p>
      <div className="space-y-5">
        {SECTIONS.map((sec) => {
          const rows = schedules.filter((s) => s.kind === sec.kind);
          const d = drafts[sec.kind];
          const isEditingThis = editing?.kind === sec.kind;
          return (
            <div key={sec.kind} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-md md:rounded-3xl md:p-5">
              <div className="mb-3">
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{sec.title}</h3>
                {sec.description ? <p className="text-muted-foreground mt-0.5 text-[12px] leading-snug">{sec.description}</p> : null}
              </div>
              <div className="space-y-2">
                {rows.length === 0 ? (
                  <p className="text-muted-foreground rounded-xl border border-dashed border-white/[0.08] px-3 py-3 text-center text-[12px]">
                    등록된 스케줄이 없습니다.
                  </p>
                ) : null}
                {rows.map((r) => (
                  <ScheduleRow
                    key={r.id}
                    row={r}
                    onEdit={() => {
                      setEditing(r);
                      setDrafts((prev) => ({
                        ...prev,
                        [r.kind]: {
                          driveOn: r.driveOn,
                          startTime: r.startTime,
                          endTime: r.endTime,
                          durationMin: r.durationMin,
                          repeat: r.repeat,
                          enabled: r.enabled,
                        },
                      }));
                    }}
                    onDelete={() => remove(r.id)}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">시작 시간</Label>
                    <Input type="time" value={d.startTime} onChange={(e) => setDraft(sec.kind, { startTime: e.target.value })} className="h-9 text-[13px]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">종료 시간</Label>
                    <Input type="time" value={d.endTime} onChange={(e) => setDraft(sec.kind, { endTime: e.target.value })} className="h-9 text-[13px]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">작동 시간</Label>
                    <Input
                      type="number"
                      min={1}
                      value={d.durationMin}
                      onChange={(e) => setDraft(sec.kind, { durationMin: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="h-9 text-[13px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">반복</Label>
                    <select
                      value={d.repeat}
                      onChange={(e) => setDraft(sec.kind, { repeat: e.target.value })}
                      className={cn(
                        "h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-[13px] outline-none",
                        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                      )}
                    >
                      <option>매일</option>
                      <option>주중</option>
                      <option>사용자</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                    <div>
                      <p className="text-[12px] font-medium text-foreground">구동 ON/OFF</p>
                      <p className="text-muted-foreground text-[10px]">출력 상태(목업)</p>
                    </div>
                    <Switch checked={d.driveOn} onCheckedChange={(c) => setDraft(sec.kind, { driveOn: Boolean(c) })} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                    <span className="text-[12px] font-medium">사용</span>
                    <Switch checked={d.enabled} onCheckedChange={(c) => setDraft(sec.kind, { enabled: Boolean(c) })} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" className="rounded-full text-[12px] font-semibold" onClick={() => upsert(sec.kind)}>
                    {isEditingThis ? "수정" : "등록"}
                  </Button>
                  {isEditingThis ? (
                    <Button type="button" variant="ghost" size="sm" className="rounded-full text-[12px]" onClick={() => setEditing(null)}>
                      취소
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
