import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "센서",
};

export default function SensorsPage() {
  return (
    <div className="rounded-2xl border-0 bg-card/80 p-6 shadow-md ring-1 ring-border/30">
      <h1 className="text-lg font-semibold tracking-tight">센서</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        밭·온실 센서 지도와 계측 목록은 준비 중입니다. 텔레메트리 연동 후 이 화면에 표시됩니다.
      </p>
    </div>
  );
}
