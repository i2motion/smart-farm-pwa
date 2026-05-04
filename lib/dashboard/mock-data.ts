import type {
  ClimateSensor,
  FarmAlarm,
  FarmCamera,
  GreenhouseZone,
  WeatherDay,
  WeatherDayHourly,
  WorkInstruction,
} from "./types";

/** 대시보드 상단·집계 (목업) */
export const MOCK_FARM_META = {
  farmName: "사계리 농장",
  onlineDevices: 42,
  openAlarms: { critical: 1, warning: 3, info: 5 },
} as const;

export type FarmMetaSnapshot = typeof MOCK_FARM_META;

/** 대시보드 실외 일출·일몰 (목업, API 연동 시 좌표 기반 계산) */
export const MOCK_DASHBOARD_SKY = {
  sunrise: "05:42",
  sunset: "19:18",
} as const;

/**
 * 목업 카메라 정지 프레임: `smart-farm-pwa/public/cameras/` 에 두고 아래 파일명과 맞춥니다.
 * (`app/(control)/cameras`는 페이지 라우트 — 정적 파일 URL과 무관)
 */
export const MOCK_CAMERAS: FarmCamera[] = [
  {
    id: "cam-101",
    name: "2동 · 북측 복도",
    status: "online",
    resolution: "1920×1080",
    aiLabel: "대기 · 목업",
    imageUrl: "/cameras/camera-1.png",
  },
  {
    id: "cam-102",
    name: "5동 · NFT 상류",
    status: "degraded",
    resolution: "1280×720",
    aiLabel: "움직임 탐지(휴리스틱) · 목업",
    imageUrl: "/cameras/camera-2.png",
  },
  {
    id: "cam-103",
    name: "주변 · 게이트 B",
    status: "offline",
    resolution: "—",
    aiLabel: "사용 불가",
    imageUrl: "/cameras/camera-3.png",
  },
];

export const MOCK_WEATHER: WeatherDay[] = [
  {
    id: "d1",
    label: "일 · 오늘",
    condition: "구름 많음",
    highC: 18,
    lowC: 12,
    humidityPct: 68,
    precipPct: 20,
    windMs: 4.2,
  },
  {
    id: "d2",
    label: "월",
    condition: "가벼운 비",
    highC: 16,
    lowC: 11,
    precipPct: 65,
    windMs: 5.8,
  },
  {
    id: "d3",
    label: "화",
    condition: "맑음",
    highC: 19,
    lowC: 10,
    precipPct: 5,
    windMs: 3.1,
  },
];

/** 대시보드·환경 비교용 단일 기상 센서(목업) */
export const MOCK_CLIMATE_SENSORS: ClimateSensor[] = [
  {
    id: "met-10",
    name: "MET-10 · 부지 기상탑",
    location: "본관 동측 · 지상 5m",
    tempC: 17.2,
    humidityPct: 72,
    dewpointC: 12.1,
    batteryPct: 94,
    windMs: 4.2,
    windDirLabel: "북북서",
    solarRadiationWm2: 612,
  },
];

export const MOCK_GREENHOUSES: GreenhouseZone[] = [
  {
    id: "gh-01",
    name: "제1동 · 관리동",
    crop: "비타민 채소 · 6주차",
    tempC: 21.8,
    humidityPct: 68,
    soilPct: 54,
    status: "안정",
    mode: "AUTO",
    healthStatus: "normal",
    irrigationRunning: false,
    skylightLeftOpen: true,
    skylightRightOpen: false,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: false,
    skylightOpen: true,
    sideWindowOpen: false,
  },
  {
    id: "gh-02",
    name: "제2동 · 토마토",
    crop: "방울토마토 · 11주차",
    tempC: 25.2,
    humidityPct: 58,
    soilPct: 71,
    status: "안정",
    mode: "MANUAL",
    healthStatus: "normal",
    irrigationRunning: true,
    skylightLeftOpen: false,
    skylightRightOpen: true,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: false,
    skylightOpen: true,
    sideWindowOpen: false,
  },
  {
    id: "gh-03",
    name: "제3동 · 딸기",
    crop: "일장형 · 개화기",
    tempC: 19.6,
    humidityPct: 76,
    soilPct: 62,
    status: "습도 주의",
    mode: "AUTO",
    healthStatus: "warning",
    irrigationRunning: false,
    skylightLeftOpen: true,
    skylightRightOpen: true,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: false,
    skylightOpen: true,
    sideWindowOpen: false,
  },
  {
    id: "gh-04",
    name: "제4동 · 육묘",
    crop: "묘목 · 미스트",
    tempC: 23.4,
    humidityPct: 82,
    soilPct: 88,
    status: "미스트 가동",
    mode: "AUTO",
    healthStatus: "normal",
    irrigationRunning: true,
    skylightLeftOpen: false,
    skylightRightOpen: false,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: false,
    skylightOpen: false,
    sideWindowOpen: false,
  },
  {
    id: "gh-05",
    name: "제5동 · 생야채(NFT)",
    crop: "버터헤드 · 5주차",
    tempC: 20.1,
    humidityPct: 72,
    soilPct: 49,
    status: "유량 부족",
    mode: "MANUAL",
    healthStatus: "warning",
    irrigationRunning: false,
    skylightLeftOpen: false,
    skylightRightOpen: false,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: true,
    skylightOpen: false,
    sideWindowOpen: true,
  },
  {
    id: "gh-06",
    name: "제6동 · 허브",
    crop: "바질·고수 · 수확기",
    tempC: 22.0,
    humidityPct: 64,
    soilPct: 66,
    status: "안정",
    mode: "AUTO",
    healthStatus: "normal",
    irrigationRunning: false,
    skylightLeftOpen: false,
    skylightRightOpen: true,
    sideWindowLeftOpen: true,
    sideWindowRightOpen: false,
    skylightOpen: true,
    sideWindowOpen: true,
  },
  {
    id: "gh-07",
    name: "제7동 · 시험재배",
    crop: "시험 · DLI 맵",
    tempC: 24.0,
    humidityPct: 59,
    soilPct: 55,
    status: "교정 중",
    mode: "MANUAL",
    healthStatus: "error",
    irrigationRunning: false,
    skylightLeftOpen: true,
    skylightRightOpen: false,
    sideWindowLeftOpen: false,
    sideWindowRightOpen: false,
    skylightOpen: true,
    sideWindowOpen: false,
  },
];

export function getGreenhouseById(id: string): GreenhouseZone | undefined {
  return MOCK_GREENHOUSES.find((z) => z.id === id);
}

/** 온실 상세용 부가 센서 스냅샷(목업) */
export const MOCK_GREENHOUSE_SENSOR_EXTRA: Record<
  string,
  { ecMScm: number; ph: number; co2ppm: number }
> = {
  "gh-01": { ecMScm: 1.2, ph: 6.0, co2ppm: 412 },
  "gh-02": { ecMScm: 2.6, ph: 5.9, co2ppm: 445 },
  "gh-03": { ecMScm: 1.4, ph: 5.8, co2ppm: 398 },
  "gh-04": { ecMScm: 0.9, ph: 6.2, co2ppm: 520 },
  "gh-05": { ecMScm: 1.8, ph: 6.1, co2ppm: 430 },
  "gh-06": { ecMScm: 1.1, ph: 6.0, co2ppm: 405 },
  "gh-07": { ecMScm: 2.1, ph: 5.7, co2ppm: 460 },
};

/** 날씨 상세 — 3일 × 시간대(목업) */
export const MOCK_WEATHER_HOURLY: WeatherDayHourly[] = [
  {
    id: "d1",
    label: "오늘",
    condition: "구름 많음",
    hours: [
      { time: "06:00", tempC: 12, precipPct: 5, windMs: 3.2 },
      { time: "09:00", tempC: 15, precipPct: 10, windMs: 3.8 },
      { time: "12:00", tempC: 18, precipPct: 20, windMs: 4.2 },
      { time: "15:00", tempC: 17, precipPct: 15, windMs: 4.0 },
      { time: "18:00", tempC: 14, precipPct: 12, windMs: 3.6 },
      { time: "21:00", tempC: 13, precipPct: 8, windMs: 3.4 },
    ],
  },
  {
    id: "d2",
    label: "내일",
    condition: "가벼운 비",
    hours: [
      { time: "06:00", tempC: 11, precipPct: 40, windMs: 4.8 },
      { time: "09:00", tempC: 13, precipPct: 55, windMs: 5.2 },
      { time: "12:00", tempC: 15, precipPct: 65, windMs: 5.8 },
      { time: "15:00", tempC: 14, precipPct: 60, windMs: 5.5 },
      { time: "18:00", tempC: 12, precipPct: 45, windMs: 5.0 },
      { time: "21:00", tempC: 11, precipPct: 35, windMs: 4.6 },
    ],
  },
  {
    id: "d3",
    label: "모레",
    condition: "맑음",
    hours: [
      { time: "06:00", tempC: 10, precipPct: 0, windMs: 2.8 },
      { time: "09:00", tempC: 14, precipPct: 0, windMs: 2.9 },
      { time: "12:00", tempC: 18, precipPct: 5, windMs: 3.1 },
      { time: "15:00", tempC: 19, precipPct: 5, windMs: 3.2 },
      { time: "18:00", tempC: 16, precipPct: 2, windMs: 2.9 },
      { time: "21:00", tempC: 13, precipPct: 0, windMs: 2.7 },
    ],
  },
];

export const MOCK_ALARMS: FarmAlarm[] = [
  {
    id: "a1",
    time: "14:32",
    greenhouseName: "제5동 · 생야채(NFT)",
    alarmType: "관수",
    severity: "warning",
    message:
      "밸브 CV-12 설정 유량 대비 15분 평균 유량이 18% 낮습니다.",
  },
  {
    id: "a2",
    time: "13:58",
    greenhouseName: "제2동 · 토마토",
    alarmType: "센서 드리프트",
    severity: "info",
    message:
      "습도 프로브 H-204가 기준 대비 +2.1% 편차입니다. 교정 일정을 등록하세요.",
  },
  {
    id: "a3",
    time: "11:06",
    greenhouseName: "제7동 · 시험재배",
    alarmType: "임계값",
    severity: "error",
    message:
      "캐노피 온도 28.4°C가 상한 27.5°C를 6분간 초과했습니다.",
  },
  {
    id: "a4",
    time: "09:41",
    greenhouseName: "제3동 · 딸기",
    alarmType: "환기",
    severity: "warning",
    message:
      "마루 환기구 개도가 스케줄 V-12 대비 8% 이상 어긋났습니다.",
  },
  {
    id: "a5",
    time: "08:12",
    greenhouseName: "부지 · 전기실",
    alarmType: "전원",
    severity: "info",
    message:
      "B상 순간 전류 변동 1.8초 — 발전기는 가동하지 않음(로그만 기록).",
  },
];

/** 대시보드 요약에 표시할 단일 알람 */
export const MOCK_LATEST_ALARM: FarmAlarm = MOCK_ALARMS[0]!;

export const MOCK_WORK_INSTRUCTIONS: WorkInstruction[] = [
  {
    id: "w1",
    dueDate: "2026-05-04",
    greenhouseName: "제5동 · 생야채(NFT)",
    taskType: "관수 점검",
    instruction:
      "여과 압력 확인, C–D열 드리퍼 점검, 플러시 후 EC 확인.",
    status: "in-progress",
  },
  {
    id: "w2",
    dueDate: "2026-05-04",
    greenhouseName: "제2동 · 토마토",
    taskType: "양액 스케줄",
    instruction:
      "원액 탱크 B 주입량 확인, 2채널 pH 목표 5.8–6.2 기록.",
    status: "pending",
  },
  {
    id: "w3",
    dueDate: "2026-05-05",
    greenhouseName: "제3동 · 딸기",
    taskType: "환기 점검",
    instruction:
      "마루 개폐기 동작 시간과 BMS 스케줄 비교, L1–L3 이동 시간 기록.",
    status: "pending",
  },
  {
    id: "w4",
    dueDate: "2026-05-05",
    greenhouseName: "제1동 · 관리동",
    taskType: "공기 유입 점검",
    instruction:
      "루버 L1–L3 유입 속도 측정, BMS PID 출력 40–65%와 비교.",
    status: "pending",
  },
  {
    id: "w5",
    dueDate: "2026-05-06",
    greenhouseName: "제6동 · 허브",
    taskType: "병해충 순찰",
    instruction:
      "끈끈이 트랩 확인 및 줄 사진 기록, 총채벌레 수 기준 초과 시 보고.",
    status: "done",
  },
];
