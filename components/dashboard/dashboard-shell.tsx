"use client";

import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  Settings2,
  Warehouse,
} from "lucide-react";

import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { ClimateSensors } from "@/components/dashboard/climate-sensors";
import { FarmSummary } from "@/components/dashboard/farm-summary";
import { GreenhouseGrid } from "@/components/dashboard/greenhouse-grid";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { WeatherForecast } from "@/components/dashboard/weather-forecast";
import { WorkInstructions } from "@/components/dashboard/work-instructions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_ALARMS,
  MOCK_CLIMATE_SENSORS,
  MOCK_GREENHOUSES,
  MOCK_SUMMARY,
  MOCK_WEATHER,
  MOCK_WORK_INSTRUCTIONS,
} from "@/lib/dashboard/mock-data";

const alarms = MOCK_ALARMS.slice(0, 5);
const work = MOCK_WORK_INSTRUCTIONS.slice(0, 5);

export function DashboardShell() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-[1580px] px-4 py-4 sm:px-5 sm:py-5">
        <DashboardToolbar />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Control center
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Jeju smart farm · supervisory view
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs shadow-sm"
            type="button"
          >
            <Settings2 className="size-3.5 opacity-70" aria-hidden />
            Preferences
          </Button>
        </div>

        {/* Desktop */}
        <div className="mt-4 hidden gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <main className="min-w-0 space-y-4">
            <FarmSummary summary={MOCK_SUMMARY} />
            <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
              <WeatherForecast days={MOCK_WEATHER} />
              <ClimateSensors sensors={MOCK_CLIMATE_SENSORS} />
            </div>
            <div className="overflow-y-auto overscroll-contain lg:max-h-[calc(100dvh-15.5rem)] lg:pr-1">
              <GreenhouseGrid zones={MOCK_GREENHOUSES} />
            </div>
          </main>
          <aside className="sticky top-4 flex max-h-[calc(100dvh-6rem)] flex-col gap-4 overflow-y-auto overscroll-contain pb-4">
            <RecentAlarms alarms={alarms} scrollClassName="max-h-none overflow-visible" />
            <WorkInstructions items={work} scrollClassName="max-h-none overflow-visible" />
          </aside>
        </div>

        {/* Mobile / tablet */}
        <div className="mt-4 lg:hidden">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 grid h-auto min-h-10 w-full grid-cols-4 gap-1 rounded-xl border border-border/50 bg-muted/25 p-1">
              <TabsTrigger
                value="overview"
                className="gap-1 rounded-lg py-2 text-[11px] data-active:shadow-sm"
              >
                <LayoutDashboard className="size-3.5 opacity-70" aria-hidden />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="houses"
                className="gap-1 rounded-lg py-2 text-[11px] data-active:shadow-sm"
              >
                <Warehouse className="size-3.5 opacity-70" aria-hidden />
                Houses
              </TabsTrigger>
              <TabsTrigger
                value="alarms"
                className="gap-1 rounded-lg py-2 text-[11px] data-active:shadow-sm"
              >
                <Bell className="size-3.5 opacity-70" aria-hidden />
                Alarms
              </TabsTrigger>
              <TabsTrigger
                value="work"
                className="gap-1 rounded-lg py-2 text-[11px] data-active:shadow-sm"
              >
                <ClipboardList className="size-3.5 opacity-70" aria-hidden />
                Work
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-3 outline-none">
              <FarmSummary summary={MOCK_SUMMARY} />
              <WeatherForecast days={MOCK_WEATHER} />
              <ClimateSensors sensors={MOCK_CLIMATE_SENSORS} />
            </TabsContent>

            <TabsContent value="houses" className="mt-0 outline-none">
              <GreenhouseGrid zones={MOCK_GREENHOUSES} />
            </TabsContent>

            <TabsContent value="alarms" className="mt-0 outline-none">
              <RecentAlarms
                alarms={alarms}
                scrollClassName="max-h-[calc(100dvh-13rem)] overflow-y-auto"
              />
            </TabsContent>

            <TabsContent value="work" className="mt-0 outline-none">
              <WorkInstructions
                items={work}
                scrollClassName="max-h-[calc(100dvh-13rem)] overflow-y-auto"
              />
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-[11px] lg:mt-8">
          Mock data only · Production control APIs not connected
        </p>
      </div>
    </div>
  );
}
