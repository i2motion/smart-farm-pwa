"use client";

import { Badge } from "@/components/ui/badge";
import type { AlarmRule } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function AlarmRulesSection({ rules }: { rules: AlarmRule[] }) {
  return (
    <section className="sf-surface rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md md:p-5" aria-labelledby="alarm-rules-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="alarm-rules-heading" className="text-[15px] font-semibold tracking-tight text-foreground">
            알람 규칙
          </h2>
          <p className="text-muted-foreground mt-1 text-[12px] leading-relaxed">
            임계·지속 조건 목업입니다. 서버 연동 후 편집·저장됩니다.
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {rules.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-foreground">{r.name}</p>
              <p className="text-muted-foreground text-[11px]">{r.scopeLabel}</p>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                {r.sensorLabel} · {r.conditionSummary}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 self-start sm:self-center",
                r.enabled ? "border-primary/30 bg-primary/10 text-primary" : "border-white/[0.1] text-muted-foreground"
              )}
            >
              {r.enabled ? "사용" : "비활성"}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
