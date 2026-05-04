"use client";

import type { ReactNode } from "react";

import { ControlAppBar } from "@/components/control-center/control-app-bar";

export function ControlCenterShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <ControlAppBar />

      <div className="mx-auto w-full max-w-[1600px] flex-1 px-2 py-1 md:px-6 md:py-5 lg:px-10 lg:py-5 xl:py-6">
        {children}
      </div>
    </div>
  );
}
