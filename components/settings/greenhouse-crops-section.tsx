"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGreenhouses } from "@/lib/api/farm-api";
import { shouldUseFarmHttp } from "@/lib/api/farm-env";
import { patchGreenhouseProfile } from "@/lib/api/greenhouse-api";
import type { GreenhouseProfilePatchDto } from "@/lib/api/types";
import { MOCK_GREENHOUSES } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

type RowState = {
  id: string;
  name: string;
  cropName: string;
};

function cloneRows(r: RowState[]): RowState[] {
  return r.map((x) => ({ ...x }));
}

function rowsFromMocks(): RowState[] {
  return MOCK_GREENHOUSES.map((z) => ({ id: z.id, name: z.name, cropName: z.crop })).sort((a, b) =>
    a.id.localeCompare(b.id)
  );
}

function rowsEqual(a: RowState[], b: RowState[]): boolean {
  if (a.length !== b.length) return false;
  const bm = new Map(b.map((r) => [r.id, r]));
  return a.every((r) => {
    const o = bm.get(r.id);
    return o != null && o.name === r.name && o.cropName === r.cropName;
  });
}

export function GreenhouseCropsSection() {
  const farmHttp = shouldUseFarmHttp();
  const [rows, setRows] = useState<RowState[]>([]);
  const [baseline, setBaseline] = useState<RowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const hydrateFromMocks = useCallback(() => {
    const m = rowsFromMocks();
    setRows(cloneRows(m));
    setBaseline(cloneRows(m));
  }, []);

  const reloadFromApi = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    const res = await getGreenhouses();
    setLoading(false);
    if (!res.ok) {
      setMsg(res.error.message);
      hydrateFromMocks();
      return;
    }
    const m = [...res.data]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((s) => ({
        id: s.id,
        name: s.name.trim(),
        cropName: (s.cropName?.trim() || s.crop).trim(),
      }));
    setRows(cloneRows(m));
    setBaseline(cloneRows(m));
  }, [hydrateFromMocks]);

  useEffect(() => {
    if (!farmHttp) {
      setLoading(false);
      hydrateFromMocks();
      return;
    }
    void reloadFromApi();
  }, [farmHttp, hydrateFromMocks, reloadFromApi]);

  const dirty = useMemo(() => !rowsEqual(rows, baseline), [rows, baseline]);

  async function onSave() {
    if (!farmHttp || saving || !dirty) return;
    for (const r of rows) {
      if (!r.name.trim() || !r.cropName.trim()) {
        setMsg("온실 표시 이름과 작목은 비울 수 없습니다.");
        return;
      }
    }
    setSaving(true);
    setMsg(null);
    const baseById = new Map(baseline.map((r) => [r.id, r]));
    const jobs: { id: string; patch: GreenhouseProfilePatchDto }[] = [];
    for (const r of rows) {
      const o = baseById.get(r.id);
      if (!o) continue;
      const patch: GreenhouseProfilePatchDto = {};
      if (r.name !== o.name) patch.name = r.name.trim();
      if (r.cropName !== o.cropName) patch.cropName = r.cropName.trim();
      if (Object.keys(patch).length > 0) jobs.push({ id: r.id, patch });
    }
    try {
      const results = await Promise.all(jobs.map((j) => patchGreenhouseProfile(j.id, j.patch)));
      const failed = results.find((x) => !x.ok);
      if (failed && !failed.ok) {
        setMsg(failed.error.message);
      } else {
        setMsg("저장되었습니다.");
        await reloadFromApi();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md",
        "md:p-5"
      )}
    >
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">온실 · 작목</h2>
      <p className="text-muted-foreground mt-1 text-[12px] leading-relaxed">
        온실 ID는 고정입니다. 표시 이름과 작목은 Farm PC 메모리에 저장됩니다(데이터베이스 없음).
      </p>

      {!farmHttp ? (
        <p className="text-muted-foreground mt-3 rounded-xl border border-amber-400/15 bg-amber-500/[0.06] px-3 py-2 text-[12px] leading-relaxed">
          Farm PC HTTP가 꺼져 있으면 아래는 로컬 목업만 표시되며 저장할 수 없습니다.
        </p>
      ) : null}

      {msg ? (
        <p className="text-foreground/90 mt-3 text-[12px] leading-relaxed" role="status">
          {msg}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-[12px]">불러오는 중…</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="grid gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-3 sm:grid-cols-[minmax(0,100px)_1fr_1fr]"
            >
              <div>
                <Label className="text-muted-foreground text-[11px] font-medium">온실 ID</Label>
                <p className="text-foreground/95 mt-1 font-mono text-[13px]">{r.id}</p>
              </div>
              <div>
                <Label htmlFor={`gh-name-${r.id}`} className="text-muted-foreground text-[11px] font-medium">
                  표시 이름
                </Label>
                <Input
                  id={`gh-name-${r.id}`}
                  value={r.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, name: v } : x)));
                  }}
                  className="mt-1 h-9"
                  disabled={!farmHttp || saving}
                />
              </div>
              <div>
                <Label htmlFor={`gh-crop-${r.id}`} className="text-muted-foreground text-[11px] font-medium">
                  작목
                </Label>
                <Input
                  id={`gh-crop-${r.id}`}
                  value={r.cropName}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, cropName: v } : x)));
                  }}
                  className="mt-1 h-9"
                  disabled={!farmHttp || saving}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-4 rounded-full"
        disabled={!farmHttp || loading || saving || !dirty}
        onClick={() => void onSave()}
      >
        {saving ? "저장 중…" : "저장"}
      </Button>
    </section>
  );
}
