import {
  CloudSun,
  Droplets,
  Leaf,
  Settings2,
  Sprout,
  ThermometerSun,
  Wind,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const zones = [
  {
    name: "Greenhouse A",
    crop: "Cherry tomato · Week 9",
    tempC: 24.6,
    humidityPct: 63,
    soilPct: 72,
    status: "Stable",
    variant: "secondary" as const,
  },
  {
    name: "NFT Bench 2",
    crop: "Butter lettuce · Week 4",
    tempC: 21.2,
    humidityPct: 71,
    soilPct: 58,
    status: "Watch",
    variant: "outline" as const,
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 px-4 pb-24 pt-6 sm:max-w-3xl sm:px-6 sm:pb-28 sm:pt-8 lg:max-w-5xl lg:gap-8 lg:pb-32">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3">
              <Sprout className="size-3" aria-hidden />
              Live sensors
            </Badge>
            <span className="text-muted-foreground text-xs tabular-nums sm:text-sm">
              Updated 12:08 PM
            </span>
          </div>
          <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Farm overview
          </h1>
          <p className="text-muted-foreground max-w-prose text-sm sm:text-base">
            Jeju smart farm · Mobile-first dashboard for climate, irrigation,
            and crop zones.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button variant="outline" size="sm" className="rounded-full">
            <CloudSun className="size-4" aria-hidden />
            Weather
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Settings2 className="size-4" aria-hidden />
            Alerts
          </Button>
        </div>
      </header>

      <section aria-labelledby="ambient-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="ambient-heading" className="font-heading text-lg font-semibold">
            Ambient
          </h2>
          <Badge variant="outline" className="rounded-full">
            Outdoor · partly cloudy
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card size="sm" className="shadow-sm ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <ThermometerSun className="text-chart-4 size-4" aria-hidden />
                Temperature
              </CardTitle>
              <CardDescription>Inside canopy avg.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-heading text-3xl font-semibold tabular-nums">
                23.1°C
              </p>
            </CardContent>
          </Card>
          <Card size="sm" className="shadow-sm ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Droplets className="text-chart-2 size-4" aria-hidden />
                Humidity
              </CardTitle>
              <CardDescription>RH · sensors 3–6</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={67}>
                <div className="flex w-full items-center gap-2">
                  <ProgressLabel className="sr-only">Humidity</ProgressLabel>
                  <ProgressValue />
                </div>
              </Progress>
              <p className="text-muted-foreground mt-2 text-xs">
                Target band 60–75%
              </p>
            </CardContent>
          </Card>
          <Card size="sm" className="shadow-sm ring-black/5 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wind className="text-chart-3 size-4" aria-hidden />
                Airflow
              </CardTitle>
              <CardDescription>Ventilation inlet</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-heading text-3xl font-semibold tabular-nums">
                1.4 m/s
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Fans auto · Stage 2
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section aria-labelledby="zones-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="zones-heading" className="font-heading text-lg font-semibold">
              Zones
            </h2>
            <p className="text-muted-foreground text-sm">
              Tap a zone on mobile to drill into irrigation schedules next.
            </p>
          </div>
          <Button size="sm" className="rounded-full">
            <Leaf className="size-4" aria-hidden />
            Add sensor
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {zones.map((zone) => (
            <Card key={zone.name} className="shadow-sm ring-black/5">
              <CardHeader className="border-b pb-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>{zone.name}</CardTitle>
                    <CardDescription>{zone.crop}</CardDescription>
                  </div>
                  <Badge variant={zone.variant} className="rounded-full">
                    {zone.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Temp
                    </p>
                    <p className="font-heading mt-1 text-2xl font-semibold tabular-nums">
                      {zone.tempC.toFixed(1)}°C
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Progress value={zone.humidityPct}>
                      <div className="mb-2 flex w-full items-center justify-between gap-2">
                        <ProgressLabel>Humidity</ProgressLabel>
                        <ProgressValue />
                      </div>
                    </Progress>
                  </div>
                </div>
                <div>
                  <Progress value={zone.soilPct}>
                    <div className="mb-2 flex w-full items-center justify-between gap-2">
                      <ProgressLabel>Soil / substrate moisture</ProgressLabel>
                      <ProgressValue />
                    </div>
                  </Progress>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Irrigate when moisture drops below 45% for more than 30 min.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                <Button size="sm" className="rounded-full">
                  Irrigation
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Vent curve
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-muted-foreground mt-auto border-t pt-6 text-center text-xs sm:text-sm">
        Progressive Web App · Install from your browser menu on mobile for a
        full-screen farm console.
      </footer>
    </div>
  );
}
