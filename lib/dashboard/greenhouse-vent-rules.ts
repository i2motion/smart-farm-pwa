import type { GreenhouseZone } from "@/lib/dashboard/types";

export function zoneNumber(zone: GreenhouseZone): number {
  const m = /^gh-0*(\d+)$/i.exec(zone.id);
  return m ? parseInt(m[1], 10) : 99;
}

/** 1·6: 측창 좌만, 5·7: 측창 우만, 2·3·4: 측창 없음 */
export function sideWindowLayout(n: number): "left" | "right" | null {
  if (n === 1 || n === 6) return "left";
  if (n === 5 || n === 7) return "right";
  return null;
}
