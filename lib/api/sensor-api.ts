/**
 * 센서 조회·알람 규칙 CRUD (Farm PC 경유).
 *
 * 향후 UI 연동:
 * - `app/(control)/sensors/page.tsx`: `getLatestSensors`
 * - 온실 상세 센서 카드: `getGreenhouseSensors(greenhouseId)`
 * - 추세 차트: `getSensorHistory(sensorId, range)`
 * - `sensor-alarm-modal.tsx` 저장/수정/삭제: 아래 create/update/delete 호출 후 로컬 목업 동기화 제거
 */

import { farmRequest } from "@/lib/api/api-client";
import type {
  ApiResult,
  SensorAlarmRuleCreateDto,
  SensorAlarmRuleDto,
  SensorAlarmRuleUpdateDto,
  SensorHistoryDto,
  SensorHistoryRange,
  SensorReadingDto,
} from "@/lib/api/types";

export async function getLatestSensors(): Promise<ApiResult<SensorReadingDto[]>> {
  return farmRequest<SensorReadingDto[]>("/v1/sensors/latest", { method: "GET" });
}

export async function getGreenhouseSensors(greenhouseId: string): Promise<ApiResult<SensorReadingDto[]>> {
  return farmRequest<SensorReadingDto[]>(
    `/v1/greenhouses/${encodeURIComponent(greenhouseId)}/sensors`,
    { method: "GET" }
  );
}

export async function getSensorHistory(
  sensorId: string,
  range: SensorHistoryRange
): Promise<ApiResult<SensorHistoryDto>> {
  const q = new URLSearchParams({ range });
  return farmRequest<SensorHistoryDto>(
    `/v1/sensors/${encodeURIComponent(sensorId)}/history?${q.toString()}`,
    { method: "GET" }
  );
}

export async function createSensorAlarmRule(
  data: SensorAlarmRuleCreateDto
): Promise<ApiResult<SensorAlarmRuleDto>> {
  return farmRequest<SensorAlarmRuleDto>("/v1/sensor-alarm-rules", {
    method: "POST",
    jsonBody: { ...data },
  });
}

export async function updateSensorAlarmRule(
  id: string,
  data: SensorAlarmRuleUpdateDto
): Promise<ApiResult<SensorAlarmRuleDto>> {
  return farmRequest<SensorAlarmRuleDto>(`/v1/sensor-alarm-rules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    jsonBody: { ...data },
  });
}

export async function deleteSensorAlarmRule(id: string): Promise<ApiResult<void>> {
  return farmRequest<void>(`/v1/sensor-alarm-rules/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
