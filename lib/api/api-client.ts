/**
 * Farm PC API 클라이언트 (단일 진입).
 *
 * - UI·PWA는 오직 Farm PC API만 호출합니다. PLC/카메라/필드 센서와 직접 통신하지 않습니다.
 * - Farm PC가 급수 PLC, 영양액 PLC, 기후·온실 센서, 추후 카메라 등과 중계합니다.
 *
 * 환경 변수:
 * - NEXT_PUBLIC_FARM_API_BASE_URL — 미설정 시 http://localhost:8080
 * - NEXT_PUBLIC_FARM_API_FORCE_MOCK=1 — 네트워크 호출 생략(개발용). 실패 시 목업 폴백과 별개.
 *
 * 향후 UI 연동 위치(예시):
 * - 대시보드 로드: `getFarmStatus`, `getGreenhouses`, `checkFarmApiConnection`
 * - 온실 상세: `getGreenhouseDetail`, `getGreenhouseSensors`
 * - 알람 설정 저장: `createSensorAlarmRule` / `updateSensorAlarmRule`
 * - 구동 버튼: device-api의 각 함수 — 반드시 확인 다이얼로그 후 호출
 */

import type {
  ApiResult,
  FarmApiConnectionStatus,
  FarmApiErrorCode,
  FarmApiErrorPayload,
  FarmDataSource,
} from "@/lib/api/types";

const DEFAULT_BASE_URL = "http://localhost:8080";
export const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

/** API 베이스 (슬래시 없이) */
export function getFarmApiBaseUrl(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_FARM_API_BASE_URL
      ? process.env.NEXT_PUBLIC_FARM_API_BASE_URL.trim()
      : "";
  return raw || DEFAULT_BASE_URL;
}

export function isFarmApiMockForced(): boolean {
  return (
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_FARM_API_FORCE_MOCK === "1"
  );
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export class FarmApiError extends Error {
  readonly code: FarmApiErrorCode;
  readonly httpStatus?: number;
  readonly details?: unknown;

  constructor(message: string, code: FarmApiErrorCode, httpStatus?: number, details?: unknown) {
    super(message);
    this.name = "FarmApiError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
  }

  toPayload(): FarmApiErrorPayload {
    return {
      code: this.code,
      message: safeUserFacingMessage(this),
      httpStatus: this.httpStatus,
    };
  }
}

/** UI에 노출해도 되는 한국어 메시지 */
export function safeUserFacingMessage(err: unknown): string {
  if (err instanceof FarmApiError) {
    if (err.code === "timeout") return "서버 응답이 지연되었습니다. 잠시 후 다시 시도해 주세요.";
    if (err.code === "network") return "Farm PC에 연결할 수 없습니다. 네트워크와 주소를 확인해 주세요.";
    if (err.code === "aborted") return "요청이 취소되었습니다.";
    if (err.code === "parse") return "응답 형식이 올바르지 않습니다.";
    if (err.code === "http") {
      const s = err.httpStatus;
      if (s === 401 || s === 403) return "권한이 없거나 로그인이 필요합니다.";
      if (s === 404) return "요청한 정보를 찾을 수 없습니다.";
      if (s != null && s >= 500) return "Farm PC 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      return "요청을 처리할 수 없습니다.";
    }
    return "알 수 없는 오류가 발생했습니다.";
  }
  if (err instanceof Error) return err.message || "오류가 발생했습니다.";
  return "오류가 발생했습니다.";
}

type JsonObject = Record<string, unknown>;

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new FarmApiError("JSON 파싱 실패", "parse");
  }
}

export type FarmRequestInit = Omit<RequestInit, "body"> & {
  /** Raw 본문 — `jsonBody`와 동시에 넣지 마세요 */
  body?: RequestInit["body"];
  /** JSON 본문 — 객체를 넣으면 Content-Type: application/json 설정 */
  jsonBody?: JsonObject;
  timeoutMs?: number;
};

/**
 * 저수준 JSON 요청. 성공 시 파싱된 본문, 실패 시 FarmApiError throw.
 * 인증 헤더는 기존 auth/session 레이어에서 주입하도록 확장할 때 여기에만 추가하세요(현재 변경 없음).
 */
export async function farmFetchJson<T>(path: string, init: FarmRequestInit = {}): Promise<T> {
  if (isFarmApiMockForced()) {
    throw new FarmApiError("FORCE_MOCK: 네트워크 비활성", "network");
  }

  const { jsonBody, timeoutMs: timeoutOverride, body: initBody, ...restInit } = init;
  const url = joinUrl(getFarmApiBaseUrl(), path);
  const timeoutMs = timeoutOverride ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(restInit.headers);
  let body: BodyInit | undefined = initBody as BodyInit | undefined;
  if (jsonBody !== undefined) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }

  try {
    const res = await fetch(url, {
      ...restInit,
      body,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timer);

    const text = await res.text();
    if (!res.ok) {
      let detail: unknown;
      try {
        detail = text ? parseJsonSafe(text) : undefined;
      } catch {
        detail = text;
      }
      throw new FarmApiError(
        `HTTP ${res.status}`,
        "http",
        res.status,
        detail
      );
    }
    if (!text || text.trim() === "") {
      return undefined as T;
    }
    const parsed = parseJsonSafe(text);
    return parsed as T;
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof FarmApiError) throw e;
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new FarmApiError("요청 시간 초과", "timeout");
    }
    if (e instanceof TypeError) {
      throw new FarmApiError("네트워크 오류", "network", undefined, e);
    }
    throw new FarmApiError("알 수 없는 오류", "unknown", undefined, e);
  }
}

export async function farmFetchJsonOrThrow<T>(path: string, init?: FarmRequestInit): Promise<T> {
  return farmFetchJson<T>(path, init);
}

/** 결과 타입으로 감싼 요청 — UI에서 ok 분기 */
export async function farmRequest<T>(path: string, init?: FarmRequestInit): Promise<ApiResult<T>> {
  try {
    const data = await farmFetchJson<T>(path, init);
    return { ok: true, data };
  } catch (e) {
    const err = e instanceof FarmApiError ? e : new FarmApiError(safeUserFacingMessage(e), "unknown");
    return { ok: false, error: err.toPayload() };
  }
}

/**
 * API 실패 시 `getMock()`으로 채운 결과를 반환(페이지는 `source`로 구분).
 * 기존 `lib/.../mock-data`를 넘기면 오프라인에도 UI 유지 가능.
 */
export async function farmRequestWithMockFallback<T>(
  path: string,
  init: FarmRequestInit | undefined,
  getMock: () => T
): Promise<FarmDataSource<T>> {
  const result = await farmRequest<T>(path, init);
  if (result.ok) return { source: "api", data: result.data };
  return { source: "mock", data: getMock(), upstreamError: result.error };
}

let lastConnection: FarmApiConnectionStatus | null = null;

/**
 * Farm PC 연결 가능 여부 (경량 헬스 체크).
 * UI: 설정 상단·대시보드 배너 등에서 주기적으로 호출 가능.
 */
export async function checkFarmApiConnection(
  /** Farm PC에 `/v1/system/health`가 없으면 `/v1/system/status` 등으로 교체 */
  healthPath = "/v1/system/status"
): Promise<FarmApiConnectionStatus> {
  const checkedAt = new Date().toISOString();
  if (isFarmApiMockForced()) {
    lastConnection = {
      ok: false,
      checkedAt,
      message: "모의(mock) 강제 모드입니다. 실제 API에 연결하지 않습니다.",
    };
    return lastConnection;
  }

  const start = Date.now();
  try {
    await farmFetchJson<unknown>(healthPath, { method: "GET", timeoutMs: 8_000 });
    const latencyMs = Math.round(Date.now() - start);
    lastConnection = {
      ok: true,
      checkedAt,
      latencyMs,
      message: "Farm PC API에 연결되었습니다.",
    };
    return lastConnection;
  } catch (e) {
    lastConnection = {
      ok: false,
      checkedAt,
      message: safeUserFacingMessage(e),
    };
    return lastConnection;
  }
}

/** 마지막 `checkFarmApiConnection` 결과(세션 내 캐시). 연결 전에는 null */
export function getLastFarmApiConnectionStatus(): FarmApiConnectionStatus | null {
  return lastConnection;
}
