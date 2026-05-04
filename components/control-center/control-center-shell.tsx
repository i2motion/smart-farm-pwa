"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { ControlAppBar } from "@/components/control-center/control-app-bar";
import { ControlMobileStripNav } from "@/components/control-center/control-mobile-strip-nav";

export function ControlCenterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideDashboardTabs = pathname === "/dashboard";

  return (
    <div className="min-h-dvh bg-background">
      <ControlAppBar />

      {!hideDashboardTabs ? (
        <div className="border-b border-white/[0.08] bg-white/[0.05] px-2 py-1.5 backdrop-blur-md md:px-3 md:py-2.5 lg:hidden">
          <ControlMobileStripNav />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1600px] flex-1 px-2 py-1 md:px-6 md:py-5 lg:px-10 lg:py-5 xl:py-6">
        {children}
      </div>
    </div>
  );
}
