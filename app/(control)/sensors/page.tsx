import { redirect } from "next/navigation";

/** 구 경로 호환 — 센서 상세·차트는 대시보드 요약 및 각 온실 상세에서 확인합니다. */
export default function SensorsRedirectPage() {
  redirect("/dashboard");
}
