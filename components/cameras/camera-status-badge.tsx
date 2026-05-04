"use client";

import { Badge } from "@/components/ui/badge";
import type { CameraStatus } from "@/lib/dashboard/types";

export function CameraStatusBadge({ status }: { status: CameraStatus }) {
  if (status === "online") {
    return (
      <Badge className="rounded-md border-0 bg-primary/14 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/18">
        온라인
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
    <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] font-medium">
      오프라인
    </Badge>
  );
}
