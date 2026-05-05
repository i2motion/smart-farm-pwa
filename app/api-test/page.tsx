import type { Metadata } from "next";

import { ApiTestPanel } from "@/components/api-test/api-test-panel";
import { getFarmApiBaseUrl } from "@/lib/api/api-client";

export const metadata: Metadata = {
  title: "API 테스트",
  description: "Farm PC REST 엔드포인트 연결 확인(개발용)",
  robots: { index: false, follow: false },
};

export default function ApiTestPage() {
  const base = getFarmApiBaseUrl();

  return (
    <div className="min-h-dvh bg-background px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Farm API 테스트</h1>
          <p className="text-muted-foreground text-[13px] leading-relaxed md:text-[14px]">
            대시보드·온실 UI는 변경하지 않습니다. 목업 데이터는 그대로이며, 이 페이지만 Farm PC{" "}
            <code className="text-foreground/90 rounded bg-white/[0.06] px-1 py-px text-[12px]">{base}</code> 로 GET
            요청을 보냅니다.
          </p>
        </header>
        <ApiTestPanel />
      </div>
    </div>
  );
}
