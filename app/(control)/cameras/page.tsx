import type { Metadata } from "next";

import { CameraCard } from "@/components/cameras/camera-card";
import { CamerasSummary } from "@/components/cameras/cameras-summary";
import { MOCK_CAMERAS } from "@/lib/dashboard/mock-data";

export const metadata: Metadata = {
  title: "카메라",
};

export default function CamerasPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="sf-page-title">카메라</h1>
        <p className="sf-page-sub">
          온실·주변 CCTV 채널의 상태·해상도·라이브 영역·AI 검출 요약입니다. 데이터는 목업이며 RTSP 스트림은 아직
          연결하지 않습니다.
        </p>
      </header>

      <CamerasSummary cameras={MOCK_CAMERAS} />

      <section aria-labelledby="cameras-channel-heading">
        <h2 id="cameras-channel-heading" className="sf-section-label mb-4">
          채널 목록
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_CAMERAS.map((cam) => (
            <CameraCard key={cam.id} camera={cam} />
          ))}
        </div>
      </section>
    </div>
  );
}
