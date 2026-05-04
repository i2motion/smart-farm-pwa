"use client";

import { Video } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * 로컬·원격 정지 프레임. 원본 비율이 달라도 16:9 박스 안에 맞춤(레터박스).
 * `public/cameras/camera-1.png` 등 — `next/image`/Sharp 우회를 위해 `<img>` 사용.
 */
export function CameraStillFrame({
  imageUrl,
  className,
  priority = false,
}: {
  imageUrl: string | undefined;
  className?: string;
  /** 첫 슬라이드 등: eager 로딩 */
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !imageUrl || failed;

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black", className)}>
      {!showPlaceholder ? (
        // eslint-disable-next-line @next/next/no-img-element -- 로컬 목업 JPG는 Sharp 파이프라인 회피
        <img
          src={imageUrl}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#060a12] via-[#0a1628] to-[#050508]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.35_0.08_252/0.12),transparent_55%)]" aria-hidden />
          <Video className="relative size-10 stroke-[1] text-muted-foreground/50" aria-hidden />
          <p className="relative mt-3 text-[11px] font-medium tracking-wide text-white/35">이미지 없음</p>
        </div>
      )}
    </div>
  );
}
