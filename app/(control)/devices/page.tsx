import type { Metadata } from "next";

import { DevicesPageShell } from "@/components/devices/devices-page-shell";

export const metadata: Metadata = {
  title: "장비",
};

export default function DevicesPage() {
  return <DevicesPageShell />;
}
