"use client";

import { Badge } from "@/components/ui/badge";
import type { CameraStatus } from "@/lib/dashboard/types";

export function CameraStatusBadge({ status }: { status: CameraStatus }) {
  if (status === "online") {
    return (
      <Badge className="rounded-md border border-emerald-500/25 bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-500/16 dark:text-emerald-100">
        정상
      </Badge>
    );
  }
  if (status === "degraded") {
    return (
      <Badge
        variant="outline"
        className="rounded-md border-amber-500/30 bg-amber-500/[0.07] px-2 py-0.5 text-[11px] font-medium text-amber-950 dark:text-amber-100"
      >
        저하
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-md border-rose-500/35 bg-rose-500/[0.08] px-2 py-0.5 text-[11px] font-medium text-rose-900 hover:bg-rose-500/12 dark:text-rose-100"
    >
      미수신
    </Badge>
  );
}
