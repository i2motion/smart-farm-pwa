import type { Metadata } from "next";
import Link from "next/link";

import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_ALARMS } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "알람",
};

export default function AlarmsPage() {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sf-page-title">알람</h1>
          <p className="sf-page-sub">미처리·최근 알람 목록 · 목업</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl")}>
            대시보드
          </Link>
        </div>
      </div>
      <RecentAlarms alarms={MOCK_ALARMS} scrollClassName="max-h-[min(70vh,520px)] overflow-y-auto" />
    </div>
  );
}
