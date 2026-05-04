import { Cctv } from "lucide-react";

import type { FarmCamera } from "@/lib/dashboard/types";

export function CamerasSummary({ cameras }: { cameras: FarmCamera[] }) {
  const total = cameras.length;
  const online = cameras.filter((c) => c.status === "online").length;
  const degraded = cameras.filter((c) => c.status === "degraded").length;
  const offline = cameras.filter((c) => c.status === "offline").length;

  const items = [
    { label: "전체 채널", value: total },
    { label: "온라인", value: online },
    { label: "성능 저하", value: degraded },
    { label: "오프라인", value: offline },
  ];

  return (
    <div className="sf-surface relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/45 to-transparent" aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Cctv className="size-4 stroke-[1.5]" aria-hidden />
          </div>
          <div>
            <p className="sf-section-label leading-tight">영상 채널 요약</p>
            <p className="text-muted-foreground mt-0.5 text-[13px] leading-snug">
              목업 집계 · 실제 연동 시 게이트웨이 상태와 동기화됩니다.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/40 bg-muted/25 px-3 py-2.5 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)] dark:bg-muted/15"
          >
            <p className="text-muted-foreground text-[12px] font-medium tracking-tight">{item.label}</p>
            <p className="mt-1 text-2xl font-medium tabular-nums tracking-tight text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 border-t border-border/30 pt-3 text-[13px] leading-relaxed">
        원격 스트림·PTZ·스냅샷은 백엔드 API 확정 후 버튼이 활성화됩니다.
      </p>
    </div>
  );
}
