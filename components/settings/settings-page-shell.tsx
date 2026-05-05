"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GreenhouseCropsSection } from "@/components/settings/greenhouse-crops-section";
import { MOCK_FARM_META } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "farm",
    title: "농장",
    description: "농장 프로필·식별 정보",
    fields: [
      { key: "farmName", label: "농장명", placeholder: MOCK_FARM_META.farmName, type: "text" as const },
      { key: "tel", label: "대표 연락처", placeholder: MOCK_FARM_META.contactTel, type: "text" as const },
    ],
  },
  {
    id: "ddns",
    title: "DDNS",
    description: "원격 접속 도메인",
    fields: [
      { key: "ddns", label: "도메인", placeholder: "farm.example.com", type: "text" as const },
      { key: "ddnsProvider", label: "제공자", placeholder: "예: DuckDNS", type: "text" as const },
    ],
  },
  {
    id: "camera",
    title: "카메라",
    description: "스트림·녹화 연동",
    fields: [
      { key: "rtsp", label: "RTSP 기본 URL", placeholder: "rtsp://…", type: "text" as const },
    ],
  },
  {
    id: "user",
    title: "사용자",
    description: "계정·역할(향후 SSO)",
    fields: [
      { key: "userEmail", label: "로그인 이메일", placeholder: "operator@farm.local", type: "text" as const },
    ],
  },
  {
    id: "notify",
    title: "알림",
    description: "푸시·SMS·이메일",
    fields: [],
  },
] as const;

export function SettingsPageShell() {
  return (
    <div className="mx-auto max-w-[640px] space-y-5 pb-12 md:space-y-6 md:pb-16">
      <header className="space-y-1">
        <h1 className="sf-page-title">설정</h1>
        <p className="sf-page-sub">농장·PLC·원격·카메라·사용자·알림 — 목업 필드만 표시됩니다.</p>
      </header>

      <div className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] px-3 py-2 text-[11px] leading-relaxed text-amber-50/95 md:text-[12px]">
        실제 저장·PLC 연결은 API 연동 후 활성화됩니다.
      </div>

      <div className="space-y-4">
        <GreenhouseCropsSection />
        {SECTIONS.map((sec) => (
          <section
            key={sec.id}
            className={cn(
              "rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md",
              "md:p-5"
            )}
          >
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{sec.title}</h2>
            <p className="text-muted-foreground mt-1 text-[12px] leading-relaxed">{sec.description}</p>

            {sec.id === "notify" ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                  <span className="text-[13px] text-foreground/90">푸시 알림</span>
                  <Switch checked={false} disabled aria-readonly />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2">
                  <span className="text-[13px] text-foreground/90">이메일 요약</span>
                  <Switch checked={false} disabled aria-readonly />
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {sec.fields.map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key} className="text-muted-foreground text-[11px] font-medium">
                      {f.label}
                    </Label>
                    <Input id={f.key} type={f.type} placeholder={f.placeholder} disabled className="mt-1 h-9" />
                  </div>
                ))}
              </div>
            )}

            <Button type="button" variant="secondary" size="sm" className="mt-4 rounded-full" disabled>
              저장 (미연동)
            </Button>
          </section>
        ))}
      </div>
    </div>
  );
}
