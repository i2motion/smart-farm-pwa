/**
 * 장비·구동 명령 API (Farm PC → PLC 중계).
 *
 * SAFETY:
 * - 모든 함수는 UI에서 **사용자 확인 다이얼로그 이후**에만 호출하세요 (`devices-confirm-dialog.tsx` 등).
 * - 영양액 공급·히터·관수는 고위험 — 확인 문구를 명확히 표시.
 * - 이 모듈은 PLC와 직접 통신하지 않으며 Farm PC REST만 호출합니다.
 *
 * 향후 UI 연동:
 * - `fleet-device-controls.tsx`, `greenhouse-device-panel.tsx`, `control-button-group.tsx`:
 *   버튼 onClick → 확인 → 여기 해당 함수 호출.
 *
 * 영양액 공급 시작/중지는 `nutrient-api.ts`와 동일 엔드포인트를 사용합니다(중복 HTTP 방지).
 */

import { farmRequest } from "@/lib/api/api-client";
import {
  startNutrientSupply as nutrientStartNutrientSupply,
  stopNutrientSupply as nutrientStopNutrientSupply,
} from "@/lib/api/nutrient-api";
import type { ApiResult, CommandAcceptedDto, DeviceFleetStatusDto, GreenhouseControlMode } from "@/lib/api/types";

export async function getDeviceStatus(): Promise<ApiResult<DeviceFleetStatusDto>> {
  return farmRequest<DeviceFleetStatusDto>("/v1/devices/status", { method: "GET" });
}

export async function setGreenhouseMode(
  greenhouseId: string,
  mode: GreenhouseControlMode
): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/mode`,
    {
      method: "PATCH",
      jsonBody: { mode },
    }
  );
}

/** 고위험 — 영양액 공급. 확인 후 호출. `nutrient-api.startNutrientSupply`와 동일. */
export function startNutrientSupply(targetGreenhouseIds: string[]) {
  return nutrientStartNutrientSupply(targetGreenhouseIds);
}

/** 영양액 공급 중지 */
export function stopNutrientSupply() {
  return nutrientStopNutrientSupply();
}

export async function startWaterSupply(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/water/start`,
    { method: "POST", jsonBody: {} }
  );
}

export async function stopWaterSupply(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/water/stop`,
    { method: "POST", jsonBody: {} }
  );
}

export async function openSkylight(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/skylight/open`,
    { method: "POST", jsonBody: {} }
  );
}

export async function closeSkylight(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/skylight/close`,
    { method: "POST", jsonBody: {} }
  );
}

export async function openSideWindow(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/side-window/open`,
    { method: "POST", jsonBody: {} }
  );
}

export async function closeSideWindow(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/side-window/close`,
    { method: "POST", jsonBody: {} }
  );
}

export async function startCirculationFan(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/circulation-fan/start`,
    { method: "POST", jsonBody: {} }
  );
}

export async function stopCirculationFan(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/circulation-fan/stop`,
    { method: "POST", jsonBody: {} }
  );
}

/** 고위험 — 히터 */
export async function startHeater(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/heater/start`,
    { method: "POST", jsonBody: {} }
  );
}

export async function stopHeater(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/heater/stop`,
    { method: "POST", jsonBody: {} }
  );
}

export async function startSprayer(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/sprayer/start`,
    { method: "POST", jsonBody: {} }
  );
}

export async function stopSprayer(greenhouseId: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/sprayer/stop`,
    { method: "POST", jsonBody: {} }
  );
}
