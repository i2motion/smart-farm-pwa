"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DIARY_IMPORTANCE_LABELS, WORK_TYPE_LABELS } from "@/lib/work/mock-data";
import type { FarmDiaryEntry } from "@/lib/work/types";
import { cn } from "@/lib/utils";

export type FarmDiaryDetailProps = {
  entry: FarmDiaryEntry | null;
  onClose: () => void;
};

export function FarmDiaryDetail({ entry, onClose }: FarmDiaryDetailProps) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-[1] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-background p-4 shadow-2xl sm:rounded-2xl sm:p-5"
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="sf-section-label mb-1">농사일지 상세</p>
            <h4 className="text-lg font-semibold tracking-tight text-foreground">{entry.greenhouseName}</h4>
            <p className="text-muted-foreground text-[12px]">
              {entry.date} {entry.time} · {WORK_TYPE_LABELS[entry.workType]}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={onClose} aria-label="닫기">
            <X className="size-4" />
          </Button>
        </div>

        <dl className="space-y-3 text-[13px]">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">작물</dt>
            <dd className="mt-0.5 font-medium text-foreground">{entry.crop}</dd>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">작업 내용</dt>
            <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed text-foreground/90">{entry.description}</dd>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <dt className="text-[10px] font-medium text-muted-foreground">작업자</dt>
              <dd className="mt-0.5 font-semibold">{entry.operator}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <dt className="text-[10px] font-medium text-muted-foreground">중요도</dt>
              <dd className="mt-0.5 font-semibold text-primary">{DIARY_IMPORTANCE_LABELS[entry.importance]}</dd>
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <dt className="text-[10px] font-medium text-muted-foreground">AI 분석 대상</dt>
            <dd className="mt-0.5">{entry.aiAnalysisTarget ? "포함" : "제외"}</dd>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <dt className="text-[10px] font-medium text-muted-foreground">관련 센서</dt>
            <dd className="mt-0.5">{entry.relatedSensorLabels.length ? entry.relatedSensorLabels.join(", ") : "—"}</dd>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
            <dt className="text-[10px] font-medium text-muted-foreground">관련 장비</dt>
            <dd className="mt-0.5">{entry.relatedEquipmentLabels.length ? entry.relatedEquipmentLabels.join(", ") : "—"}</dd>
          </div>
          {entry.photos.length > 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">사진 미리보기</dt>
              <dd className="mt-2">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {entry.photos.map((p) => (
                    <li
                      key={p.id}
                      className="aspect-square overflow-hidden rounded-lg border border-white/[0.08] bg-black/25 ring-1 ring-white/[0.05]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 미리보기 */}
                      <img src={p.previewUrl} alt="" className="size-full object-cover" />
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                  향후: 이미지 기반 AI 분석 · 병해충 탐지 · 생육 분석 파이프라인 연동 예정 (목업).
                </p>
              </dd>
            </div>
          ) : null}
          {entry.photoPlaceholderNote && entry.photos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.1] bg-black/20 px-3 py-2 text-[12px] text-muted-foreground">
              {entry.photoPlaceholderNote}
            </div>
          ) : null}
          <p className="text-muted-foreground font-mono text-[11px] tabular-nums">ID · {entry.id}</p>
        </dl>
      </div>
    </div>
  );
}
