"use client";

import type { LucideIcon } from "lucide-react";
import { Fan, PanelRightOpen, SunMedium, Unplug, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ControlButtonGroup } from "@/components/dashboard/control-button-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SectionCard({
  title,
  description,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-0 bg-card/85 shadow-md shadow-black/[0.03] ring-1 ring-border/18",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 pb-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
          <Icon className="size-3.5 stroke-[1.5]" aria-hidden />
        </div>
        <div className="min-w-0 space-y-0.5">
          <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-[11px] leading-snug">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

function OnOffRow({
  label,
  on,
  onOn,
  onOff,
}: {
  label: string;
  on: boolean;
  onOn: () => void;
  onOff: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground text-[11px] font-medium">{label}</span>
      <div className="flex gap-0.5 rounded-md bg-muted/30 p-0.5 ring-1 ring-border/20">
        <Button
          type="button"
          variant={!on ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "h-7 min-w-[2.5rem] rounded-md px-2 text-[11px] font-medium",
            !on && "bg-background/85 shadow-sm dark:bg-background/50"
          )}
          onClick={onOff}
        >
          끄기
        </Button>
        <Button
          type="button"
          variant={on ? "default" : "ghost"}
          size="sm"
          className={cn("h-7 min-w-[2.5rem] rounded-md px-2 text-[11px] font-medium", on && "shadow-sm")}
          onClick={onOn}
        >
          켜기
        </Button>
      </div>
    </div>
  );
}

export function FleetDeviceControls() {
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [skylightOpen, setSkylightOpen] = useState(true);
  const [sideWindowOpen, setSideWindowOpen] = useState(false);
  const [fanOn, setFanOn] = useState(true);
  const [relays, setRelays] = useState([true, false, true, false]);

  const actuators = {
    irrigationOn,
    skylightOpen,
    sideWindowOpen,
    onIrrigationChange: setIrrigationOn,
    onSkylightChange: setSkylightOpen,
    onSideWindowChange: setSideWindowOpen,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <SectionCard title="관수" description="배관 본관 · 목업 밸브 스택" icon={Waves}>
        <ControlButtonGroup {...actuators} visible={["irrigation"]} />
      </SectionCard>

      <SectionCard title="천창" description="리지 개폐 구동기 · 목업" icon={SunMedium}>
        <ControlButtonGroup {...actuators} visible={["skylight"]} />
      </SectionCard>

      <SectionCard title="측창" description="측벽 루버 · 목업" icon={PanelRightOpen}>
        <ControlButtonGroup {...actuators} visible={["sideWindow"]} />
      </SectionCard>

      <SectionCard title="팬" description="VFD 뱅크 GH-A1 · 목업" icon={Fan}>
        <OnOffRow label="팬 뱅크 A" on={fanOn} onOn={() => setFanOn(true)} onOff={() => setFanOn(false)} />
      </SectionCard>

      <SectionCard
        className="sm:col-span-2"
        title="릴레이"
        description="R1–R4 · 조명·보조 부하(목업)"
        icon={Unplug}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {relays.map((r, i) => (
            <OnOffRow
              key={i}
              label={`릴레이 R${i + 1}`}
              on={r}
              onOn={() => setRelays((prev) => prev.map((v, j) => (j === i ? true : v)))}
              onOff={() => setRelays((prev) => prev.map((v, j) => (j === i ? false : v)))}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
