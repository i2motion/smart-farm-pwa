"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ControlOrderDraft, ControlOrderStatus } from "@/lib/work/types";
import { cn } from "@/lib/utils";

function riskLabel(r: ControlOrderDraft["riskLevel"]): string {
  if (r === "critical") return "위험 · 긴급 검토";
  if (r === "high") return "높음";
  if (r === "medium") return "보통";
  return "낮음";
}

function riskClass(r: ControlOrderDraft["riskLevel"]): string {
  if (r === "critical") return "border-rose-500/35 bg-rose-500/10 text-rose-100";
  if (r === "high") return "border-orange-400/30 bg-orange-500/10 text-orange-50";
  if (r === "medium") return "border-amber-400/25 bg-amber-500/10 text-amber-50";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-50";
}

function statusLabel(s: ControlOrderStatus): string {
  switch (s) {
    case "draft":
      return "초안";
    case "approved":
      return "승인됨";
    case "on_hold":
      return "보류";
    case "rejected":
      return "거부";
    case "superseded":
      return "대체됨";
    default:
      return s;
  }
}

export type ControlOrderCardProps = {
  draft: ControlOrderDraft;
  onApprove: () => void;
  onHold: () => void;
  onReject: () => void;
  onSaveEdit: (proposedCommand: string) => void;
};

export function ControlOrderCard({ draft, onApprove, onHold, onReject, onSaveEdit }: ControlOrderCardProps) {
  const [editing, setEditing] = useState(false);
  const [localCmd, setLocalCmd] = useState(draft.proposedCommand);

  useEffect(() => {
    setLocalCmd(draft.proposedCommand);
  }, [draft.proposedCommand, draft.id]);

  const canAct = draft.status === "draft" || draft.status === "on_hold";

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-primary">{draft.targetGreenhouseName}</p>
          <p className="text-[15px] font-semibold tracking-tight text-foreground">{draft.targetEquipment}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", riskClass(draft.riskLevel))}>
            위험도 · {riskLabel(draft.riskLevel)}
          </span>
          <span className="rounded-full border border-white/[0.1] bg-black/25 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {statusLabel(draft.status)}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-[12px] md:text-[13px]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">제안 명령</p>
          {editing ? (
            <textarea
              value={localCmd}
              onChange={(e) => setLocalCmd(e.target.value)}
              rows={3}
              className="mt-1 min-h-[72px] w-full rounded-lg border border-input bg-transparent px-2 py-1.5 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/25"
            />
          ) : (
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-foreground/95">{draft.proposedCommand}</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground">제안 이유</p>
          <p className="mt-0.5 text-foreground/85">{draft.reason}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">관련 농사일지</p>
            <p className="mt-0.5 font-mono text-[11px] text-foreground/90">{draft.relatedDiaryEntryIds.join(", ") || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">관련 센서값</p>
            <p className="mt-0.5 text-[12px] text-foreground/85">{draft.relatedSensorSnapshot}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-500/[0.06] px-3 py-2 text-[11px] leading-snug text-amber-50/95">
        AI는 제어를 직접 실행하지 않습니다. 승인 후에도 PLC·정책 계층에서만 반영됩니다(목업).
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {editing ? (
          <>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              onClick={() => {
                onSaveEdit(localCmd.trim() || draft.proposedCommand);
                setEditing(false);
              }}
            >
              수정 반영
            </Button>
            <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setEditing(false)}>
              취소
            </Button>
          </>
        ) : (
          <Button type="button" size="sm" variant="secondary" className="rounded-full" onClick={() => setEditing(true)} disabled={!canAct}>
            수정
          </Button>
        )}
        <Button type="button" size="sm" variant="default" className="rounded-full" onClick={onApprove} disabled={!canAct}>
          승인
        </Button>
        <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={onHold} disabled={!canAct}>
          보류
        </Button>
        <Button type="button" size="sm" variant="destructive" className="rounded-full" onClick={onReject} disabled={!canAct}>
          거부
        </Button>
      </div>

      {draft.lastActionSummary ? (
        <p className="text-muted-foreground mt-2 font-mono text-[10px]">
          최종 처리 · {draft.lastActionSummary}
          {draft.lastActionAt ? ` (${new Date(draft.lastActionAt).toLocaleString("ko-KR")})` : ""}
        </p>
      ) : null}
    </article>
  );
}
