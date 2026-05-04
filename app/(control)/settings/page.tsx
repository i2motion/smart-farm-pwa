import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정",
};

export default function SettingsPage() {
  return (
    <div className="rounded-2xl border-0 bg-card/80 p-6 shadow-md ring-1 ring-border/30">
      <h1 className="text-lg font-semibold tracking-tight">설정</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        농장 프로필, 알림, 외부 연동(날씨·결제 등)은 준비 중입니다.
      </p>
    </div>
  );
}
