import type {
  ClimateSensor,
  FarmAlarm,
  GreenhouseZone,
  WeatherDay,
  WorkInstruction,
} from "./types";

export const MOCK_SUMMARY = {
  openAlarms: { critical: 1, warning: 3, info: 5 },
  avgGreenhouseTempC: 22.8,
  irrigationQueuedZones: 3,
  gatewayStatus: "ONLINE" as const,
  lastPlcPollMs: 480,
};

export type FarmSummarySnapshot = typeof MOCK_SUMMARY;

export const MOCK_WEATHER: WeatherDay[] = [
  {
    id: "d1",
    label: "Sun · Today",
    condition: "Partly cloudy",
    highC: 18,
    lowC: 12,
    precipPct: 20,
    windMs: 4.2,
  },
  {
    id: "d2",
    label: "Mon",
    condition: "Light rain",
    highC: 16,
    lowC: 11,
    precipPct: 65,
    windMs: 5.8,
  },
  {
    id: "d3",
    label: "Tue",
    condition: "Clear",
    highC: 19,
    lowC: 10,
    precipPct: 5,
    windMs: 3.1,
  },
];

export const MOCK_CLIMATE_SENSORS: ClimateSensor[] = [
  {
    id: "met-north",
    name: "MET-01 · Field mast",
    location: "North perimeter · 6 m AGL",
    tempC: 17.4,
    humidityPct: 74,
    dewpointC: 12.6,
    batteryPct: 92,
  },
  {
    id: "canopy-south",
    name: "CAN-02 · Canopy probe",
    location: "South greenhouse ridge · GH-02",
    tempC: 24.9,
    humidityPct: 61,
    dewpointC: 16.2,
    batteryPct: 88,
  },
];

export const MOCK_GREENHOUSES: GreenhouseZone[] = [
  {
    id: "gh-01",
    name: "GH-01 · Head house",
    crop: "Vitamin greens · Week 6",
    tempC: 21.8,
    humidityPct: 68,
    soilPct: 54,
    status: "Stable",
    mode: "AUTO",
  },
  {
    id: "gh-02",
    name: "GH-02 · Tomato bay",
    crop: "Cherry tomato · Week 11",
    tempC: 25.2,
    humidityPct: 58,
    soilPct: 71,
    status: "Stable",
    mode: "MANUAL",
  },
  {
    id: "gh-03",
    name: "GH-03 · Strawberry tables",
    crop: "Day-neutral · Flower",
    tempC: 19.6,
    humidityPct: 76,
    soilPct: 62,
    status: "Watch RH",
    mode: "AUTO",
  },
  {
    id: "gh-04",
    name: "GH-04 · Propagation",
    crop: "Seedlings · Mist cycle",
    tempC: 23.4,
    humidityPct: 82,
    soilPct: 88,
    status: "Misting",
    mode: "AUTO",
  },
  {
    id: "gh-05",
    name: "GH-05 · NFT lettuce",
    crop: "Butter lettuce · Week 5",
    tempC: 20.1,
    humidityPct: 72,
    soilPct: 49,
    status: "Low flow",
    mode: "MANUAL",
  },
  {
    id: "gh-06",
    name: "GH-06 · Herbs",
    crop: "Basil / cilantro · Harvest",
    tempC: 22.0,
    humidityPct: 64,
    soilPct: 66,
    status: "Stable",
    mode: "AUTO",
  },
  {
    id: "gh-07",
    name: "GH-07 · R&D canopy",
    crop: "Trials · DLI map",
    tempC: 24.0,
    humidityPct: 59,
    soilPct: 55,
    status: "Calibrating",
    mode: "MANUAL",
  },
];

export const MOCK_ALARMS: FarmAlarm[] = [
  {
    id: "a1",
    time: "14:32",
    greenhouseName: "GH-05 · NFT lettuce",
    alarmType: "Irrigation",
    severity: "warning",
    message: "Flow rate 18% below setpoint for valve CV-12 (15 min avg).",
  },
  {
    id: "a2",
    time: "13:58",
    greenhouseName: "GH-02 · Tomato bay",
    alarmType: "Sensor drift",
    severity: "info",
    message: "Humidity probe H-204 offset +2.1% vs. reference — schedule calibration.",
  },
  {
    id: "a3",
    time: "11:06",
    greenhouseName: "GH-07 · R&D canopy",
    alarmType: "Threshold",
    severity: "error",
    message: "Canopy temp 28.4°C exceeded high limit 27.5°C for 6 minutes.",
  },
  {
    id: "a4",
    time: "09:41",
    greenhouseName: "GH-03 · Strawberry tables",
    alarmType: "Camera",
    severity: "warning",
    message: "North row camera RTSP timeout — last frame 09:38.",
  },
  {
    id: "a5",
    time: "08:12",
    greenhouseName: "Site · Utility",
    alarmType: "Power",
    severity: "info",
    message: "B-phase current transient 1.8 s — genset stayed offline (logged).",
  },
];

export const MOCK_WORK_INSTRUCTIONS: WorkInstruction[] = [
  {
    id: "w1",
    dueDate: "2026-05-04",
    greenhouseName: "GH-05 · NFT lettuce",
    taskType: "Irrigation check",
    instruction:
      "Verify filter pressure, inspect drippers on rows C–D, confirm EC after flush.",
    status: "in-progress",
  },
  {
    id: "w2",
    dueDate: "2026-05-04",
    greenhouseName: "GH-02 · Tomato bay",
    taskType: "Fertilizer schedule",
    instruction: "Confirm stock tank B dosing; log pH target 5.8–6.2 for channel 2.",
    status: "pending",
  },
  {
    id: "w3",
    dueDate: "2026-05-05",
    greenhouseName: "GH-03 · Strawberry tables",
    taskType: "Camera inspection",
    instruction:
      "Clean IR domes on CAM-103/104; verify NTP sync and focus on row markers.",
    status: "pending",
  },
  {
    id: "w4",
    dueDate: "2026-05-05",
    greenhouseName: "GH-01 · Head house",
    taskType: "Ventilation check",
    instruction:
      "Measure inlet velocity at louver L1–L3; compare to BMS PID output 40–65%.",
    status: "pending",
  },
  {
    id: "w5",
    dueDate: "2026-05-06",
    greenhouseName: "GH-06 · Herbs",
    taskType: "Pest inspection",
    instruction:
      "Yellow sticky review + release row photos; escalate if thrips count > threshold.",
    status: "done",
  },
];
