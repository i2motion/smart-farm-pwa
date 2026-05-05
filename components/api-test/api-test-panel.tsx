"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFarmApiBaseUrl } from "@/lib/api/api-client";
import {
  API_TEST_ENV_DEFAULT_BASE_URL,
  API_TEST_GET_ENDPOINTS,
  type ApiTestEndpoint,
  type ApiTestResult,
  runAllApiTestGets,
  runApiTestGet,
} from "@/lib/api/api-test";
import { cn } from "@/lib/utils";

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function ApiTestPanel() {
  const baseUrl = useMemo(() => getFarmApiBaseUrl(), []);
  const [resultsById, setResultsById] = useState<Record<string, ApiTestResult>>({});
  const [runningAll, setRunningAll] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  const runOne = useCallback(async (endpoint: ApiTestEndpoint) => {
    setRunningId(endpoint.id);
    try {
      const r = await runApiTestGet(endpoint);
      setResultsById((prev) => ({ ...prev, [endpoint.id]: r }));
    } finally {
      setRunningId(null);
    }
  }, []);

  const runAll = useCallback(async () => {
    setRunningAll(true);
    try {
      const list = await runAllApiTestGets();
      const next: Record<string, ApiTestResult> = {};
      for (const r of list) next[r.endpointId] = r;
      setResultsById(next);
    } finally {
      setRunningAll(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">베이스 URL</CardTitle>
          <CardDescription>
            <code className="text-foreground/90 break-all rounded bg-black/30 px-1.5 py-0.5 text-[12px]">
              {baseUrl}
            </code>
            <span className="text-muted-foreground mt-2 block text-[11px]">
              환경 변수 <code className="text-foreground/80">NEXT_PUBLIC_FARM_API_BASE_URL</code> — 미설정 시{" "}
              <code className="text-foreground/80">{API_TEST_ENV_DEFAULT_BASE_URL}</code>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void runAll()} disabled={runningAll || runningId !== null}>
            {runningAll ? "실행 중…" : "모든 엔드포인트 테스트"}
          </Button>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            대시보드로
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {API_TEST_GET_ENDPOINTS.map((ep) => {
          const r = resultsById[ep.id];
          const busy = runningId === ep.id;
          return (
            <Card key={ep.id} className="border-white/[0.08] bg-white/[0.03]">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-[15px] font-semibold">{ep.label}</CardTitle>
                  <CardDescription>
                    <code className="text-foreground/85 text-[12px]">{ep.path}</code>
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => void runOne(ep)}
                  disabled={runningAll || busy}
                >
                  {busy ? "요청 중…" : "실행"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {r ? (
                  <>
                    <div className="text-[11px] text-muted-foreground">
                      요청 URL{" "}
                      <code className="text-foreground/90 break-all rounded bg-black/30 px-1 py-0.5 text-[11px]">
                        {r.requestUrl}
                      </code>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[12px]">
                      <span className="text-muted-foreground">HTTP</span>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-mono text-[11px] font-medium",
                          r.httpStatus === null
                            ? "bg-amber-500/15 text-amber-100"
                            : r.httpStatus >= 200 && r.httpStatus < 300
                              ? "bg-emerald-500/15 text-emerald-100"
                              : "bg-red-500/15 text-red-100"
                        )}
                      >
                        {r.httpStatus === null ? "—" : r.httpStatus}
                      </span>
                      <span className="text-muted-foreground">{r.durationMs} ms</span>
                    </div>
                    {r.errorMessage ? (
                      <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-[12px] text-red-100">
                        {r.errorMessage}
                      </div>
                    ) : null}
                    {r.rawBody !== null && r.rawBody.length > 0 ? (
                      <div>
                        <p className="text-muted-foreground mb-1 text-[11px] font-medium uppercase tracking-wide">
                          본문 (JSON 아님)
                        </p>
                        <pre className="max-h-64 overflow-auto rounded-lg border border-white/[0.06] bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
                          {r.rawBody.length > 12_000 ? `${r.rawBody.slice(0, 12_000)}…` : r.rawBody}
                        </pre>
                      </div>
                    ) : null}
                    {r.responseJson !== null ? (
                      <div>
                        <p className="text-muted-foreground mb-1 text-[11px] font-medium uppercase tracking-wide">
                          응답 JSON
                        </p>
                        <pre className="max-h-80 overflow-auto rounded-lg border border-white/[0.06] bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
                          {formatJson(r.responseJson)}
                        </pre>
                      </div>
                    ) : null}
                    {!r.responseJson && (!r.rawBody || r.rawBody.length === 0) && r.httpStatus !== null ? (
                      <p className="text-muted-foreground text-[12px]">응답 본문 없음</p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-muted-foreground text-[13px]">실행하면 결과가 표시됩니다.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
