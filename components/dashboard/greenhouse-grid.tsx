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
    <section className={cn("space-y-0.5 md:space-y-3 lg:space-y-2.5", className)} aria-labelledby="gh-overview-heading">
      <div>
        <h2 id="gh-overview-heading" className="sf-section-label px-0.5">
          온실 · 환경·제어
        </h2>
        <p className="text-muted-foreground mt-0 max-w-xl text-[13px] leading-snug md:mt-1 md:text-[14px] md:leading-relaxed">
          온습도·관수·천창·측창 상태를 한 카드에서 확인합니다. 탭하면 상세 제어로 이동합니다.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3 lg:gap-2 xl:grid-cols-4 xl:gap-2">
        {zones.map((z) => (
          <GreenhouseCard key={z.id} zone={z} />
        ))}
      </div>
    </section>
  );
}
