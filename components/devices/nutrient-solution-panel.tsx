"use client";

import { AlertTriangle, Droplets, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { DevicesConfirmDialog } from "@/components/devices/devices-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { INITIAL_NUTRIENT_STATE, MOCK_NUTRIENT_RECIPES } from "@/lib/devices/nutrient-mock-data";
import type { NutrientPlcConnection, NutrientSolutionState, NutrientSupplyHistoryEntry } from "@/lib/devices/nutrient-types";
import { cn } from "@/lib/utils";

const SAFETY_COPY =
  "양액공급은 작물 생육에 직접 영향을 주므로 확인 후 실행하십시오.";

const NUTRIENT_ACK_LABEL =
  "양액 농도·생육 영향을 인지했으며, 목업 실행이라도 책임 있는 확인을 마쳤습니다.";

function formatDt(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

function plcConnectionDisplay(c: NutrientPlcConnection): { text: string; className: string } {
  if (c === "connected") return { text: "연결됨", className: "text-emerald-400/95" };
  if (c === "degraded") return { text: "불안정", className: "text-amber-400/95" };
  return { text: "끊김", className: "text-rose-400/95" };
}

function recipeLabelFor(recipeId: string): string {
  return MOCK_NUTRIENT_RECIPES.find((r) => r.id === recipeId)?.label ?? recipeId;
}

function targetSummary(zones: NutrientSolutionState["targetZones"]): string {
  return zones.map((z) => z.label.split("·")[0]?.trim() ?? z.label).join(", ");
}

const selectClass =
  "border-input bg-background ring-offset-background flex h-10 w-full min-w-0 rounded-xl border px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-[#0d1219]";

export function NutrientSolutionPanel() {
  const [state, setState] = useState<NutrientSolutionState>(() => ({ ...INITIAL_NUTRIENT_STATE }));
  const [pending, setPending] = useState<null | "start" | "stop">(null);
  const [nutrientAck, setNutrientAck] = useState(false);
  const [plcScreenHint, setPlcScreenHint] = useState(false);

  const plc = useMemo(() => plcConnectionDisplay(state.plcConnection), [state.plcConnection]);
  const currentRecipeLabel = recipeLabelFor(state.selectedRecipeId);

  useEffect(() => {
    setNutrientAck(false);
  }, [pending]);

  function applyStart() {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      supplyActive: true,
      supplySessionStartedAt: now,
      systemStatus: "supplying",
      systemStatusLabel: "공급 중",
    }));
    setPending(null);
  }

  function applyStop() {
    setState((prev) => {
      if (!prev.supplyActive || !prev.supplySessionStartedAt) {
        return {
          ...prev,
          supplyActive: false,
          supplySessionStartedAt: null,
          systemStatus: "idle",
          systemStatusLabel: "정상 · 공급 대기",
        };
      }
      const end = new Date().toISOString();
      const startMs = new Date(prev.supplySessionStartedAt).getTime();
      const durationMin = Math.max(1, Math.round((Date.now() - startMs) / 60_000));
      const entry: NutrientSupplyHistoryEntry = {
        id: `h-${Date.now()}`,
        startedAt: prev.supplySessionStartedAt,
        endedAt: end,
        durationMin,
        recipeLabel: recipeLabelFor(prev.selectedRecipeId),
        targetSummary: targetSummary(prev.targetZones),
      };
      return {
        ...prev,
        supplyActive: false,
        supplySessionStartedAt: null,
        systemStatus: "idle",
        systemStatusLabel: "정상 · 공급 대기",
        lastCompletedSupplyAt: end,
        supplyHistory: [entry, ...prev.supplyHistory].slice(0, 12),
      };
    });
    setPending(null);
  }

  const statusHeadline = state.supplyActive ? "공급 중" : state.systemStatusLabel;

  const confirmTitle = pending === "start" ? "공급 시작" : pending === "stop" ? "공급 중지" : "";
  const confirmDescription =
    pending === "start"
      ? `${SAFETY_COPY} 공급을 시작합니다. 목업이며 실제 양액 PLC는 동작하지 않습니다.`
      : pending === "stop"
        ? `${SAFETY_COPY} 공급을 중지합니다. 목업 로컬 상태만 갱신됩니다.`
        : "";

  return (
    <>
      <section
        className={cn(
          "rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-white/[0.03] to-transparent p-4 shadow-xl shadow-black/20 backdrop-blur-md",
          "md:p-5"
        )}
        aria-labelledby="nutrient-panel-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <Droplets className="size-[1.15rem] stroke-[1.5]" aria-hidden />
            </div>
            <div>
              <h2 id="nutrient-panel-heading" className="text-[15px] font-semibold tracking-tight text-foreground">
                양액공급
              </h2>
              <p className="text-muted-foreground mt-0.5 max-w-prose text-[11px] leading-relaxed">
                감독 화면 · 상세 EC/pH·펌프·탱크·인터록은 양액 PLC·현장 패널에서만 설정합니다.
              </p>
            </div>
          </div>
          {state.supplyActive ? (
            <span className="shrink-0 rounded-full border border-primary/35 bg-primary/15 px-2.5 py-1 text-[10px] font-semibold text-primary">
              공급 중
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wide">PLC 연결 상태</span>
            <span className={cn("text-[13px] font-semibold", plc.className)}>{plc.text}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-full border-white/10 bg-white/[0.03] text-[12px]"
              onClick={() => {
                setPlcScreenHint(true);
                window.setTimeout(() => setPlcScreenHint(false), 4000);
              }}
            >
              <ExternalLink className="size-3.5 opacity-80" aria-hidden />
              PLC 화면 열기
            </Button>
            {plcScreenHint ? (
              <span className="text-muted-foreground max-w-[14rem] text-[10px] leading-snug">
                목업: 현장 터치 패널/HMI로 이동합니다. 웹에서는 열 수 없습니다.
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="양액 상태" highlight>
            <p className="text-[15px] font-semibold leading-snug text-foreground md:text-base">{statusHeadline}</p>
          </StatTile>
          <StatTile label="현재 레시피" highlight>
            <p className="text-[13px] font-medium leading-snug text-foreground/95">{currentRecipeLabel}</p>
          </StatTile>
          <StatTile label="공급 대상" className="sm:col-span-2 lg:col-span-2">
            <p className="text-[12px] font-medium leading-snug text-foreground/95">{targetSummary(state.targetZones)}</p>
          </StatTile>
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <StatTile label="EC" highlight>
            <p className="text-xl font-light tabular-nums text-foreground md:text-2xl">
              {state.currentEcMScm.toFixed(2)}
              <span className="text-muted-foreground ml-1 text-sm font-normal">mS/cm</span>
            </p>
            <p className="text-muted-foreground mt-0.5 text-[10px]">PLC 측정값</p>
          </StatTile>
          <StatTile label="pH" highlight>
            <p className="text-xl font-light tabular-nums text-foreground md:text-2xl">{state.currentPh.toFixed(2)}</p>
            <p className="text-muted-foreground mt-0.5 text-[10px]">PLC 측정값</p>
          </StatTile>
        </div>

        <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
            <div>
              <Label htmlFor="nutrient-recipe" className="text-muted-foreground text-[10px] font-medium">
                레시피 선택
              </Label>
              <select
                id="nutrient-recipe"
                className={cn(selectClass, "mt-1.5")}
                value={state.selectedRecipeId}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    selectedRecipeId: e.target.value,
                  }))
                }
              >
                {MOCK_NUTRIENT_RECIPES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                사전 정의 레시피만 선택 가능합니다. 농도·시퀀스 상세는 PLC에 저장된 값을 따릅니다.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
              <p className="text-muted-foreground text-[10px] font-semibold tracking-wide">완료 시각 (마지막 공급)</p>
              <p className="text-foreground mt-1 text-[13px] font-medium tabular-nums">{formatDt(state.lastCompletedSupplyAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1.5 text-[10px] font-medium">운전 모드</p>
            <div className="flex flex-wrap gap-1.5">
              {(["AUTO", "MANUAL"] as const).map((m) => (
                <Button
                  key={m}
                  type="button"
                  size="sm"
                  variant={state.mode === m ? "default" : "outline"}
                  className="h-9 min-w-[4.5rem] rounded-full text-[12px] font-semibold"
                  onClick={() => setState((p) => ({ ...p, mode: m }))}
                >
                  {m === "AUTO" ? "자동" : "수동"}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground mt-1 text-[10px]">
              자동/수동 전환은 감독 요청이며, 실제 로직·인터록은 PLC에서 처리합니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="h-10 flex-1 touch-manipulation rounded-full sm:max-w-xs"
              disabled={state.supplyActive}
              onClick={() => setPending("start")}
            >
              공급 시작
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 flex-1 touch-manipulation rounded-full sm:max-w-xs"
              disabled={!state.supplyActive}
              onClick={() => setPending("stop")}
            >
              공급 중지
            </Button>
          </div>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wider">최근 공급 이력</p>
          <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/25">
            <table className="w-full min-w-[520px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-muted-foreground">
                  <th className="px-3 py-2 font-medium">시작</th>
                  <th className="px-3 py-2 font-medium">종료</th>
                  <th className="px-3 py-2 font-medium">소요</th>
                  <th className="px-3 py-2 font-medium">레시피</th>
                  <th className="px-3 py-2 font-medium">대상</th>
                </tr>
              </thead>
              <tbody>
                {state.supplyHistory.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="text-foreground/95 px-3 py-2 tabular-nums">{formatDt(row.startedAt)}</td>
                    <td className="text-foreground/95 px-3 py-2 tabular-nums">{formatDt(row.endedAt)}</td>
                    <td className="text-foreground/95 px-3 py-2 tabular-nums">{row.durationMin}분</td>
                    <td className="text-foreground/95 px-3 py-2">{row.recipeLabel}</td>
                    <td className="text-muted-foreground max-w-[10rem] truncate px-3 py-2">{row.targetSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
            요약 목업입니다. 상세 로그·인터록 이력은 PLC에서 확인하세요.
          </p>
        </div>

        <p className="text-muted-foreground mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400/90" aria-hidden />
          {SAFETY_COPY} 웹에서의 시작·중지는 확인 후 목업 상태만 바뀝니다.
        </p>
      </section>

      <DevicesConfirmDialog
        open={pending != null}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel="확인"
        cancelLabel="취소"
        requireAcknowledgement={pending != null}
        acknowledgementLabel={NUTRIENT_ACK_LABEL}
        acknowledged={nutrientAck}
        onAcknowledgedChange={setNutrientAck}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending === "start") applyStart();
          else if (pending === "stop") applyStop();
        }}
      />
    </>
  );
}

function StatTile({
  label,
  children,
  highlight,
  className,
}: {
  label: string;
  children: ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2.5",
        highlight && "border-primary/12 bg-primary/[0.04]",
        className
      )}
    >
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
