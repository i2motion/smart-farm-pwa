"use client";

import { CameraStillFrame } from "@/components/cameras/camera-still-frame";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { FarmCamera } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

function PreviewSlide({ cam, cameraNumber }: { cam: FarmCamera; cameraNumber: number }) {
  const offline = cam.status === "offline";

  return (
    <Link
      href="/cameras"
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg transition-[transform,box-shadow] duration-300 ease-out",
        "aspect-[2.4/1] max-md:max-h-[118px] md:aspect-video md:rounded-3xl",
        "ring-1 ring-white/[0.06] hover:ring-white/[0.1]",
        "sf-tesla-hover",
        offline && "opacity-90"
      )}
    >
      <div className="absolute inset-0 bg-black">
        <CameraStillFrame imageUrl={cam.imageUrl} priority={cameraNumber === 1} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent md:from-black/85 md:via-black/40"
        aria-hidden
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 px-2 pb-1.5 pt-5 md:px-5 md:pb-5 md:pt-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45 md:text-[11px] md:tracking-[0.14em]">
          {cameraNumber}
        </p>
        <p className="mt-0 truncate text-[15px] font-semibold leading-tight tracking-tight text-white/95 md:mt-0.5 md:text-[17px]">
          {cam.name}
        </p>
      </div>

      {!offline ? (
        <span className="absolute right-1.5 top-1.5 z-[1] rounded border border-white/10 bg-black/35 px-1 py-px text-[9px] font-semibold uppercase tracking-wider text-white/50 backdrop-blur-sm md:right-3 md:top-3 md:rounded-full md:px-2 md:py-0.5 md:text-[11px] md:backdrop-blur-md">
          RTSP
        </span>
      ) : (
        <span className="absolute right-1.5 top-1.5 z-[1] rounded border border-white/10 bg-black/45 px-1 py-px text-[9px] font-semibold uppercase tracking-wider text-white/45 backdrop-blur-sm md:right-3 md:top-3 md:rounded-full md:px-2 md:py-0.5 md:text-[11px] md:backdrop-blur-md">
          끊김
        </span>
      )}
    </Link>
  );
}

export function DashboardCameraPreview({ cameras }: { cameras: FarmCamera[] }) {
  const n = cameras.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const safe = n > 0 ? ((index % n) + n) % n : 0;

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || n <= 0) return;
    const w = el.offsetWidth;
    if (w <= 0) return;
    const i = Math.round(el.scrollLeft / w);
    const clamped = Math.max(0, Math.min(n - 1, i));
    setIndex((prev) => (prev === clamped ? prev : clamped));
  }, [n]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncIndexFromScroll, { passive: true });
    return () => el.removeEventListener("scroll", syncIndexFromScroll);
  }, [syncIndexFromScroll]);

  const go = useCallback(
    (dir: -1 | 1) => {
      const el = scrollRef.current;
      if (!el || n <= 0) return;
      const w = el.offsetWidth;
      const next = (safe + dir + n) % n;
      el.scrollTo({ left: next * w, behavior: "smooth" });
      setIndex(next);
    },
    [n, safe]
  );

  if (n === 0) return null;

  return (
    <div className="sf-glass rounded-xl p-3 ring-1 ring-white/[0.04] md:rounded-3xl md:p-4 md:ring-0 lg:p-4 lg:pb-4">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5 md:mb-2.5 md:gap-3">
        <div className="min-w-0 leading-tight">
          <p className="sf-section-label">카메라</p>
          <p className="text-muted-foreground mt-0 text-[12px] font-medium tabular-nums tracking-tight md:mt-0.5 md:text-[13px]">
            {safe + 1} / {n}
          </p>
        </div>
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-10 touch-manipulation rounded-full border border-transparent text-muted-foreground hover:border-white/[0.08] hover:bg-white/[0.04] md:size-9"
            onClick={() => go(-1)}
            aria-label="이전"
          >
            <ChevronLeft className="size-[18px] stroke-[1] md:size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-10 touch-manipulation rounded-full border border-transparent text-muted-foreground hover:border-white/[0.08] hover:bg-white/[0.04] md:size-9"
            onClick={() => go(1)}
            aria-label="다음"
          >
            <ChevronRight className="size-[18px] stroke-[1] md:size-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg md:rounded-3xl">
        <div
          ref={scrollRef}
          className={cn(
            "flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {cameras.map((c, i) => (
            <div key={c.id} className="w-full min-w-[100%] shrink-0 snap-start">
              <PreviewSlide cam={c} cameraNumber={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
