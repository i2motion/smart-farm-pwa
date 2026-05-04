"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WorkInstruction, WorkInstructionStatus } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: WorkInstructionStatus }) {
  const map: Record<
    WorkInstructionStatus,
    { label: string; className: string }
  > = {
    pending: {
      label: "대기",
      className:
        "border-border/70 bg-muted/40 text-muted-foreground",
    },
    "in-progress": {
      label: "진행",
      className: "border-primary/25 bg-primary/8 text-primary",
    },
    done: {
      label: "완료",
      className:
        "border-emerald-600/25 bg-emerald-600/[0.08] text-emerald-900 dark:text-emerald-100",
    },
  };
  const cfg = map[status];
  return (
    <Badge variant="outline" className={cn("rounded-md px-1.5 py-0 text-[10px] font-medium", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}

export function WorkInstructions({
  items,
  className,
  scrollClassName,
}: {
  items: WorkInstruction[];
  className?: string;
  scrollClassName?: string;
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">작업 지시</CardTitle>
        <CardDescription className="text-xs">
          운영 큐 · {items.length}건(목업)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className={cn(
            "flex flex-col gap-2 px-3 pb-3 overscroll-contain",
            scrollClassName ??
              "max-h-[340px] overflow-y-auto lg:max-h-[42vh]"
          )}
        >
          {items.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-border/55 bg-muted/15 p-3 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-muted-foreground text-[11px] font-medium">{task.taskType}</p>
                  <p className="truncate text-xs font-semibold">{task.greenhouseName}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-muted-foreground mt-2 line-clamp-3 text-[13px] leading-snug">
                {task.instruction}
              </p>
              <div className="text-muted-foreground mt-2 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[11px] tabular-nums">
                <span>마감</span>
                <span>{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
