/** Cookie checked by middleware so `/dashboard` stays gated without JS. */
export const AUTH_COOKIE_NAME = "smart-farm-auth";

/** localStorage payload for mock session details (username, timestamps). */
export const SESSION_STORAGE_KEY = "smart-farm-session";

export const THEME_STORAGE_KEY = "smart-farm-theme";

/** Align cookie lifetime with typical session expectation (7 days). */
export const MOCK_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
