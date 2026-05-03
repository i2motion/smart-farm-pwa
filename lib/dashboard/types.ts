export type AlarmSeverity = "info" | "warning" | "error";

export type WorkInstructionStatus = "pending" | "in-progress" | "done";

export type ControlMode = "AUTO" | "MANUAL";

export type FarmAlarm = {
  id: string;
  time: string;
  greenhouseName: string;
  alarmType: string;
  severity: AlarmSeverity;
  message: string;
};

export type WorkInstruction = {
  id: string;
  dueDate: string;
  greenhouseName: string;
  taskType: string;
  instruction: string;
  status: WorkInstructionStatus;
};

export type WeatherDay = {
  id: string;
  label: string;
  condition: string;
  highC: number;
  lowC: number;
  precipPct: number;
  windMs: number;
};

export type ClimateSensor = {
  id: string;
  name: string;
  location: string;
  tempC: number;
  humidityPct: number;
  dewpointC: number;
  batteryPct: number;
};

export type GreenhouseZone = {
  id: string;
  name: string;
  crop: string;
  tempC: number;
  humidityPct: number;
  soilPct: number;
  status: string;
  mode: ControlMode;
};
