import { useEffect, useState } from "react";

export type LiveStatus = "live" | "offline" | "rerun" | "unknown" | "loading";

export interface BilibiliLiveInfo {
  status: LiveStatus;
  title: string | null;
  liveStartTime: number | null;
}

interface ApiPayload {
  status: Exclude<LiveStatus, "loading">;
  title: string | null;
  liveStartTime: number | null;
}

const CLIENT_TTL_MS = 30_000;
const cache = new Map<string, { expiresAt: number; data: ApiPayload }>();
const inflight = new Map<string, Promise<ApiPayload>>();

async function fetchStatus(roomId: string): Promise<ApiPayload> {
  const cached = cache.get(roomId);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  const existing = inflight.get(roomId);
  if (existing) return existing;
  const p = (async () => {
    const res = await fetch(`/api/live/bilibili?roomId=${encodeURIComponent(roomId)}`);
    if (!res.ok) throw new Error(`http ${res.status}`);
    const data = (await res.json()) as ApiPayload;
    cache.set(roomId, { expiresAt: Date.now() + CLIENT_TTL_MS, data });
    return data;
  })().finally(() => {
    inflight.delete(roomId);
  });
  inflight.set(roomId, p);
  return p;
}

export function useBilibiliLiveStatus(roomId: string): BilibiliLiveInfo {
  const [info, setInfo] = useState<BilibiliLiveInfo>(() => {
    const cached = cache.get(roomId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    return { status: "loading", title: null, liveStartTime: null };
  });

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchStatus(roomId)
        .then((data) => {
          if (!cancelled) setInfo(data);
        })
        .catch(() => {
          if (!cancelled) {
            setInfo({ status: "unknown", title: null, liveStartTime: null });
          }
        });
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [roomId]);

  return info;
}
