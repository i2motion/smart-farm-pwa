"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FarmApiErrorBannerProps = {
  message: string;
  /** When true, explain that local mock data is shown */
  usingMockFallback?: boolean;
  onRetry?: () => void;
  className?: string;
};

export function FarmApiErrorBanner({ message, usingMockFallback, onRetry, className }: FarmApiErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-wrap items-start gap-3 rounded-2xl border border-rose-400/35 bg-rose-500/[0.12] px-3 py-2.5 text-rose-50 md:px-4 md:py-3",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 opacity-90" aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[13px] font-semibold leading-snug md:text-[14px]">Farm PC에 연결할 수 없습니다</p>
        <p className="text-[12px] leading-relaxed text-rose-100/90">{message}</p>
        {usingMockFallback ? (
          <p className="text-[11px] leading-relaxed text-rose-100/75">
            로컬 목업 데이터를 표시 중입니다. Delphi 모의 서버가 실행 중인지 확인하세요.
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 rounded-full border-white/10 bg-white/[0.08] text-[12px]"
          onClick={onRetry}
        >
          <RefreshCw className="mr-1 size-3.5" aria-hidden />
          다시 시도
        </Button>
      ) : null}
    </div>
  );
}
