"use client";

import { Video } from "lucide-react";
import Link from "next/link";

import type { FarmCamera } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function countByStatus(cameras: FarmCamera[], s: FarmCamera["status"]): number {
  return cameras.filter((c) => c.status === s).length;
}

export function DashboardCameraSummary({ cameras, className }: { cameras: FarmCamera[]; className?: string }) {
  const online = countByStatus(cameras, "online");
  const degraded = countByStatus(cameras, "degraded");
  const offline = countByStatus(cameras, "offline");

  return (
    <Link
      href="/cameras"
      className={cn(
        "sf-glass sf-tesla-hover group flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 ring-1 ring-white/[0.04] md:rounded-2xl md:p-3.5",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
          <Video className="size-4 stroke-[1.5]" aria-hidden />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="sf-section-label">카메라</p>
          <p className="text-muted-foreground mt-0.5 text-[12px] md:text-[13px]">
            등록 {cameras.length}대 · 온라인 {online} · 저하 {degraded} · 끊김 {offline}
          </p>
        </div>
      </div>
      <span className="text-muted-foreground shrink-0 text-[11px] font-semibold transition-colors group-hover:text-primary md:text-[12px]">
        모니터링 →
      </span>
    </Link>
  );
}
