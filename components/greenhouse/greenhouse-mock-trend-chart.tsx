"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type GreenhouseMockTrendChartProps = {
  title: string;
  values: number[];
  labels: string[];
  unit: string;
  /** Tailwind stroke color class on polyline */
  strokeClassName?: string;
  className?: string;
};

const VIEW_W = 360;
const VIEW_H = 96;
const PAD_X = 8;
const PAD_Y = 10;

function buildPathD(values: number[], min: number, max: number): { line: string; area: string } {
  const n = values.length;
  if (n === 0) return { line: "", area: "" };
  const span = Math.max(max - min, 1e-6);
  const innerW = VIEW_W - PAD_X * 2;
  const innerH = VIEW_H - PAD_Y * 2;
  const pts = values.map((v, i) => {
    const x = PAD_X + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = PAD_Y + (1 - (v - min) / span) * innerH;
    return { x, y };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first || !last) return { line, area: "" };
  const area = `${line} L ${last.x.toFixed(1)} ${VIEW_H - PAD_Y} L ${first.x.toFixed(1)} ${VIEW_H - PAD_Y} Z`;
  return { line, area };
}

export function GreenhouseMockTrendChart({
  title,
  values,
  labels,
  unit,
  strokeClassName = "stroke-primary",
  className,
}: GreenhouseMockTrendChartProps) {
  const gradId = useId().replace(/:/g, "");
  const min = Math.min(...values);
  const max = Math.max(...values);
  const { line, area } = buildPathD(values, min, max);
  const last = values[values.length - 1];
  const firstLabel = labels[0] ?? "";
  const lastLabel = labels[labels.length - 1] ?? "";
  const display =
    typeof last === "number" && Number.isFinite(last)
      ? unit === "°C"
        ? last.toFixed(1)
        : unit === "%"
          ? String(Math.round(last))
          : last.toFixed(1)
      : "—";

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 backdrop-blur-md md:rounded-3xl md:px-4 md:py-4",
        className
      )}
    >
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[11px]">{title}</p>
          <p className="mt-1 text-[1.35rem] font-extralight tabular-nums tracking-tight text-foreground md:text-[1.5rem]">
            {display}
            <span className="ml-0.5 text-[13px] font-medium text-muted-foreground md:text-sm">{unit}</span>
          </p>
        </div>
        <p className="shrink-0 text-[10px] tabular-nums text-muted-foreground/80 md:text-[11px]">
          {firstLabel} — {lastLabel}
        </p>
      </div>
      <div className="mt-2 md:mt-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-[72px] w-full overflow-visible md:h-[84px]"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.58 0.11 252)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.58 0.11 252)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {area ? <path d={area} fill={`url(#${gradId})`} className="opacity-90" /> : null}
          {line ? (
            <path
              d={line}
              fill="none"
              className={cn(strokeClassName, "stroke-[1.75] [stroke-linecap:round] [stroke-linejoin:round]")}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}
