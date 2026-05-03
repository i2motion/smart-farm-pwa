"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearMockSession, readFarmSession } from "@/lib/auth/session-client";

export function DashboardToolbar() {
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

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between dark:ring-white/10">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-md font-mono text-[11px]">
          <UserRound className="size-3.5" aria-hidden />
          {username ? username : "Operator"}
        </Badge>
        <span className="text-muted-foreground text-xs font-mono sm:text-sm">
          Session · mock gateway
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-md font-mono text-xs"
          type="button"
          onClick={switchUser}
        >
          Switch user
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-md font-mono text-xs"
          type="button"
          onClick={logout}
        >
          <LogOut className="size-3.5" aria-hidden />
          Log out
        </Button>
      </div>
    </div>
  );
}
