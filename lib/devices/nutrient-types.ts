/**
 * 중앙 양액 — 감독(supervisory) 화면용 타입 (목업).
 * 상세 EC/pH 제어·펌프 시퀀스·인터록 등은 양액 PLC / 현장 HMI에만 둡니다.
 */

export type NutrientOperatingMode = "AUTO" | "MANUAL";

export type NutrientPlcConnection = "connected" | "degraded" | "disconnected";

export type NutrientSystemStatus = "idle" | "supplying" | "alarm" | "degraded";

export type NutrientRecipeOption = {
  id: string;
  /** 한글 표시명 */
  label: string;
};

/** 최근 공급 이력 한 건 (PLC가 보고하는 요약 — 목업) */
export type NutrientSupplyHistoryEntry = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  durationMin: number;
  recipeLabel: string;
  targetSummary: string;
};

/** GET /nutrient/status 등으로 치환할 감독용 상태 */
export type NutrientSolutionState = {
  mode: NutrientOperatingMode;
  /** 공급 중 여부(PLC 보고 값 목업) */
  supplyActive: boolean;
  plcConnection: NutrientPlcConnection;
  systemStatus: NutrientSystemStatus;
  /** 양액 상태 타일용 한 줄 설명 */
  systemStatusLabel: string;
  currentEcMScm: number;
  currentPh: number;
  /** 사전 정의 레시피 선택(웹은 요청만; 실행은 PLC) */
  selectedRecipeId: string;
  targetZones: { id: string; label: string }[];
  /** 마지막으로 완료된 공급 시각(목업) */
  lastCompletedSupplyAt: string | null;
  /** 현재 공급 세션 시작 시각(목업; 중지 시 이력에 반영) */
  supplySessionStartedAt: string | null;
  supplyHistory: NutrientSupplyHistoryEntry[];
};
