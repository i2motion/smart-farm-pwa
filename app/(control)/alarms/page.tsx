import type { Metadata } from "next";
import Link from "next/link";

import { AlarmRulesSection } from "@/components/alarms/alarm-rules-section";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_ALARM_RULES, MOCK_ALARMS } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "알람",
};

export default function AlarmsPage() {
  return (
    <div className="mx-auto max-w-[720px] space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sf-page-title">알람</h1>
          <p className="sf-page-sub">목록과 규칙 요약만 표시합니다. 상세 규칙 편집은 연동 후 제공됩니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl")}>
            대시보드
          </Link>
        </div>
      </div>
      <RecentAlarms alarms={MOCK_ALARMS} scrollClassName="max-h-[min(50vh,420px)] overflow-y-auto" />
      <AlarmRulesSection rules={MOCK_ALARM_RULES} />
    </div>
  );
}
