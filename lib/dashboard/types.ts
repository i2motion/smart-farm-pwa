export type AlarmSeverity = "info" | "warning" | "error";

export type WorkInstructionStatus = "pending" | "in-progress" | "done";

export type ControlMode = "AUTO" | "MANUAL";

export type HealthLevel = "normal" | "warning" | "error";

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
  /** 실외 상대습도(예보·추정). 센서 습도와 비교용 */
  humidityPct?: number;
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
  /** 풍속 m/s */
  windMs: number;
  /** 풍향 (한글 라벨) */
  windDirLabel: string;
  /** 일사량 W/m² */
  solarRadiationWm2: number;
};

/** IP/edge camera row for Cameras page (mock / future API) */
export type CameraStatus = "online" | "degraded" | "offline";

export type FarmCamera = {
  id: string;
  name: string;
  status: CameraStatus;
  resolution: string;
  /** AI / vision pipeline summary label */
  aiLabel: string;
  /** 대시보드·목록용 정적 플레이스홀더 (`/public` 경로) */
  imageUrl: string;
};

export type GreenhouseZone = {
  id: string;
  name: string;
  crop: string;
  tempC: number;
  humidityPct: number;
  soilPct: number;
  /** Legacy label — prefer `healthStatus` for UI badge */
  status: string;
  mode: ControlMode;
  healthStatus: HealthLevel;
  irrigationRunning: boolean;
  /** 천창 좌·우 (개별) */
  skylightLeftOpen: boolean;
  skylightRightOpen: boolean;
  /** 측창 좌·우 (동별로 UI에서 일부만 표시) */
  sideWindowLeftOpen: boolean;
  sideWindowRightOpen: boolean;
  /** 천창 하나라도 열림 — 카드·구동 요약 호환 */
  skylightOpen: boolean;
  /** 측창 하나라도 열림 — 카드·구동 요약 호환 */
  sideWindowOpen: boolean;
};

/** Edge / gateway health (mock) */
export type FarmConnectivity = {
  serverStatus: "online" | "degraded" | "offline";
  wifiLabel: string;
  /** 0–3 for simple icon */
  wifiBars: 0 | 1 | 2 | 3;
};

export type WeatherHourlySlot = {
  time: string;
  tempC: number;
  precipPct: number;
  windMs: number;
};

export type WeatherDayHourly = {
  id: string;
  label: string;
  condition: string;
  hours: WeatherHourlySlot[];
};
