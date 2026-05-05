/**
 * 작업지시·영농일지·AI 보고·제어 초안(승인 워크플로) API.
 *
 * SAFETY:
 * - AI 제어 초안(`ControlOrderDraft`)은 **승인 API만** 호출합니다. 실행 명령은 서버가 PLC로 보내며
 *   클라이언트에서 직접 PLC 동작을 트리거하지 않습니다.
 * - `approveControlOrderDraft`도 사람 승인 절차 후에만 호출.
 *
 * 향후 UI 연동:
 * - `work-page-shell.tsx`: 작업지시·일지·AI 보고·초안 목록
 * - `farm-diary-form.tsx` 저장: `createFarmDiaryEntry` / 수정·삭제
 * - `control-order-drafts.tsx`: 승인/보류/거부
 */

import { farmRequest } from "@/lib/api/api-client";
import type {
  AIOperationReportDto,
  ApiResult,
  ControlOrderDraftDto,
  FarmDiaryEntryDto,
  FarmDiaryWriteDto,
  WorkInstructionDto,
} from "@/lib/api/types";

export async function getWorkInstructions(): Promise<ApiResult<WorkInstructionDto[]>> {
  return farmRequest<WorkInstructionDto[]>("/v1/work/instructions", { method: "GET" });
}

export async function getFarmDiary(): Promise<ApiResult<FarmDiaryEntryDto[]>> {
  return farmRequest<FarmDiaryEntryDto[]>("/v1/farm-diary", { method: "GET" });
}

export async function createFarmDiaryEntry(data: FarmDiaryWriteDto): Promise<ApiResult<FarmDiaryEntryDto>> {
  return farmRequest<FarmDiaryEntryDto>("/v1/farm-diary", {
    method: "POST",
    jsonBody: { ...data },
  });
}

export async function updateFarmDiaryEntry(
  id: string,
  data: Partial<FarmDiaryWriteDto>
): Promise<ApiResult<FarmDiaryEntryDto>> {
  return farmRequest<FarmDiaryEntryDto>(`/v1/farm-diary/${encodeURIComponent(id)}`, {
    method: "PATCH",
    jsonBody: { ...data },
  });
}

export async function deleteFarmDiaryEntry(id: string): Promise<ApiResult<void>> {
  return farmRequest<void>(`/v1/farm-diary/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getAIOperationReport(): Promise<ApiResult<AIOperationReportDto>> {
  return farmRequest<AIOperationReportDto>("/v1/ai/operation-report", { method: "GET" });
}

export async function getControlOrderDrafts(): Promise<ApiResult<ControlOrderDraftDto[]>> {
  return farmRequest<ControlOrderDraftDto[]>("/v1/control-orders/drafts", { method: "GET" });
}

/** 사람 승인 후에만 — PLC 직접 실행 아님 */
export async function approveControlOrderDraft(id: string): Promise<ApiResult<ControlOrderDraftDto>> {
  return farmRequest<ControlOrderDraftDto>(`/v1/control-orders/drafts/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    jsonBody: {},
  });
}

export async function holdControlOrderDraft(id: string): Promise<ApiResult<ControlOrderDraftDto>> {
  return farmRequest<ControlOrderDraftDto>(`/v1/control-orders/drafts/${encodeURIComponent(id)}/hold`, {
    method: "POST",
    jsonBody: {},
  });
}

export async function rejectControlOrderDraft(id: string): Promise<ApiResult<ControlOrderDraftDto>> {
  return farmRequest<ControlOrderDraftDto>(`/v1/control-orders/drafts/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    jsonBody: {},
  });
}
