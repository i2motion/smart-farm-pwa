/**
 * Farm PC REST API — 요청/응답 DTO.
 * UI는 이 타입만 사용하고 PLC·장비와 직접 통신하지 않습니다.
 *
 * 향후 페이지 연동 시: 목업(`lib/.../mock-data`)과 병행할 때 이 DTO와 매핑하세요.
 */

import type { AlarmCondition, SensorKind } from "@/lib/greenhouse/types";

// --- 공통 ---

export type FarmApiErrorCode =
  | "network"
  | "timeout"
  | "aborted"
  | "http"
  | "parse"
  | "unknown";

/** API 연결 점검 결과 — UI 배너·설정에 표시용 */
export type FarmApiConnectionStatus = {
  ok: boolean;
  /** 점검 시각 (ISO 8601) */
  checkedAt: string;
  /** 성공 시 왕복 지연(ms), 실패 시 생략 */
  latencyMs?: number;
  /** 사용자에게 보여도 되는 한 줄 메시지(한국어) */
  message: string;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: FarmApiErrorPayload };

/** 네트워크 실패 시 로컬 목업 데이터로 대체했을 때 upstream 오류를 함께 전달 */
export type FarmDataSource<T> =
  | { source: "api"; data: T }
  | { source: "mock"; data: T; upstreamError: FarmApiErrorPayload };

export type FarmApiErrorPayload = {
  code: FarmApiErrorCode;
  /** UI 표시용(민감 정보 제외) */
  message: string;
  httpStatus?: number;
};

// --- Farm ---

export type FarmStatusDto = {
  farmId: string;
  name: string;
  /** ISO 8601 */
  updatedAt: string;
  overallHealth: "normal" | "warning" | "error";
  activeGreenhouseCount: number;
};

export type SystemStatusDto = {
  farmPcOnline: boolean;
  apiVersion: string;
  plcBridgeStatus: "connected" | "degraded" | "offline";
  /** 운영 메모 — 선택 */
  notice?: string;
};

export type GreenhouseSummaryDto = {
  id: string;
  name: string;
  crop: string;
  health: "normal" | "warning" | "error";
  mode: "AUTO" | "MANUAL";
};

// --- Greenhouse detail ---

export type GreenhouseStatusDto = {
  greenhouseId: string;
  name: string;
  mode: "AUTO" | "MANUAL";
  health: "normal" | "warning" | "error";
  /** 집계된 최신 센서 스냅샷 — 서버 스키마에 맞게 확장 */
  snapshot: Record<string, number | string | boolean | null>;
};

export type GreenhouseDetailDto = GreenhouseStatusDto & {
  crop: string;
  /** 확장 필드 — 트렌드·스케줄 요약 등 */
  meta?: Record<string, unknown>;
};

// --- Sensors ---

export type SensorReadingDto = {
  sensorId: string;
  greenhouseId: string;
  kind: string;
  value: number;
  unit: string;
  /** ISO 8601 */
  measuredAt: string;
};

export type SensorHistoryRange = "1h" | "24h" | "7d" | "30d";

export type SensorHistoryPointDto = {
  t: string;
  value: number;
};

export type SensorHistoryDto = {
  sensorId: string;
  range: SensorHistoryRange;
  points: SensorHistoryPointDto[];
};

// --- Sensor alarm rules (Farm PC에 저장되는 규칙 — UI SensorAlarmRule과 매핑) ---

export type SensorAlarmRuleCreateDto = {
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

export type SensorAlarmRuleUpdateDto = Partial<SensorAlarmRuleCreateDto>;

export type SensorAlarmRuleDto = SensorAlarmRuleCreateDto & {
  id: string;
};

// --- Devices / control ---
/**
 * SAFETY:
 * - 이 DTO로 나가는 명령은 모두 Farm PC가 PLC로 중계합니다.
 * - UI에서 확인 다이얼로그 없이 호출하지 마세요.
 * - 영양액 공급·히터 등은 고위험 — 반드시 사용자 확인 후 호출.
 */

export type GreenhouseControlMode = "AUTO" | "MANUAL";

export type DeviceFleetStatusDto = {
  updatedAt: string;
  greenhouses: {
    greenhouseId: string;
    mode: GreenhouseControlMode;
    irrigationOn: boolean;
    nutrientSupplyActive: boolean;
    skylightOpenPct: number;
    sideWindowOpenPct: number;
    circulationFanOn: boolean;
    heaterOn: boolean;
    sprayerOn: boolean;
  }[];
};

export type NutrientSupplyRequestDto = {
  targetGreenhouseIds: string[];
};

export type CommandAcceptedDto = {
  requestId: string;
  accepted: boolean;
  message?: string;
};

// --- Nutrient ---

export type NutrientSystemStatusDto = {
  online: boolean;
  activeRecipeId: string | null;
  supplyActive: boolean;
  lastMixAt: string | null;
};

export type NutrientRecipeDto = {
  id: string;
  name: string;
  ecTarget: number;
  phTarget: number;
};

export type NutrientHistoryEntryDto = {
  id: string;
  at: string;
  recipeId: string;
  summary: string;
};

// --- Alarms (farm-wide list / acknowledge) ---

export type FarmAlarmDto = {
  id: string;
  /** ISO 8601 */
  occurredAt: string;
  greenhouseId: string;
  greenhouseName: string;
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  acknowledged: boolean;
};

export type AlarmRuleDto = {
  id: string;
  name: string;
  scope: string;
  enabled: boolean;
  conditionSummary: string;
};

export type AlarmRuleWriteDto = {
  name: string;
  scope: string;
  enabled: boolean;
  conditionSummary: string;
};

// --- Work / diary / AI drafts ---

export type WorkInstructionDto = {
  id: string;
  dueDate: string;
  greenhouseName: string;
  taskType: string;
  instruction: string;
  status: "pending" | "in-progress" | "done";
};

export type FarmDiaryWriteDto = {
  date: string;
  time: string;
  greenhouseId: string;
  crop: string;
  workType: string;
  description: string;
  operator: string;
  importance: "low" | "normal" | "high" | "urgent";
};

export type FarmDiaryEntryDto = FarmDiaryWriteDto & {
  id: string;
  createdAt: string;
};

export type AIOperationReportDto = {
  id: string;
  generatedAt: string;
  highlights: string[];
};

export type ControlOrderDraftDto = {
  id: string;
  status: "draft" | "approved" | "on_hold" | "rejected" | "superseded";
  targetGreenhouseId: string;
  proposedCommand: string;
  reason: string;
};

/**
 * SAFETY: AI 초안 승인은 사람만 수행. 승인 API가 PLC를 직접 때리지 않도록
 * 서버에서도 가드해야 하며, 클라이언트는 실행 트리거를 호출하지 않습니다.
 */

// --- Cameras (추후) ---

export type CameraSummaryDto = {
  id: string;
  name: string;
  greenhouseId: string;
  online: boolean;
};

export type CameraStatusDto = CameraSummaryDto & {
  streaming: boolean;
  lastFrameAt: string | null;
};
