"use client";

import { Camera, ImageIcon, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { createPhotoAttachment, revokePhotoPreview } from "@/lib/work/photo-utils";
import type { FarmDiaryPhotoAttachment } from "@/lib/work/types";
import { cn } from "@/lib/utils";

export type FarmDiaryPhotoPickerProps = {
  photos: FarmDiaryPhotoAttachment[];
  onPhotosChange: (next: FarmDiaryPhotoAttachment[]) => void;
  className?: string;
};

export function FarmDiaryPhotoPicker({ photos, onPhotosChange, className }: FarmDiaryPhotoPickerProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    return () => {
      for (const p of photosRef.current) {
        revokePhotoPreview(p);
      }
    };
  }, []);

  function appendFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next = [...photos];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file || !file.type.startsWith("image/")) continue;
      next.push(createPhotoAttachment(file));
    }
    onPhotosChange(next);
    if (cameraRef.current) cameraRef.current.value = "";
    if (albumRef.current) albumRef.current.value = "";
  }

  function remove(id: string) {
    const target = photos.find((p) => p.id === id);
    if (target) revokePhotoPreview(target);
    onPhotosChange(photos.filter((p) => p.id !== id));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => appendFiles(e.target.files)}
      />
      <input
        ref={albumRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => appendFiles(e.target.files)}
      />

      <div>
        <p className="text-muted-foreground mb-2 text-[11px] font-medium">사진 첨부</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full touch-manipulation justify-center gap-2 rounded-xl sm:h-10 sm:min-w-[8.5rem]"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="size-4 shrink-0 opacity-90" aria-hidden />
            사진 촬영
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full touch-manipulation justify-center gap-2 rounded-xl sm:h-10 sm:min-w-[8.5rem]"
            onClick={() => albumRef.current?.click()}
          >
            <ImageIcon className="size-4 shrink-0 opacity-90" aria-hidden />
            앨범 선택
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
          모바일에서 촬영·갤러리 다중 선택을 지원합니다. 브라우저·OS에 따라 동작이 다를 수 있습니다. 데이터는 이 기기 메모리(목업)에만
          남습니다.
        </p>
      </div>

      {photos.length > 0 ? (
        <div>
          <p className="text-muted-foreground mb-2 text-[11px] font-medium">사진 미리보기</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {photos.map((p) => (
              <li
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-black/30 ring-1 ring-white/[0.05]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 로컬 미리보기 */}
                <img src={p.previewUrl} alt="" className="size-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1.5 pt-6">
                  {p.fileName ? (
                    <p className="truncate text-[9px] font-medium text-white/80">{p.fileName}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute right-1.5 top-1.5 h-8 min-h-[36px] min-w-[36px] rounded-full px-2 text-[10px] shadow-md touch-manipulation sm:min-h-8 sm:gap-0.5 sm:px-2.5"
                  onClick={() => remove(p.id)}
                  aria-label="사진 삭제"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  <span className="sr-only sm:not-sr-only sm:inline sm:text-[10px]">사진 삭제</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
