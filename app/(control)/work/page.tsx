import type { Metadata } from "next";
import Link from "next/link";

import { WorkInstructions } from "@/components/dashboard/work-instructions";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_WORK_INSTRUCTIONS } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "작업",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sf-page-title">작업</h1>
          <p className="sf-page-sub">지시·점검 작업 목록 · 목업</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl")}>
            대시보드
          </Link>
        </div>
      </div>
      <WorkInstructions items={MOCK_WORK_INSTRUCTIONS} scrollClassName="max-h-[min(70vh,520px)] overflow-y-auto" />
    </div>
  );
}
