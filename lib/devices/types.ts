import type { ControlMode, HealthLevel } from "@/lib/dashboard/types";

/** Per-greenhouse actuator + mode snapshot for the Devices control center (mock). */
export type GreenhouseDeviceRow = {
  zoneId: string;
  zoneName: string;
  crop: string;
  healthStatus: HealthLevel;
  mode: ControlMode;
  irrigationOn: boolean;
  skylightOpen: boolean;
  sideWindowOpen: boolean;
  flowFanOn: boolean;
  hotAirBlowerOn: boolean;
  sprayerOn: boolean;
  /** ISO 8601 — last local mock command */
  lastCommandAt: string | null;
  lastCommandSummary: string;
};

export type DeviceActuatorKey =
  | "irrigationOn"
  | "skylightOpen"
  | "sideWindowOpen"
  | "flowFanOn"
  | "hotAirBlowerOn"
  | "sprayerOn";
