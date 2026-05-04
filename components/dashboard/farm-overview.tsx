"use client";

import type { LucideIcon } from "lucide-react";
import { Bot, Cpu, Hand, TriangleAlert } from "lucide-react";

import type { FarmMetaSnapshot } from "@/lib/dashboard/mock-data";
import type { GreenhouseZone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function overallLabel(zones: GreenhouseZone[]) {
  if (zones.some((z) => z.healthStatus === "error")) return "점검 필요";
  if (zones.some((z) => z.healthStatus === "warning")) return "주의";
  return "정상";
}

function overallTone(zones: GreenhouseZone[]) {
  if (zones.some((z) => z.healthStatus === "error")) return "text-rose-600 dark:text-rose-400";
  if (zones.some((z) => z.healthStatus === "warning")) return "text-amber-600 dark:text-amber-400";
  return "text-primary";
}

export function FarmOverview({
  meta,
  zones,
  className,
}: {
  meta: FarmMetaSnapshot;
  zones: GreenhouseZone[];
  className?: string;
}) {
  const auto = zones.filter((z) => z.mode === "AUTO").length;
  const manual = zones.filter((z) => z.mode === "MANUAL").length;
  const activeAlarms =
    meta.openAlarms.critical + meta.openAlarms.warning + meta.openAlarms.info;
  const status = overallLabel(zones);
  const tone = overallTone(zones);

  const tiles: {
    key: string;
    label: string;
    value: string;
    sub: string;
    Icon?: LucideIcon;
    valueClass?: string;
  }[] = [
    { key: "overall", label: "전체", value: status, sub: "시설 상태", valueClass: tone },
    { key: "auto", label: "자동", value: String(auto), sub: "존", Icon: Bot },
    { key: "manual", label: "수동", value: String(manual), sub: "존", Icon: Hand },
    {
      key: "alarms",
      label: "알람",
      value: String(activeAlarms),
      sub: "미처리",
      Icon: TriangleAlert,
    },
    { key: "devices", label: "장비", value: String(meta.onlineDevices), sub: "온라인", Icon: Cpu },
  ];

  return (
    <section className={cn("sf-surface p-5 sm:p-6", className)}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sf-section-label">시설</p>
          <h2 className="mt-1 text-[17px] font-medium tracking-tight text-foreground sm:text-lg">{meta.farmName}</h2>
        </div>
        <p className="text-muted-foreground mt-2 text-[13px] sm:mt-0">목업 텔레메트리</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {tiles.map((t) => {
          const Icon = t.Icon;
          return (
            <div
              key={t.key}
              className="rounded-lg border border-border/35 bg-muted/25 px-4 py-3 transition-colors hover:bg-muted/40 dark:bg-muted/15 dark:hover:bg-muted/25"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-muted-foreground text-[13px] font-medium tracking-tight">{t.label}</p>
                {Icon ? <Icon className="size-3.5 shrink-0 stroke-[1.5] text-primary/50" aria-hidden /> : null}
              </div>
              <p
                className={cn(
                  "mt-2 text-2xl font-medium tabular-nums tracking-tight sm:text-[1.65rem]",
                  t.valueClass ?? "text-foreground"
                )}
              >
                {t.value}
              </p>
              <p className="text-muted-foreground mt-1 text-[12px] leading-snug">{t.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
