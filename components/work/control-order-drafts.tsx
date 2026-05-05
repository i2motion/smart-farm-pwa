"use client";

import { ShieldAlert } from "lucide-react";

import type { ControlOrderDraft } from "@/lib/work/types";
import { ControlOrderCard } from "@/components/work/control-order-card";
import { cn } from "@/lib/utils";

export type ControlOrderDraftsProps = {
  drafts: ControlOrderDraft[];
  onApprove: (id: string) => void;
  onHold: (id: string) => void;
  onReject: (id: string) => void;
  onSaveEdit: (id: string, proposedCommand: string) => void;
  className?: string;
};

export function ControlOrderDrafts({ drafts, onApprove, onHold, onReject, onSaveEdit, className }: ControlOrderDraftsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <ShieldAlert className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight">제어명령 초안</h3>
          <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed md:text-[12px]">
            AI가 생성한 설정 초안입니다. 사람이 승인하기 전까지 실행되지 않으며, PLC/API 미연동 상태입니다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {drafts.map((d) => (
          <ControlOrderCard
            key={d.id}
            draft={d}
            onApprove={() => onApprove(d.id)}
            onHold={() => onHold(d.id)}
            onReject={() => onReject(d.id)}
            onSaveEdit={(cmd) => onSaveEdit(d.id, cmd)}
          />
        ))}
      </div>
    </div>
  );
}
