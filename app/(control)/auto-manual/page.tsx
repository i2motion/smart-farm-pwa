import type { Metadata } from "next";
import Link from "next/link";

import { AutoManualPanel } from "@/components/auto-manual/auto-manual-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "자동/수동",
};

export default function AutoManualPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">자동/수동</h1>
          <p className="text-muted-foreground mt-1 max-w-prose text-sm">
            상위 모드·스케줄·자동화 규칙 — 커미셔닝용 목업 UI입니다.
          </p>
        </div>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 rounded-full text-xs")}
        >
          대시보드
        </Link>
      </div>
      <AutoManualPanel />
    </div>
  );
}
