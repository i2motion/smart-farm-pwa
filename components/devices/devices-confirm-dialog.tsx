"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DevicesConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 양액·온풍기 등 고위험 조작용 추가 확인 */
  requireAcknowledgement?: boolean;
  acknowledgementLabel?: string;
  acknowledged?: boolean;
  onAcknowledgedChange?: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DevicesConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "실행",
  cancelLabel = "취소",
  requireAcknowledgement,
  acknowledgementLabel,
  acknowledged = false,
  onAcknowledgedChange,
  onConfirm,
  onCancel,
}: DevicesConfirmDialogProps) {
  if (!open) return null;

  const canConfirm = !requireAcknowledgement || acknowledged;

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
        {requireAcknowledgement && acknowledgementLabel ? (
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-500/[0.08] px-3 py-2.5 text-[12px] leading-snug text-amber-50/95">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => onAcknowledgedChange?.(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input"
            />
            <span>{acknowledgementLabel}</span>
          </label>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" className="rounded-full text-[12px]" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-full px-4 text-[12px] font-semibold"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
