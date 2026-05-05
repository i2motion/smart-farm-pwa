"use client";

import { Sparkles } from "lucide-react";

import type { AIReport } from "@/lib/work/types";
import { cn } from "@/lib/utils";

function BulletBlock({ title, items, accent }: { title: string; items: string[]; accent?: string }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 md:p-4", accent)}>
      <p className="sf-section-label mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((line, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-snug text-foreground/90 md:text-[13px]">
            <span className="text-primary/80 shrink-0">·</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type AIOperationReportProps = {
  report: AIReport;
  className?: string;
};

export function AIOperationReport({ report, className }: AIOperationReportProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Sparkles className="size-4" aria-hidden />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">AI 운영보고</h3>
          <p className="text-muted-foreground text-[11px] leading-relaxed md:text-[12px]">
            참고용 요약이며 제어는 수행하지 않습니다. 승인·현장 확인이 전제됩니다.
          </p>
        </div>
      </div>

      <p className="text-muted-foreground font-mono text-[10px] tabular-nums">
        생성일시(목업) · {new Date(report.generatedAt).toLocaleString("ko-KR")}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <BulletBlock title="오늘 주요 작업" items={report.todayHighlights} />
        <BulletBlock title="이상 징후" items={report.anomalySignals} accent="border-amber-500/10 bg-amber-500/[0.04]" />
        <BulletBlock title="반복 문제" items={report.recurringIssues} />
        <BulletBlock title="센서/작업 연관성" items={report.sensorWorkCorrelations} />
        <BulletBlock title="AI 권장 조치" items={report.recommendedActions} accent="border-primary/15 bg-primary/[0.05]" />
        <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.05] p-3 md:p-4">
          <p className="sf-section-label mb-2">주의 필요 온실</p>
          <ul className="space-y-1">
            {report.greenhousesNeedingAttention.map((name) => (
              <li key={name} className="text-[13px] font-semibold text-rose-100/95">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
