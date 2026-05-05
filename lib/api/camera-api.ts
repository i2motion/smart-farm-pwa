/**
 * 카메라 API (추후 Farm PC·NVR 연동).
 *
 * 향후 UI 연동:
 * - `cameras-summary.tsx`, `camera-card.tsx`, 대시보드 카메라 영역: 목록·상태
 * - 재부팅·전원은 현장 정책에 맞게 확인 다이얼로그 후 호출
 *
 * UI는 스트림 URL에 직접 붙지 말고 Farm PC가 내려주는 주소/토큰을 사용하도록 설계하세요.
 */

import { farmRequest } from "@/lib/api/api-client";
import type { ApiResult, CameraStatusDto, CameraSummaryDto, CommandAcceptedDto } from "@/lib/api/types";

export async function getCameras(): Promise<ApiResult<CameraSummaryDto[]>> {
  return farmRequest<CameraSummaryDto[]>("/v1/cameras", { method: "GET" });
}

export async function getCameraStatus(id: string): Promise<ApiResult<CameraStatusDto>> {
  return farmRequest<CameraStatusDto>(`/v1/cameras/${encodeURIComponent(id)}`, { method: "GET" });
}

export async function rebootCamera(id: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(`/v1/cameras/${encodeURIComponent(id)}/reboot`, {
    method: "POST",
    jsonBody: {},
  });
}

export async function turnCameraOn(id: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(`/v1/cameras/${encodeURIComponent(id)}/power/on`, {
    method: "POST",
    jsonBody: {},
  });
}

export async function turnCameraOff(id: string): Promise<ApiResult<CommandAcceptedDto>> {
  return farmRequest<CommandAcceptedDto>(`/v1/cameras/${encodeURIComponent(id)}/power/off`, {
    method: "POST",
    jsonBody: {},
  });
}
