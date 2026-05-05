"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { WorkInstructions } from "@/components/dashboard/work-instructions";
import { AIOperationReport } from "@/components/work/ai-operation-report";
import { ControlOrderDrafts } from "@/components/work/control-order-drafts";
import { FarmDiaryDetail } from "@/components/work/farm-diary-detail";
import { FarmDiaryForm } from "@/components/work/farm-diary-form";
import { FarmDiaryList } from "@/components/work/farm-diary-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkInstruction } from "@/lib/dashboard/types";
import { MOCK_GREENHOUSES } from "@/lib/dashboard/mock-data";
import {
  MOCK_AI_OPERATION_REPORT,
  MOCK_CONTROL_ORDER_DRAFTS,
  MOCK_FARM_DIARY_ENTRIES,
} from "@/lib/work/mock-data";
import type { ControlOrderDraft, FarmDiaryEntry } from "@/lib/work/types";
import { cn } from "@/lib/utils";

export type WorkPageShellProps = {
  workInstructionItems: WorkInstruction[];
};

export function WorkPageShell({ workInstructionItems }: WorkPageShellProps) {
  const greenhouseOptions = useMemo(
    () => MOCK_GREENHOUSES.map((z) => ({ id: z.id, name: z.name, crop: z.crop })),
    []
  );
  const cropOptions = useMemo(() => Array.from(new Set(MOCK_GREENHOUSES.map((z) => z.crop))), []);
  const greenhouseFilterOptions = useMemo(
    () => MOCK_GREENHOUSES.map((z) => ({ id: z.id, label: z.name })),
    []
  );

  const [diaryEntries, setDiaryEntries] = useState<FarmDiaryEntry[]>(() => [...MOCK_FARM_DIARY_ENTRIES]);
  const [selectedDiary, setSelectedDiary] = useState<FarmDiaryEntry | null>(null);
  const [drafts, setDrafts] = useState<ControlOrderDraft[]>(() => [...MOCK_CONTROL_ORDER_DRAFTS]);

  function nowIso() {
    return new Date().toISOString();
  }

  function addDiaryEntry(payload: Omit<FarmDiaryEntry, "id" | "createdAt">) {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? `fd-${crypto.randomUUID().slice(0, 8)}` : `fd-${Date.now()}`;
    const row: FarmDiaryEntry = {
      ...payload,
      id,
      createdAt: nowIso(),
    };
    setDiaryEntries((prev) => [row, ...prev]);
  }

  function patchDraft(id: string, patch: Partial<ControlOrderDraft>) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6 pb-16 md:space-y-8 md:pb-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h1 className="sf-page-title">작업</h1>
            <p className="sf-page-sub">운영 큐 · 농사일지 · AI 보고 · 제어 초안 — 목업 로컬 상태</p>
          </div>
          <p className="text-muted-foreground max-w-prose rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2 text-[11px] leading-relaxed md:text-[12px]">
            AI는 제어를 직접 실행하지 않습니다. 초안·보고는 참고용이며, 현장·PLC 정책과 승인 후 실행 계층에서만 반영됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-xl">
              대시보드
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full gap-5">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList variant="line" className="min-w-full justify-start gap-0 bg-transparent p-0 sm:min-w-0">
            <TabsTrigger value="tasks" className="shrink-0 px-3 text-[12px] md:text-[13px]">
              작업할 업무
            </TabsTrigger>
            <TabsTrigger value="diary" className="shrink-0 px-3 text-[12px] md:text-[13px]">
              농사일지
            </TabsTrigger>
            <TabsTrigger value="ai-report" className="shrink-0 px-3 text-[12px] md:text-[13px]">
              AI 운영보고
            </TabsTrigger>
            <TabsTrigger value="drafts" className="shrink-0 px-3 text-[12px] md:text-[13px]">
              제어명령 초안
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks" className="mt-0 space-y-4">
          <WorkInstructions items={workInstructionItems} scrollClassName="max-h-[min(70vh,560px)] overflow-y-auto" />
        </TabsContent>

        <TabsContent value="diary" keepMounted className="mt-0 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <FarmDiaryForm greenhouseOptions={greenhouseOptions} cropOptions={cropOptions} onSubmit={addDiaryEntry} />
            <div
              className={cn(
                "sf-surface rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md md:p-5"
              )}
            >
              <FarmDiaryList
                entries={diaryEntries}
                onSelectEntry={setSelectedDiary}
                greenhouseFilterOptions={greenhouseFilterOptions}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-report" className="mt-0">
          <div className="sf-surface rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 md:p-6">
            <AIOperationReport report={MOCK_AI_OPERATION_REPORT} />
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="mt-0">
          <div className="sf-surface rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 md:p-6">
            <ControlOrderDrafts
              drafts={drafts}
              onApprove={(id) =>
                patchDraft(id, {
                  status: "approved",
                  lastActionAt: nowIso(),
                  lastActionSummary: "승인 (현장·PLC 적용 전)",
                })
              }
              onHold={(id) =>
                patchDraft(id, {
                  status: "on_hold",
                  lastActionAt: nowIso(),
                  lastActionSummary: "보류",
                })
              }
              onReject={(id) =>
                patchDraft(id, {
                  status: "rejected",
                  lastActionAt: nowIso(),
                  lastActionSummary: "거부",
                })
              }
              onSaveEdit={(id, proposedCommand) =>
                patchDraft(id, {
                  proposedCommand,
                  lastActionAt: nowIso(),
                  lastActionSummary: "명령 문구 수정 (승인 전)",
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <FarmDiaryDetail entry={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
}
