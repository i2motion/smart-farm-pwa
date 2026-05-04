/**
 * Control center navigation — single source for desktop sidebar + mobile menu.
 * Order: Dashboard → Auto/Manual → Cameras → Alarm → Work → Sensors → Devices → Auction → Settings
 */
export const CONTROL_NAV_LINKS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/auto-manual", label: "자동/수동" },
  { href: "/cameras", label: "카메라" },
  { href: "/alarms", label: "알람" },
  { href: "/work", label: "작업" },
  { href: "/sensors", label: "센서" },
  { href: "/devices", label: "장비" },
  { href: "/auction", label: "경매" },
  { href: "/settings", label: "설정" },
] as const;
