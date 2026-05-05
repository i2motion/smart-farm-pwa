/**
 * 부지 기후(기상) 센서 조회 — 대시보드 날씨 카드 좌측 MET 요약.
 */

import { farmRequest } from "@/lib/api/api-client";
import type { ApiResult, ClimateSensorsResponseDto } from "@/lib/api/types";

export async function getClimateSensors(): Promise<ApiResult<ClimateSensorsResponseDto>> {
  return farmRequest<ClimateSensorsResponseDto>("/v1/climate/sensors", { method: "GET" });
}
