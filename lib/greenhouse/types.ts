/** 온실 상세 — 센서·알람·스케줄·추세(목업) */

export type SensorKind =
  | "temp"
  | "humidity"
  | "rain"
  | "wind"
  | "soilMoisture"
  | "soilTemp"
  | "ec"
  | "ph";

export type AlarmCondition = "above" | "below" | "equalOrBelow";

export type TrendRange = "1d" | "1w" | "1m";

/** 추세 차트 지표(알람 `SensorKind`와 별도 — 일사량 등) */
export type TrendMetricKind = "temp" | "humidity" | "soilMoisture" | "soilTemp" | "ec" | "ph" | "solar";

/** 온실 구동·스케줄 장비 구분 (목업) */
export type OperationKind =
  | "irrigation"
  | "skylight"
  | "sideWindow"
  | "flowFan"
  | "hotAirBlower"
  | "sprayer"
  | "exhaustFan";

export type SensorAlarmRule = {
  id: string;
  greenhouseId: string;
  sensorKind: SensorKind;
  alarmName: string;
  setValue: number;
  condition: AlarmCondition;
  enabled: boolean;
  notifyIntervalMin: number;
  dndRange: string;
  repeatCount: number;
};

export type OperationSchedule = {
  id: string;
  greenhouseId: string;
  kind: OperationKind;
  /** 스케줄 표시명(센서 알람명과 동일 역할) */
  name: string;
  /** 구동 출력 ON/OFF (목업, 등록된 스케줄별) */
  driveOn: boolean;
  startTime: string;
  endTime: string;
  durationMin: number;
  repeat: string;
  /** 스케줄 사용 여부 */
  enabled: boolean;
};

export type GreenhouseSensorSnapshot = {
  tempC: number;
  humidityPct: number;
  rainMm: number;
  windMs: number;
  soilMoisturePct: number;
  soilTempC: number;
  ecMScm: number;
  ph: number;
  /** 일사량 목업 (W/m²) */
  solarWm2: number;
};
