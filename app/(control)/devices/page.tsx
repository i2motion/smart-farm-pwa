import type { Metadata } from "next";

import { FleetDeviceControls } from "@/components/devices/fleet-device-controls";

export const metadata: Metadata = {
  title: "장비",
};

export default function DevicesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">장비</h1>
        <p className="text-muted-foreground mt-1 max-w-prose text-sm">
          시설 단위 구동기·릴레이 — 목업 제어만. PLC·MQTT 미연결.
        </p>
      </div>
      <FleetDeviceControls />
    </div>
  );
}
