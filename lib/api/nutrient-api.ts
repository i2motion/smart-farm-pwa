/**
 * 영양액 시스템 API (고위험 구역 — PLC 연동은 Farm PC 전용).
 *
 * SAFETY:
 * - 실제 PLC 제어는 서버·Farm PC에서만 수행.
 *
 * 향후 UI 연동:
 * - `nutrient-solution-panel.tsx`, `global-control-panel.tsx`: 상태 조회·레시피 선택
 *
 * 참고: `device-api.ts`에서 동일 공급 API를 재내보내 온실 제어 화면과 경로를 맞춤.
 */

import { farmRequest } from "@/lib/api/api-client";
import type { ApiResult, CommandAcceptedDto, NutrientHistoryEntryDto, NutrientRecipeDto, NutrientSystemStatusDto } from "@/lib/api/types";

export async function getNutrientStatus(): Promise<ApiResult<NutrientSystemStatusDto>> {
  return farmRequest<NutrientSystemStatusDto>("/v1/nutrient/status", { method: "GET" });
}

export async function getNutrientRecipes(): Promise<ApiResult<NutrientRecipeDto[]>> {
  return farmRequest<NutrientRecipeDto[]>("/v1/nutrient/recipes", { method: "GET" });
}

export async function selectNutrientRecipe(recipeId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>("/v1/nutrient/recipe/select", {
    method: "POST",
    jsonBody: { recipeId },
  });
}

export async function getNutrientHistory(): Promise<ApiResult<NutrientHistoryEntryDto[]>> {
  return farmRequest<NutrientHistoryEntryDto[]>("/v1/nutrient/history", { method: "GET" });
}
