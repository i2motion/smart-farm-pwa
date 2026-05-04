import { ScanLine, Video } from "lucide-react";

import { CameraStillFrame } from "@/components/cameras/camera-still-frame";
import { CameraStatusBadge } from "@/components/cameras/camera-status-badge";
import type { CameraStatus, FarmCamera } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/** 정상 / 저하 / 미수신 — 왼쪽 강조·배경 톤을 상태별로 명확히 구분 */
function statusAccent(status: CameraStatus) {
  if (status === "online") {
    return "border-l-emerald-500 bg-emerald-500/[0.06] dark:border-l-emerald-400 dark:bg-emerald-500/[0.08]";
  }
  if (status === "degraded") {
    return "border-l-amber-500 bg-amber-500/[0.05] dark:border-l-amber-400 dark:bg-amber-500/[0.07]";
  }
  return "border-l-rose-500 bg-rose-500/[0.06] dark:border-l-rose-400 dark:bg-rose-950/30";
}

export function CameraCard({ camera }: { camera: FarmCamera }) {
  const offline = camera.status === "offline";

  return (
    <article
      className={cn(
        "sf-surface flex flex-col overflow-hidden border-l-[3px] p-0 shadow-sm transition-shadow duration-200 hover:shadow-md dark:hover:shadow-lg",
        statusAccent(camera.status)
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/35 px-4 py-3.5">
        <div className="flex min-w-0 gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40",
              camera.status === "online" && "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
              camera.status === "degraded" && "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
              offline && "bg-rose-500/12 text-rose-700 ring-rose-500/25 dark:text-rose-300"
            )}
          >
            <Video className="size-4 stroke-[1.5]" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-[15px] font-medium leading-snug tracking-tight text-foreground">
              {camera.name}
            </h3>
            <p className="text-muted-foreground font-mono text-[11px] tabular-nums">장치 ID · {camera.id}</p>
            <p className="text-muted-foreground text-[13px] tabular-nums">
              해상도 <span className="font-medium text-foreground/90">{camera.resolution}</span>
            </p>
          </div>
        </div>
        <CameraStatusBadge status={camera.status} />
      </div>

      <div className="p-4">
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-lg border border-border/40 ring-1 ring-inset ring-border/25",
            offline && "opacity-60"
          )}
        >
          <CameraStillFrame imageUrl={camera.imageUrl} />
          <span
            className={cn(
              "pointer-events-none absolute right-2 top-2 z-[1] rounded-md px-2 py-0.5 font-mono text-[10px] shadow-sm ring-1 ring-border/35",
              offline
                ? "bg-destructive/10 text-destructive ring-destructive/25"
                : "bg-background/90 text-muted-foreground"
            )}
          >
            {offline ? "영상 없음" : "RTSP 미연동"}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 border-t border-border/35 bg-muted/20 px-4 py-3.5 dark:bg-muted/10">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
            <ScanLine className="size-4 stroke-[1.5]" aria-hidden />
          </div>
          <div>
            <p className="text-[12px] font-medium text-foreground">AI 검출</p>
            <p className="text-muted-foreground text-[11px]">엣지 추론 · 목업</p>
          </div>
        </div>
        <p className="max-w-[58%] truncate text-right text-[12px] leading-snug text-muted-foreground">
          {camera.aiLabel}
        </p>
      </div>
    </article>
  );
}
