"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearMockSession, readFarmSession } from "@/lib/auth/session-client";
import { cn } from "@/lib/utils";

export function DashboardToolbar({ className }: { className?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(readFarmSession()?.username ?? null);
  }, []);

  function logout() {
    clearMockSession();
    router.replace("/login");
    router.refresh();
  }

  function switchUser() {
    clearMockSession();
    router.replace("/login");
    router.refresh();
  }

  const display = username ?? "운영자";

  return (
    <div className={cn("flex w-full items-center justify-end gap-1 md:w-auto md:gap-2 lg:gap-2", className)}>
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
        className="size-10 shrink-0 touch-manipulation rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground md:size-9"
        title={display}
        aria-label={`프로필 · ${display}`}
      >
        <UserRound className="size-[17px] stroke-[1] md:size-[18px]" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="hidden h-8 rounded-full px-3 text-[13px] font-semibold text-muted-foreground hover:bg-white/[0.06] hover:text-foreground sm:inline-flex md:h-9 md:px-3.5 md:text-[14px]"
        onClick={switchUser}
      >
        전환
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-10 shrink-0 touch-manipulation rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground md:size-9"
        title="로그아웃"
        aria-label="로그아웃"
        onClick={logout}
      >
        <LogOut className="size-[17px] stroke-[1] md:size-[18px]" aria-hidden />
      </Button>
    </div>
  );
}
