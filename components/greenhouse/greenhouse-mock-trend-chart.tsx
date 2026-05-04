"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type TrendChartSeries = {
  key: string;
  label: string;
  values: number[];
  unit: string;
  /** SVG 선 색 (지표별 구분) */
  strokeColor: string;
};

type GreenhouseMockTrendChartProps = {
  title: string;
  labels: string[];
  series: TrendChartSeries[];
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

function formatLast(unit: string, last: number): string {
  if (!Number.isFinite(last)) return "—";
  if (unit === "°C") return last.toFixed(1);
  if (unit === "%" || unit === "W/m²") return String(Math.round(last));
  if (unit === "mS/cm") return last.toFixed(2);
  if (unit === "") return last.toFixed(1);
  return last.toFixed(1);
}

export function GreenhouseMockTrendChart({ title, labels, series, className }: GreenhouseMockTrendChartProps) {
  const gradId = useId().replace(/:/g, "");
  const firstLabel = labels[0] ?? "";
  const lastLabel = labels[labels.length - 1] ?? "";
  const single = series.length === 1;
  const s0 = series[0];
  const last0 = s0?.values[s0.values.length - 1];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 backdrop-blur-md md:rounded-3xl md:px-4 md:py-4",
        className
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[11px]">{title}</p>
          {single && s0 ? (
            <p className="mt-1 text-[1.35rem] font-extralight tabular-nums tracking-tight text-foreground md:text-[1.5rem]">
              {formatLast(s0.unit, typeof last0 === "number" ? last0 : NaN)}
              {s0.unit ? <span className="ml-1 text-[13px] font-medium text-muted-foreground md:text-sm">{s0.unit}</span> : null}
            </p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] tabular-nums text-foreground/90 md:text-[12px]">
              {series.map((s) => {
                const last = s.values[s.values.length - 1];
                return (
                  <li key={s.key} className="flex items-center gap-1.5">
                    <span
                      className="size-1.5 shrink-0 rounded-full ring-1 ring-white/25"
                      style={{ backgroundColor: s.strokeColor }}
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium">
                      {formatLast(s.unit, typeof last === "number" ? last : NaN)}
                      {s.unit ? <span className="ml-0.5 text-muted-foreground">{s.unit}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
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
            {single && s0 ? (
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s0.strokeColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s0.strokeColor} stopOpacity="0" />
              </linearGradient>
            ) : (
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.08 252)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="oklch(0.55 0.08 252)" stopOpacity="0" />
              </linearGradient>
            )}
          </defs>
          {single && s0
            ? (() => {
                const min = Math.min(...s0.values);
                const max = Math.max(...s0.values);
                const { line, area } = buildPathD(s0.values, min, max);
                return (
                  <>
                    {area ? <path d={area} fill={`url(#${gradId})`} className="opacity-90" /> : null}
                    {line ? (
                      <path
                        d={line}
                        fill="none"
                        stroke={s0.strokeColor}
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null}
                  </>
                );
              })()
            : series.map((s) => {
                const min = Math.min(...s.values);
                const max = Math.max(...s.values);
                const { line } = buildPathD(s.values, min, max);
                return line ? (
                  <path
                    key={s.key}
                    d={line}
                    fill="none"
                    stroke={s.strokeColor}
                    strokeWidth={1.55}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.95}
                  />
                ) : null;
              })}
        </svg>
      </div>
    </div>
  );
}
