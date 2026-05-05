/**
 * Farm 단위 API.
 *
 * 향후 UI 연동:
 * - `app/(control)/dashboard/page.tsx` 마운트 시 `getFarmStatus`, `getGreenhouses` 호출 검토
 * - 상단 시스템 배너: `getSystemStatus` + `checkFarmApiConnection` (api-client)
 */

import { farmRequest } from "@/lib/api/api-client";
import type { ApiResult, FarmStatusDto, GreenhouseSummaryDto, SystemStatusDto } from "@/lib/api/types";

export async function getFarmStatus(): Promise<ApiResult<FarmStatusDto>> {
  return farmRequest<FarmStatusDto>("/v1/farm/status", { method: "GET" });
}

export async function getGreenhouses(): Promise<ApiResult<GreenhouseSummaryDto[]>> {
  return farmRequest<GreenhouseSummaryDto[]>("/v1/greenhouses", { method: "GET" });
}

export async function getSystemStatus(): Promise<ApiResult<SystemStatusDto>> {
  return farmRequest<SystemStatusDto>("/v1/system/status", { method: "GET" });
}
