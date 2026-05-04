"use client";

import { GreenhouseDetailShell } from "@/components/greenhouse/greenhouse-detail-shell";
import type { GreenhouseZone } from "@/lib/dashboard/types";

export function GreenhouseDetailView({ zone }: { zone: GreenhouseZone }) {
  return <GreenhouseDetailShell zone={zone} />;
}
