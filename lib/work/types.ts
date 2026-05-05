/** Farm Diary & AI-assisted control (mock / future API) */

export type WorkType =
  | "irrigation"
  | "fertilizer"
  | "pestControl"
  | "harvest"
  | "pruning"
  | "inspection"
  | "diseasePest"
  | "anomaly"
  | "other";

export type DiaryImportance = "low" | "normal" | "high" | "urgent";

/** 세션 내 미리보기용 blob URL (목업). 저장소 업로드 후 CDN URL 등으로 대체 예정 */
export type FarmDiaryPhotoAttachment = {
  id: string;
  previewUrl: string;
  fileName?: string;
  /**
   * 향후: 일반 이미지 분석 · 병해충 · 생육 분석 라우팅용 플래그 (현재 목업만 저장)
   */
  futurePipeline?: {
    imageAnalysisEligible?: boolean;
    diseaseDetectionEligible?: boolean;
    cropGrowthEligible?: boolean;
  };
};

export type FarmDiaryEntry = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  greenhouseId: string;
  greenhouseName: string;
  crop: string;
  workType: WorkType;
  /** 작업 내용 */
  description: string;
  operator: string;
  /** 첨부 사진 (목업 로컬 blob 미리보기) */
  photos: FarmDiaryPhotoAttachment[];
  /** 레거시 안내 문구 — `photos` 가 비어 있을 때만 참고 */
  photoPlaceholderNote?: string;
  relatedSensorIds: string[];
  relatedSensorLabels: string[];
  relatedEquipmentIds: string[];
  relatedEquipmentLabels: string[];
  importance: DiaryImportance;
  /** AI 분석 파이프라인 포함 여부 (향후) */
  aiAnalysisTarget: boolean;
  createdAt: string;
};

export type AIReport = {
  id: string;
  generatedAt: string;
  todayHighlights: string[];
  anomalySignals: string[];
  recurringIssues: string[];
  sensorWorkCorrelations: string[];
  recommendedActions: string[];
  greenhousesNeedingAttention: string[];
};

/** 초안만 존재 — 사람 승인 전까지 실행 불가 (PLC 직접 제어 없음) */
export type ControlOrderStatus = "draft" | "approved" | "on_hold" | "rejected" | "superseded";

export type ControlOrderRiskLevel = "low" | "medium" | "high" | "critical";

export type ControlOrderDraft = {
  id: string;
  targetGreenhouseId: string;
  targetGreenhouseName: string;
  targetEquipment: string;
  proposedCommand: string;
  reason: string;
  relatedDiaryEntryIds: string[];
  relatedSensorSnapshot: string;
  riskLevel: ControlOrderRiskLevel;
  status: ControlOrderStatus;
  lastActionAt: string | null;
  lastActionSummary: string | null;
};
