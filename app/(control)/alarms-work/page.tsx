import { redirect } from "next/navigation";

/** 레거시 경로 — `/alarms`로 통합 */
export default function AlarmsWorkRedirectPage() {
  redirect("/alarms");
}
