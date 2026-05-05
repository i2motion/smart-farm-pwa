/**
 * Developer-only Farm PC API probes for `/api-test`.
 * Uses `NEXT_PUBLIC_FARM_API_BASE_URL` via `getFarmApiBaseUrl()` (default http://localhost:8080).
 * Does not use `farmFetchJson` — bypasses FORCE_MOCK so you can hit a real server while the app UI stays on mock data.
 */

import { getFarmApiBaseUrl } from "@/lib/api/api-client";

/** Documented default when the env var is unset (runtime: `getFarmApiBaseUrl()`). */
export const API_TEST_ENV_DEFAULT_BASE_URL = "http://localhost:8080";

const DEFAULT_TIMEOUT_MS = 15_000;

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export type ApiTestEndpoint = {
  readonly id: string;
  readonly label: string;
  readonly path: string;
};

export const API_TEST_GET_ENDPOINTS: readonly ApiTestEndpoint[] = [
  { id: "farm-status", label: "Farm status", path: "/v1/farm/status" },
  { id: "system-status", label: "System status", path: "/v1/system/status" },
  { id: "greenhouses", label: "Greenhouses list", path: "/v1/greenhouses" },
  { id: "devices-status", label: "Devices status", path: "/v1/devices/status" },
  { id: "nutrient-status", label: "Nutrient status", path: "/v1/nutrient/status" },
  { id: "climate-sensors", label: "Climate sensors (MET)", path: "/v1/climate/sensors" },
] as const;

export type ApiTestResult = {
  endpointId: string;
  label: string;
  path: string;
  requestUrl: string;
  httpStatus: number | null;
  responseJson: unknown | null;
  /** Present when the body was non-empty but not valid JSON. */
  rawBody: string | null;
  errorMessage: string | null;
  durationMs: number;
};

function buildHttpErrorMessage(status: number, responseJson: unknown | null, rawBody: string | null): string {
  const prefix = `HTTP ${status}`;
  if (responseJson !== null && typeof responseJson === "object" && "error" in responseJson) {
    return `${prefix}: ${JSON.stringify((responseJson as { error: unknown }).error)}`;
  }
  if (rawBody !== null && rawBody.length > 0) {
    const clip = rawBody.length > 400 ? `${rawBody.slice(0, 400)}…` : rawBody;
    return `${prefix} — ${clip}`;
  }
  return prefix;
}

export async function runApiTestGet(
  endpoint: ApiTestEndpoint,
  options?: { timeoutMs?: number }
): Promise<ApiTestResult> {
  const requestUrl = joinUrl(getFarmApiBaseUrl(), endpoint.path);
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(requestUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    const httpStatus = res.status;
    const text = await res.text();
    let responseJson: unknown | null = null;
    let rawBody: string | null = null;

    if (text.trim()) {
      try {
        responseJson = JSON.parse(text) as unknown;
      } catch {
        rawBody = text;
      }
    }

    const errorMessage = res.ok ? null : buildHttpErrorMessage(httpStatus, responseJson, rawBody);

    return {
      endpointId: endpoint.id,
      label: endpoint.label,
      path: endpoint.path,
      requestUrl,
      httpStatus,
      responseJson,
      rawBody,
      errorMessage,
      durationMs: Date.now() - started,
    };
  } catch (e) {
    clearTimeout(timer);
    const msg =
      e instanceof DOMException && e.name === "AbortError"
        ? "요청 시간 초과"
        : e instanceof Error
          ? e.message
          : "알 수 없는 오류";
    return {
      endpointId: endpoint.id,
      label: endpoint.label,
      path: endpoint.path,
      requestUrl,
      httpStatus: null,
      responseJson: null,
      rawBody: null,
      errorMessage: msg,
      durationMs: Date.now() - started,
    };
  }
}

export async function runAllApiTestGets(options?: {
  timeoutMs?: number;
}): Promise<ApiTestResult[]> {
  const out: ApiTestResult[] = [];
  for (const ep of API_TEST_GET_ENDPOINTS) {
    out.push(await runApiTestGet(ep, options));
  }
  return out;
}
