/**
 * Control center navigation — single source for desktop sidebar + mobile strip.
 * 자동/수동·현장 구동은 `/devices`에서 통합. 센서 상세는 대시보드 요약 + 온실 상세.
 */
export const CONTROL_NAV_LINKS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/cameras", label: "카메라" },
  { href: "/devices", label: "장비" },
  { href: "/alarms", label: "알람" },
  { href: "/work", label: "작업" },
  { href: "/weather", label: "날씨" },
  { href: "/auction", label: "경매" },
  { href: "/settings", label: "설정" },
] as const;
