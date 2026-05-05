import { MOCK_GREENHOUSES } from "@/lib/dashboard/mock-data";

import type { NutrientRecipeOption, NutrientSolutionState } from "./nutrient-types";

const supplyTargets = MOCK_GREENHOUSES.filter((z) => ["gh-03", "gh-05", "gh-02"].includes(z.id)).map((z) => ({
  id: z.id,
  label: z.name,
}));

/** PLC에 등록된 사전 정의 레시피(목업). 상세 농도 로직은 PLC 내부. */
export const MOCK_NUTRIENT_RECIPES: NutrientRecipeOption[] = [
  { id: "rcp-a", label: "일반 성장 A (토마토)" },
  { id: "rcp-b", label: "성숙기 B (토마토)" },
  { id: "rcp-c", label: "딸기 개화기 C" },
  { id: "rcp-d", label: "육묘·미스트 D" },
];

const targetSummary = supplyTargets.map((z) => z.label.split("·")[0]?.trim() ?? z.label).join(", ");

export const INITIAL_NUTRIENT_STATE: NutrientSolutionState = {
  mode: "AUTO",
  supplyActive: false,
  plcConnection: "connected",
  systemStatus: "idle",
  systemStatusLabel: "정상 · 공급 대기",
  currentEcMScm: 1.65,
  currentPh: 5.95,
  selectedRecipeId: "rcp-a",
  targetZones: supplyTargets,
  lastCompletedSupplyAt: "2026-05-04T07:42:00.000Z",
  supplySessionStartedAt: null,
  supplyHistory: [
    {
      id: "h-1",
      startedAt: "2026-05-04T07:30:00.000Z",
      endedAt: "2026-05-04T07:42:00.000Z",
      durationMin: 12,
      recipeLabel: "일반 성장 A (토마토)",
      targetSummary,
    },
    {
      id: "h-2",
      startedAt: "2026-05-03T15:28:00.000Z",
      endedAt: "2026-05-03T15:40:00.000Z",
      durationMin: 12,
      recipeLabel: "일반 성장 A (토마토)",
      targetSummary,
    },
    {
      id: "h-3",
      startedAt: "2026-05-03T06:25:00.000Z",
      endedAt: "2026-05-03T06:38:00.000Z",
      durationMin: 13,
      recipeLabel: "성숙기 B (토마토)",
      targetSummary: "제2동",
    },
  ],
};

/** 향후 REST 연동용 경로 (호출하지 않음) */
export const NUTRIENT_API_PATHS = {
  status: "/nutrient/status",
  mode: "/nutrient/mode",
  recipe: "/nutrient/recipe",
  supplyStart: "/nutrient/supply/start",
  supplyStop: "/nutrient/supply/stop",
  history: "/nutrient/history",
} as const;

export async function fetchNutrientStatus(): Promise<never> {
  void NUTRIENT_API_PATHS.status;
  throw new Error("PLC/API 미연동 — 로컬 목업 상태를 사용하세요.");
}

export async function postNutrientMode(): Promise<never> {
  void NUTRIENT_API_PATHS.mode;
  throw new Error("PLC/API 미연동");
}

export async function postNutrientRecipe(): Promise<never> {
  void NUTRIENT_API_PATHS.recipe;
  throw new Error("PLC/API 미연동");
}

export async function postNutrientSupplyStart(): Promise<never> {
  void NUTRIENT_API_PATHS.supplyStart;
  throw new Error("PLC/API 미연동");
}

export async function postNutrientSupplyStop(): Promise<never> {
  void NUTRIENT_API_PATHS.supplyStop;
  throw new Error("PLC/API 미연동");
}

export async function fetchNutrientHistory(): Promise<never> {
  void NUTRIENT_API_PATHS.history;
  throw new Error("PLC/API 미연동");
}
