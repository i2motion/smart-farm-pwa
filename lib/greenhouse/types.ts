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

/** 온실 구동·스케줄 장비 구분 (목업) */
export type OperationKind = "irrigation" | "flowFan" | "hotAirBlower" | "sprayer" | "exhaustFan";

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
  /** 구동 출력 ON/OFF (목업) */
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
};
