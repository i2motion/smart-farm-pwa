import type { SensorReadingDto } from "@/lib/api/types";
import type { GreenhouseSensorSnapshot } from "@/lib/greenhouse/types";

/** Farm PC `SensorReadingDto.kind` 값을 스냅샷 숫자 필드로 반영합니다. 강수·풍속·일사 등은 건드리지 않습니다. */
export function mergeSensorReadingsIntoSnapshot(
  base: GreenhouseSensorSnapshot,
  readings: SensorReadingDto[]
): GreenhouseSensorSnapshot {
  const out: GreenhouseSensorSnapshot = { ...base };
  for (const r of readings) {
    const k = (r.kind ?? "").toLowerCase();
    switch (k) {
      case "temp":
        out.tempC = r.value;
        break;
      case "humidity":
        out.humidityPct = Math.round(r.value);
        break;
      case "soilmoisture":
        out.soilMoisturePct = Math.round(r.value);
        break;
      case "soiltemp":
        out.soilTempC = r.value;
        break;
      case "ec":
        out.ecMScm = r.value;
        break;
      case "ph":
        out.ph = r.value;
        break;
      default:
        break;
    }
  }
  return out;
}
