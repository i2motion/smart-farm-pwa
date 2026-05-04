import { redirect } from "next/navigation";

/** 구 경로 호환 — 자동/수동 제어는 장비 페이지로 통합되었습니다. */
export default function AutoManualRedirectPage() {
  redirect("/devices");
}
