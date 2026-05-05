/**
 * 향후 REST 연동용 경로·시그니처만 정의합니다. UI는 호출하지 않습니다.
 * AI·PLC는 직접 제어하지 않으며, 제어명령은 승인 후에도 실행 계층은 별도 정책입니다.
 */
import type { FarmDiaryEntry, ControlOrderDraft, AIReport } from "./types";

export const FARM_DIARY_PATHS = {
  list: "/farm-diary",
  create: "/farm-diary",
  update: (id: string) => `/farm-diary/${id}`,
  remove: (id: string) => `/farm-diary/${id}`,
} as const;

export const AI_PATHS = {
  analyzeDiary: "/ai/analyze-diary",
  controlOrderDrafts: "/ai/control-order-drafts",
  approveDraft: (id: string) => `/ai/control-order-drafts/${id}/approve`,
  holdDraft: (id: string) => `/ai/control-order-drafts/${id}/hold`,
  rejectDraft: (id: string) => `/ai/control-order-drafts/${id}/reject`,
} as const;

export type FarmDiaryListResult = { items: FarmDiaryEntry[] };
export type FarmDiaryCreateBody = Omit<FarmDiaryEntry, "id" | "createdAt">;
export type ControlOrderDraftPatchResult = { draft: ControlOrderDraft };
export type AIAnalyzeResult = { report: AIReport; draftIds: string[] };

/** @placeholder GET /farm-diary */
export async function fetchFarmDiaryList(): Promise<FarmDiaryListResult> {
  void FARM_DIARY_PATHS.list;
  throw new Error("API 미연동 — 로컬 목업 상태를 사용하세요.");
}

/** @placeholder POST /farm-diary */
export async function createFarmDiary(body: FarmDiaryCreateBody): Promise<FarmDiaryEntry> {
  void body;
  void FARM_DIARY_PATHS.create;
  throw new Error("API 미연동 — 로컬 목업 상태를 사용하세요.");
}

/** @placeholder PUT /farm-diary/{id} */
export async function updateFarmDiary(id: string, body: Partial<FarmDiaryCreateBody>): Promise<FarmDiaryEntry> {
  void id;
  void body;
  throw new Error("API 미연동 — 로컬 목업 상태를 사용하세요.");
}

/** @placeholder DELETE /farm-diary/{id} */
export async function deleteFarmDiary(id: string): Promise<void> {
  void id;
  throw new Error("API 미연동 — 로컬 목업 상태를 사용하세요.");
}

/** @placeholder POST /ai/analyze-diary */
export async function postAiAnalyzeDiary(entryIds: string[]): Promise<AIAnalyzeResult> {
  void entryIds;
  void AI_PATHS.analyzeDiary;
  throw new Error("API 미연동 — 목업 AI 보고를 사용하세요.");
}

/** @placeholder GET /ai/control-order-drafts */
export async function fetchControlOrderDrafts(): Promise<ControlOrderDraft[]> {
  void AI_PATHS.controlOrderDrafts;
  throw new Error("API 미연동 — 로컬 목업 상태를 사용하세요.");
}

/** @placeholder PATCH .../approve */
export async function approveControlOrderDraft(id: string): Promise<ControlOrderDraftPatchResult> {
  void id;
  throw new Error("API 미연동 — 화면에서만 상태를 갱신하세요.");
}

/** @placeholder PATCH .../hold */
export async function holdControlOrderDraft(id: string): Promise<ControlOrderDraftPatchResult> {
  void id;
  throw new Error("API 미연동 — 화면에서만 상태를 갱신하세요.");
}

/** @placeholder PATCH .../reject */
export async function rejectControlOrderDraft(id: string): Promise<ControlOrderDraftPatchResult> {
  void id;
  throw new Error("API 미연동 — 화면에서만 상태를 갱신하세요.");
}
