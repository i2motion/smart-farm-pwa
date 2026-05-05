"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DIARY_IMPORTANCE_LABELS, WORK_TYPE_LABELS } from "@/lib/work/mock-data";
import type { DiaryImportance, FarmDiaryEntry, WorkType } from "@/lib/work/types";
import { cn } from "@/lib/utils";

export type FarmDiaryListProps = {
  entries: FarmDiaryEntry[];
  onSelectEntry: (entry: FarmDiaryEntry) => void;
  greenhouseFilterOptions: { id: string; label: string }[];
  className?: string;
};

function importanceBadgeClass(i: DiaryImportance): string {
  if (i === "urgent") return "border-rose-500/30 bg-rose-500/15 text-rose-100";
  if (i === "high") return "border-amber-400/25 bg-amber-500/10 text-amber-50";
  if (i === "normal") return "border-primary/20 bg-primary/10 text-primary";
  return "border-white/[0.08] bg-white/[0.05] text-muted-foreground";
}

export function FarmDiaryList({
  entries,
  onSelectEntry,
  greenhouseFilterOptions,
  className,
}: FarmDiaryListProps) {
  const [ghId, setGhId] = useState<string>("");
  const [workType, setWorkType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [importance, setImportance] = useState<string>("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (ghId && e.greenhouseId !== ghId) return false;
      if (workType && e.workType !== workType) return false;
      if (importance && e.importance !== importance) return false;
      if (dateFrom && e.date < dateFrom) return false;
      return true;
    });
  }, [entries, ghId, workType, importance, dateFrom]);

  function clearFilters() {
    setGhId("");
    setWorkType("");
    setDateFrom("");
    setImportance("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">최근 농사일지</h3>
        <p className="text-muted-foreground mt-1 text-[11px] md:text-[12px]">필터 후 항목을 눌러 상세를 확인합니다.</p>
      </div>

      <div className="grid gap-2 rounded-xl border border-white/[0.06] bg-black/15 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground">온실</span>
          <select
            value={ghId}
            onChange={(e) => setGhId(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-[12px] dark:bg-input/30"
          >
            <option value="">전체</option>
            {greenhouseFilterOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground">작업 유형</span>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-[12px] dark:bg-input/30"
          >
            <option value="">전체</option>
            {(Object.keys(WORK_TYPE_LABELS) as WorkType[]).map((k) => (
              <option key={k} value={k}>
                {WORK_TYPE_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground">날짜 (이후)</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-[12px] dark:bg-input/30"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-muted-foreground">중요도</span>
          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-[12px] dark:bg-input/30"
          >
            <option value="">전체</option>
            {(Object.keys(DIARY_IMPORTANCE_LABELS) as DiaryImportance[]).map((k) => (
              <option key={k} value={k}>
                {DIARY_IMPORTANCE_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="rounded-full text-[11px]" onClick={clearFilters}>
          필터 초기화
        </Button>
        <span className="text-muted-foreground text-[11px] tabular-nums">{filtered.length}건 표시</span>
      </div>

      <ul className="max-h-[min(52vh,520px)] space-y-2 overflow-y-auto overscroll-contain pr-1">
        {filtered.length === 0 ? (
          <li className="text-muted-foreground rounded-xl border border-dashed border-white/[0.08] px-3 py-8 text-center text-[13px]">
            조건에 맞는 일지가 없습니다.
          </li>
        ) : (
          filtered.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelectEntry(e)}
                className="flex w-full gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-left transition-colors hover:border-primary/25 hover:bg-primary/[0.06]"
              >
                {e.photos[0] ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 썸네일 */}
                    <img src={e.photos[0].previewUrl} alt="" className="size-full object-cover" />
                    {e.photos.length > 1 ? (
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 py-px text-[9px] font-bold tabular-nums text-white">
                        +{e.photos.length - 1}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-[12px] font-semibold text-foreground">{e.greenhouseName}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {e.date} {e.time} · {WORK_TYPE_LABELS[e.workType]}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          importanceBadgeClass(e.importance)
                        )}
                      >
                        {DIARY_IMPORTANCE_LABELS[e.importance]}
                      </span>
                      {e.photos.length > 0 ? (
                        <span className="text-muted-foreground text-[10px] tabular-nums">사진 {e.photos.length}장</span>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-[12px] leading-snug">{e.description}</p>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
