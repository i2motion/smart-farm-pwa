"use client";

import {
  AUTH_COOKIE_NAME,
  MOCK_SESSION_MAX_AGE_SEC,
  SESSION_STORAGE_KEY,
} from "@/lib/auth/constants";

export type FarmSession = {
  username: string;
  loggedInAt: string;
};

function cookieSecureSuffix(): string {
  return typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
}

export function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${MOCK_SESSION_MAX_AGE_SEC}; SameSite=Lax${cookieSecureSuffix()}`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${cookieSecureSuffix()}`;
}

export function persistMockSession(username: string) {
  const session: FarmSession = {
    username,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  setAuthCookie();
}

export function clearMockSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  clearAuthCookie();
}

export function readFarmSession(): FarmSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FarmSession;
    if (
      typeof parsed.username !== "string" ||
      typeof parsed.loggedInAt !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
