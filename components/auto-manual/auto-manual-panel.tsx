"use client";

import { Bot, CalendarClock, Hand, ListTree } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ControlMode } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export function AutoManualPanel() {
  const [fleetMode, setFleetMode] = useState<ControlMode>("AUTO");

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-card/95 via-card to-primary/[0.06] shadow-lg shadow-primary/[0.04] ring-1 ring-border/20">
        <CardHeader className="space-y-1 p-4 sm:p-5">
          <CardTitle className="text-base font-semibold tracking-tight">상위 제어 모드</CardTitle>
          <CardDescription className="text-[11px] sm:text-xs">
            신규 스케줄의 전역 기본값 · 존별 카드는 실시간 모드 표시(목업).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0 sm:px-5 sm:pb-5">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={fleetMode === "AUTO" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-9 gap-2 rounded-full px-4 text-xs font-semibold",
                fleetMode === "AUTO" && "shadow-md shadow-primary/20"
              )}
              onClick={() => setFleetMode("AUTO")}
            >
              <Bot className="size-3.5 stroke-[1.5]" aria-hidden />
              자동
            </Button>
            <Button
              type="button"
              variant={fleetMode === "MANUAL" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-9 gap-2 rounded-full px-4 text-xs font-semibold",
                fleetMode === "MANUAL" && "shadow-md"
              )}
              onClick={() => setFleetMode("MANUAL")}
            >
              <Hand className="size-3.5 stroke-[1.5]" aria-hidden />
              수동
            </Button>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {fleetMode === "AUTO"
              ? "자동 모드에서는 스케줄 서비스 기준으로 환경·관수·환기 스크립트가 실행됩니다(목업)."
              : "수동 모드에서는 운전자가 우선권을 갖고, 자동 제안은 힌트로만 표시됩니다(미구현)."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="rounded-2xl border-0 bg-card/85 shadow-md ring-1 ring-border/18">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
              <CalendarClock className="size-3.5 stroke-[1.5]" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">스케줄</CardTitle>
              <CardDescription className="text-[11px]">주간·야간 설정점 · 목업</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="rounded-xl border border-dashed border-border/40 bg-muted/15 px-3 py-8 text-center">
              <p className="text-muted-foreground text-xs font-medium">스케줄 편집기 자리</p>
              <p className="text-muted-foreground/80 mt-1 text-[10px]">
                CRON 블록·DLI 곡선 등이 여기에 연결됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-card/85 shadow-md ring-1 ring-border/18">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
              <ListTree className="size-3.5 stroke-[1.5]" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">자동화 규칙</CardTitle>
              <CardDescription className="text-[11px]">조건·동작 규칙 · 목업</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="rounded-xl border border-dashed border-border/40 bg-muted/15 px-3 py-8 text-center">
              <p className="text-muted-foreground text-xs font-medium">규칙 엔진 자리</p>
              <p className="text-muted-foreground/80 mt-1 text-[10px]">
                임계 연쇄, 인터록, 안전 상태를 여기서 설정합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
