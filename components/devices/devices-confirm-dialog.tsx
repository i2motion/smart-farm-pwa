"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DevicesConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DevicesConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "실행",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: DevicesConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="devices-confirm-title">
      <button type="button" className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" aria-label="닫기" onClick={onCancel} />
      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#141a24] p-5 shadow-2xl shadow-black/50",
          "ring-1 ring-primary/20"
        )}
      >
        <h2 id="devices-confirm-title" className="text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" className="rounded-full text-[12px]" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" size="sm" className="rounded-full px-4 text-[12px] font-semibold" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
