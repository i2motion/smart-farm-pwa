import type { FarmDiaryPhotoAttachment } from "./types";

export function createPhotoAttachment(file: File): FarmDiaryPhotoAttachment {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? `ph-${crypto.randomUUID()}`
      : `ph-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    previewUrl: URL.createObjectURL(file),
    fileName: file.name,
    /** 향후 비전 파이프라인 확장용 훅 (현재 UI 미표시) */
    futurePipeline: {
      imageAnalysisEligible: true,
      diseaseDetectionEligible: true,
      cropGrowthEligible: true,
    },
  };
}

export function revokePhotoPreview(photo: Pick<FarmDiaryPhotoAttachment, "previewUrl">) {
  try {
    URL.revokeObjectURL(photo.previewUrl);
  } catch {
    /* noop */
  }
}
