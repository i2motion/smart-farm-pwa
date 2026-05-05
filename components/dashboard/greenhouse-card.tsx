"use client";

import type { LucideIcon } from "lucide-react";
import { Beaker, Waves, Warehouse } from "lucide-react";
import Link from "next/link";

import { sideWindowLayout, zoneNumber } from "@/lib/dashboard/greenhouse-vent-rules";
import type { GreenhouseZone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function ActuatorChip({
  active,
  Icon,
  activeLabel,
  idleLabel,
}: {
  active: boolean;
  Icon: LucideIcon;
  activeLabel: string;
  idleLabel: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-white/[0.06] px-1.5 py-px text-[10px] font-semibold tabular-nums transition-colors duration-200 md:gap-1 md:px-2.5 md:py-0.5 md:text-[12px] lg:px-2 lg:text-[11px]",
        active ? "border-primary/20 bg-primary/[0.07] text-primary" : "border-transparent bg-white/[0.04] text-muted-foreground"
      )}
      title={active ? activeLabel : idleLabel}
    >
      <Icon className="size-3 shrink-0 stroke-[1] opacity-80 md:size-3.5" aria-hidden />
      {active ? activeLabel : idleLabel}
    </span>
  );
}

function VentLine({ label, open }: { label: string; open: boolean }) {
  return (
    <div className="flex min-h-6 items-center justify-between gap-1 text-[11px] font-medium leading-none md:min-h-8 md:gap-2 md:text-[13px] md:leading-tight lg:min-h-0 lg:text-[12px]">
      <span className="text-muted-foreground truncate">{label}</span>
      <span className={cn("shrink-0 font-semibold tabular-nums", open ? "text-primary" : "text-muted-foreground/75")}>
        {open ? "열림" : "닫힘"}
      </span>
    </div>
  );
}

export function GreenhouseCard({
  zone,
  className,
}: {
  zone: GreenhouseZone;
  className?: string;
}) {
  const n = zoneNumber(zone);
  const side = sideWindowLayout(n);

  return (
    <Link
      href={`/greenhouses/${zone.id}`}
      className={cn(
        "sf-glass-subtle sf-tesla-hover group block rounded-xl p-3 ring-1 ring-white/[0.04] transition-transform duration-300 ease-out active:scale-[0.99] md:rounded-3xl md:p-4 md:ring-0 lg:p-3.5 lg:active:scale-100",
        "hover:border-white/[0.12] hover:bg-white/[0.07]",
        className
      )}
    >
      <div className="flex items-start gap-1 md:gap-3">
        <Warehouse className="mt-0 size-3 shrink-0 stroke-[1] text-muted-foreground transition-colors duration-200 group-hover:text-primary md:mt-0.5 md:size-4" aria-hidden />
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="truncate text-[15px] font-semibold tracking-tight text-foreground md:text-[17px] lg:text-[16px]">
            {zone.name}
          </h2>
          <p className="text-muted-foreground mt-0 line-clamp-1 text-[12px] leading-snug md:mt-0.5 md:text-[14px]">
            {zone.crop}
          </p>
        </div>
      </div>

      {zone.status.trim() ? (
        <div className="mt-0.5 md:mt-2.5">
          <p className="truncate text-[10px] font-medium tracking-tight text-muted-foreground md:text-[12px]">
            {zone.status}
          </p>
        </div>
      ) : null}

      <div className="mt-1 flex items-end justify-between gap-2 md:mt-2.5 md:gap-4">
        <div className="leading-none">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.06em] md:text-[12px] md:tracking-[0.08em]">
            온도
          </p>
          <p className="text-foreground mt-0 text-[1.5rem] font-extralight tabular-nums tracking-tight md:mt-0.5 md:text-[2rem]">
            {zone.tempC.toFixed(1)}
            <span className="text-base font-light text-muted-foreground md:text-xl">°C</span>
          </p>
        </div>
        <div className="text-right leading-none">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.06em] md:text-[12px] md:tracking-[0.08em]">
            습도
          </p>
          <p className="text-foreground mt-0 text-xl font-extralight tabular-nums md:mt-0.5 md:text-3xl">{zone.humidityPct}%</p>
        </div>
      </div>

      <div className="mt-1 space-y-0.5 border-t border-white/[0.06] pt-1 md:mt-2.5 md:space-y-1.5 md:border-white/[0.08] md:pt-2.5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:text-[12px]">
            관수
          </p>
          <ActuatorChip active={zone.irrigationRunning} Icon={Waves} activeLabel="가동" idleLabel="정지" />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:text-[12px]">
            양액공급
          </p>
          <ActuatorChip active={zone.nutrientSupplyRunning} Icon={Beaker} activeLabel="가동" idleLabel="정지" />
        </div>
        <div>
          <p className="text-muted-foreground mb-0 text-[10px] font-semibold uppercase tracking-[0.06em] md:mb-0.5 md:text-[12px]">
            개폐
          </p>
          <div className="grid grid-cols-2 gap-x-1 gap-y-0 rounded-md bg-white/[0.02] px-1 py-0.5 ring-1 ring-white/[0.05] md:flex md:flex-col md:gap-1 md:rounded-xl md:border md:border-white/[0.06] md:bg-white/[0.03] md:px-2.5 md:py-1.5 md:ring-0 lg:px-2.5 lg:py-1.5">
            <VentLine label="천창 좌" open={zone.skylightLeftOpen} />
            <VentLine label="천창 우" open={zone.skylightRightOpen} />
            {side === "left" ? <VentLine label="측창 좌" open={zone.sideWindowLeftOpen} /> : null}
            {side === "right" ? <VentLine label="측창 우" open={zone.sideWindowRightOpen} /> : null}
            {zone.id === "gh-05" ? <VentLine label="보온커튼" open={zone.thermalCurtainOpen} /> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
