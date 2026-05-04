import type { ReactNode } from "react";

import { ControlCenterShell } from "@/components/control-center/control-center-shell";

export default function ControlCenterLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background">
      <ControlCenterShell>{children}</ControlCenterShell>
    </div>
  );
}
