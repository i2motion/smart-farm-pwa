"use client";

import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { clearMockSession } from "@/lib/auth/session-client";
import { cn } from "@/lib/utils";

const iconBtn =
  "size-10 shrink-0 touch-manipulation rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground md:size-9";

export function DashboardToolbar({ className }: { className?: string }) {
  const router = useRouter();

  function goLogin() {
    clearMockSession();
    router.replace("/login");
    router.refresh();
  }

  function goSetup() {
    router.push("/settings");
  }

  return (
    <div className={cn("flex shrink-0 flex-nowrap items-center justify-end gap-1.5 md:gap-2", className)}>
      <span
        className="mr-0.5 hidden max-w-[7rem] truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground lg:inline"
        title="목업 세션"
      >
        목업
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={iconBtn}
        title="설정 · 셋업 페이지로"
        aria-label="설정"
        onClick={goSetup}
      >
        <Settings className="size-[17px] stroke-[1] md:size-[18px]" aria-hidden />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={iconBtn}
        title="로그아웃 · 로그인 화면으로"
        aria-label="로그아웃"
        onClick={goLogin}
      >
        <LogOut className="size-[17px] stroke-[1] md:size-[18px]" aria-hidden />
      </Button>
    </div>
  );
}
