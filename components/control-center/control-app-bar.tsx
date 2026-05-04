"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardAlarmStatusStrip } from "@/components/dashboard/dashboard-alarm-status-strip";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { MOCK_FARM_META, MOCK_LATEST_ALARM } from "@/lib/dashboard/mock-data";

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function formatShortDate(d: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(d);
}

export function ControlAppBar() {
  const pathname = usePathname();
  const showDashboardAlarm = pathname === "/dashboard";
  const [, setMinuteTick] = useState(0);

  useEffect(() => {
    const bump = () => setMinuteTick((n) => n + 1);
    const msIntoMinute = new Date().getSeconds() * 1000 + new Date().getMilliseconds();
    const untilNextMinute = 60_000 - msIntoMinute;
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      bump();
      intervalId = window.setInterval(bump, 60_000);
    }, untilNextMinute);
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  const now = new Date();
  const timeStr = formatTime(now);
  const dateStr = formatShortDate(now);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] flex-row items-center justify-between gap-2 px-2 py-1 md:gap-3 md:px-6 md:py-2.5 lg:gap-4 lg:px-8 lg:py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:gap-5 lg:gap-6">
            <Link
              href="/dashboard"
              className="flex min-h-8 w-fit max-w-full touch-manipulation items-center text-[15px] font-semibold leading-none tracking-tight text-foreground transition-colors duration-200 hover:text-primary active:opacity-90 md:min-h-0 md:text-[18px] lg:text-[17px]"
            >
              {MOCK_FARM_META.farmName}
            </Link>
            <div className="flex min-w-0 w-full items-baseline gap-1.5 md:w-auto md:max-w-none md:flex-col md:items-start md:gap-0.5">
              <time
                className="text-[1.5rem] font-extralight tabular-nums leading-none tracking-tight text-foreground md:text-[2.125rem] lg:text-[1.85rem]"
                dateTime={now.toISOString()}
                suppressHydrationWarning
              >
                {timeStr}
              </time>
              <span
                className="text-[11px] font-medium leading-tight text-muted-foreground md:text-[13px] md:tracking-wide"
                suppressHydrationWarning
              >
                {dateStr}
              </span>
            </div>
          </div>
          <DashboardToolbar />
        </div>
        {showDashboardAlarm ? (
          <div className="border-t border-white/[0.05] bg-black/15 px-2 py-1 md:px-6 md:py-1.5 lg:px-8">
            <DashboardAlarmStatusStrip alarm={MOCK_LATEST_ALARM} />
          </div>
        ) : null}
      </header>
    </>
  );
}
