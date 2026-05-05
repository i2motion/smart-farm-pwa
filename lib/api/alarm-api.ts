/**
 * 알람 목록·확인·규칙 CRUD (Farm PC).
 *
 * 향후 UI 연동:
 * - `app/(control)/alarms/page.tsx`, `alarm-rules-section.tsx`: `getAlarms`, 규칙 CRUD
 * - 알람 행 확인 버튼: `acknowledgeAlarm`
 *
 * 참고: 센서 임계 알람 **규칙**은 `sensor-api.ts`의 sensor-alarm-rules와 서버 스키마가
 * 분리될 수 있음 — 백엔드 계약에 맞춰 매핑하세요.
 */

import { farmRequest } from "@/lib/api/api-client";
import type {
  AlarmRuleDto,
  AlarmRuleWriteDto,
  ApiResult,
  FarmAlarmDto,
} from "@/lib/api/types";

export async function getAlarms(): Promise<ApiResult<FarmAlarmDto[]>> {
  return farmRequest<FarmAlarmDto[]>("/v1/alarms", { method: "GET" });
}

export async function acknowledgeAlarm(id: string): Promise<ApiResult<{ ok: boolean }>> {
  return farmRequest<{ ok: boolean }>(`/v1/alarms/${encodeURIComponent(id)}/acknowledge`, {
    method: "POST",
    jsonBody: {},
  });
}

export async function createAlarmRule(data: AlarmRuleWriteDto): Promise<ApiResult<AlarmRuleDto>> {
  return farmRequest<AlarmRuleDto>("/v1/alarm-rules", {
    method: "POST",
    jsonBody: { ...data },
  });
}

export async function updateAlarmRule(
  id: string,
  data: Partial<AlarmRuleWriteDto>
): Promise<ApiResult<AlarmRuleDto>> {
  return farmRequest<AlarmRuleDto>(`/v1/alarm-rules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    jsonBody: { ...data },
  });
}

export async function deleteAlarmRule(id: string): Promise<ApiResult<void>> {
  return farmRequest<void>(`/v1/alarm-rules/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
