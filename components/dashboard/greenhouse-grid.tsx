"use client";

import { GreenhouseCard } from "@/components/dashboard/greenhouse-card";
import type { GreenhouseZone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function GreenhouseGrid({
  zones,
  className,
}: {
  zones: GreenhouseZone[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Greenhouses
          </h2>
          <p className="text-muted-foreground text-[11px]">
            {zones.length} zones · compact status
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {zones.map((z) => (
          <GreenhouseCard key={z.id} zone={z} />
        ))}
      </div>
    </div>
  );
}
