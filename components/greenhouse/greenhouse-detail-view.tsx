"use client";

import { Activity, ArrowLeft, Droplets, Gauge, Leaf, Thermometer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ControlButtonGroup } from "@/components/dashboard/control-button-group";
import { Button } from "@/components/ui/button";
import { MOCK_GREENHOUSE_SENSOR_EXTRA } from "@/lib/dashboard/mock-data";
import type { ControlMode, GreenhouseZone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ControlMode;
  onChange: (m: ControlMode) => void;
}) {
  return (
    <div className="flex gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-sm">
      <Button
        type="button"
        variant={mode === "AUTO" ? "default" : "ghost"}
        size="sm"
        className={cn("h-8 flex-1 rounded-full text-[12px] font-medium", mode === "AUTO" && "shadow-sm")}
        onClick={() => onChange("AUTO")}
      >
        자동
      </Button>
      <Button
        type="button"
        variant={mode === "MANUAL" ? "default" : "ghost"}
        size="sm"
        className={cn("h-8 flex-1 rounded-full text-[12px] font-medium", mode === "MANUAL" && "shadow-sm")}
        onClick={() => onChange("MANUAL")}
      >
        수동
      </Button>
    </div>
  );
}

function SensorTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3 stroke-[1]" aria-hidden />
        <span className="text-[10px] font-medium uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="mt-2 text-[1.35rem] font-extralight tabular-nums tracking-tight text-foreground">{value}</p>
      {sub ? <p className="text-muted-foreground mt-0.5 text-[11px]">{sub}</p> : null}
    </div>
  );
}

export function GreenhouseDetailView({ zone }: { zone: GreenhouseZone }) {
  const extra = MOCK_GREENHOUSE_SENSOR_EXTRA[zone.id] ?? {
    ecMScm: 1.5,
    ph: 6.0,
    co2ppm: 420,
  };

  const [mode, setMode] = useState<ControlMode>(zone.mode);
  const [irrigationOn, setIrrigationOn] = useState(zone.irrigationRunning);
  const [skylightOpen, setSkylightOpen] = useState(zone.skylightOpen);
  const [sideWindowOpen, setSideWindowOpen] = useState(zone.sideWindowOpen);

  const actuators = {
    irrigationOn,
    skylightOpen,
    sideWindowOpen,
    onIrrigationChange: setIrrigationOn,
    onSkylightChange: setSkylightOpen,
    onSideWindowChange: setSideWindowOpen,
  };

  return (
    <div className="mx-auto max-w-[720px] space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200"
        >
          <ArrowLeft className="size-3.5 stroke-[1]" aria-hidden />
          대시보드
        </Link>
      </div>

      <header className="space-y-1">
        <div className="flex items-start gap-2">
          <Leaf className="text-primary mt-0.5 size-4 shrink-0 stroke-[1]" aria-hidden />
          <div>
            <h1 className="sf-page-title">{zone.name}</h1>
            <p className="sf-page-sub">{zone.crop}</p>
          </div>
        </div>
      </header>

      <section aria-labelledby="gh-sensors-heading">
        <h2 id="gh-sensors-heading" className="sf-section-label mb-4">
          센서
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SensorTile
            icon={Thermometer}
            label="온도"
            value={`${zone.tempC.toFixed(1)}°C`}
            sub="캐노피 근처"
          />
          <SensorTile icon={Droplets} label="습도" value={`${zone.humidityPct}%`} sub="상대습도" />
          <SensorTile
            icon={Gauge}
            label="토양·매트"
            value={`${zone.soilPct}%`}
            sub="체적수분 추정"
          />
          <SensorTile
            icon={Gauge}
            label="EC"
            value={`${extra.ecMScm.toFixed(1)} mS/cm`}
            sub="배액"
          />
          <SensorTile icon={Gauge} label="pH" value={extra.ph.toFixed(1)} sub="배액" />
          <SensorTile
            icon={Activity}
            label="CO₂"
            value={`${extra.co2ppm} ppm`}
            sub="실내"
          />
        </div>
      </section>

      <section
        className="sf-glass rounded-3xl p-5"
        aria-labelledby="gh-mode-heading"
      >
        <h2 id="gh-mode-heading" className="sf-section-label mb-4">
          모드
        </h2>
        <p className="text-muted-foreground mb-4 text-[11px] leading-relaxed">목업 UI</p>
        <ModeToggle mode={mode} onChange={setMode} />
      </section>

      <section
        className="sf-glass rounded-3xl p-5"
        aria-labelledby="gh-device-heading"
      >
        <h2 id="gh-device-heading" className="sf-section-label mb-4">
          장비
        </h2>
        <ControlButtonGroup {...actuators} />
      </section>
    </div>
  );
}
