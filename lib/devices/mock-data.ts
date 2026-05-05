import { MOCK_GREENHOUSE_FAN_ACTUATORS, MOCK_GREENHOUSES } from "@/lib/dashboard/mock-data";

import type { GreenhouseDeviceRow } from "./types";

/** Initial fleet rows from dashboard mock greenhouses + fan/sprayer actuators. */
export function buildInitialDeviceRows(): GreenhouseDeviceRow[] {
  return MOCK_GREENHOUSES.map((z) => {
    const act =
      MOCK_GREENHOUSE_FAN_ACTUATORS[z.id] ?? {
        flowFan: false,
        hotAirBlower: false,
        exhaustFan: false,
        sprayer: false,
      };
    return {
      zoneId: z.id,
      zoneName: z.name,
      crop: z.crop,
      healthStatus: z.healthStatus,
      mode: z.mode,
      irrigationOn: z.irrigationRunning,
      skylightOpen: z.skylightOpen,
      sideWindowOpen: z.sideWindowOpen,
      thermalCurtainOpen: z.thermalCurtainOpen,
      flowFanOn: act.flowFan,
      hotAirBlowerOn: act.hotAirBlower,
      sprayerOn: act.sprayer,
      lastCommandAt: null,
      lastCommandSummary: "—",
    };
  });
}
