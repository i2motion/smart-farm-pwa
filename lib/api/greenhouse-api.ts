/**
 * 온실 상세 API.
 *
 * 향후 UI 연동:
 * - `app/(control)/greenhouses/[id]/page.tsx` · `greenhouse-detail-shell.tsx`에서
 *   로드 시 `getGreenhouseDetail(id)`, 폴링 시 `getGreenhouseStatus(id)` 호출 검토
 */

import { farmRequest } from "@/lib/api/api-client";
import type {
  ApiResult,
  CommandAcceptedDto,
  GreenhouseDetailDto,
  GreenhouseProfilePatchDto,
  GreenhouseStatusDto,
} from "@/lib/api/types";

export async function getGreenhouseStatus(id: string): Promise<ApiResult<GreenhouseStatusDto>> {
  return farmRequest<GreenhouseStatusDto>(`/v1/greenhouses/${encodeURIComponent(id)}/status`, {
    method: "GET",
  });
}

export async function getGreenhouseDetail(id: string): Promise<ApiResult<GreenhouseDetailDto>> {
  return farmRequest<GreenhouseDetailDto>(`/v1/greenhouses/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

/** 표시 이름·작목 갱신 — Farm PC 메모리(`TFarmMockState`)까지 반영되는 모의 서버 기준. */
export async function patchGreenhouseProfile(
  greenhouseId: string,
  patch: GreenhouseProfilePatchDto
): Promise<ApiResult<CommandAcceptedDto>> {
  const jsonBody: Record<string, string> = {};
  if (patch.name !== undefined) jsonBody.name = patch.name;
  if (patch.cropName !== undefined) jsonBody.cropName = patch.cropName;
  return farmRequest<CommandAcceptedDto>(`/v1/greenhouses/${encodeURIComponent(greenhouseId)}`, {
    method: "PATCH",
    jsonBody,
  });
}
