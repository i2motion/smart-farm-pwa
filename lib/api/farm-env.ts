/**
 * Farm PC API mode flags (no secrets — NEXT_PUBLIC_* only).
 * - Default: call Farm PC (Delphi mock at NEXT_PUBLIC_FARM_API_BASE_URL).
 * - FORCE_MOCK: skip HTTP entirely (offline UI dev).
 * - FALLBACK_MOCK: if HTTP fails, fall back to local lib/.../mock-data so UI still renders.
 */

import { isFarmApiMockForced } from "@/lib/api/api-client";

export function isFarmApiFallbackMockEnabled(): boolean {
  return typeof process !== "undefined" && process.env.NEXT_PUBLIC_FARM_API_FALLBACK_MOCK === "1";
}

export { isFarmApiMockForced };

export function shouldUseFarmHttp(): boolean {
  return !isFarmApiMockForced();
}
