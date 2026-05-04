"use client";

import { ListChecks } from "lucide-react";
import Link from "next/link";

import type { WorkInstruction } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function DashboardWorkStatusStrip({ work }: { work: WorkInstruction }) {
  const shell =
    work.status === "in-progress"
      ? "border-sky-400/35 bg-sky-500/[0.12] text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      : work.status === "pending"
        ? "border-amber-400/35 bg-amber-500/[0.12] text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : "border-white/[0.1] bg-white/[0.06] text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

  const dot =
    work.status === "in-progress"
      ? "bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.45)]"
      : work.status === "pending"
        ? "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.45)]"
        : "bg-emerald-400/80";

  return (
    <Link
      href="/work"
      className={cn(
        "flex w-full max-w-full items-center gap-1.5 rounded-full border px-2 py-1 transition-[background-color,border-color,transform] duration-200 active:scale-[0.99] md:gap-2 md:px-2.5 md:py-1",
        shell
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden />
      <ListChecks className="size-3 shrink-0 opacity-90 md:size-3.5" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-tight tracking-tight md:text-[12px]">
        <span className="text-current/85">{work.taskType}</span>
        <span className="text-current/45"> · </span>
        <span className="font-medium text-current/90">{work.instruction}</span>
      </span>
      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-current/50 md:text-[11px]">{work.dueDate}</span>
    </Link>
  );
}
