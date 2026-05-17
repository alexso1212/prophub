import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const BILIBILI_API = "https://api.live.bilibili.com/room/v1/Room/get_info";
const CACHE_TTL_MS = 30_000;
const FETCH_TIMEOUT_MS = 5_000;

type LiveStatus = "live" | "offline" | "rerun" | "unknown";

interface LivePayload {
  roomId: string;
  status: LiveStatus;
  liveStatusCode: number | null;
  title: string | null;
  liveStartTime: number | null;
  fetchedAt: number;
}

const cache = new Map<string, { expiresAt: number; payload: LivePayload }>();

const mapStatus = (code: number): LiveStatus => {
  if (code === 1) return "live";
  if (code === 2) return "rerun";
  if (code === 0) return "offline";
  return "unknown";
};

async function fetchBilibiliRoom(roomId: string): Promise<LivePayload> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${BILIBILI_API}?room_id=${encodeURIComponent(roomId)}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PropFirmMatchBot/1.0; +https://propfirmmatch.example)",
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(`bilibili http ${res.status}`);
    const json = (await res.json()) as {
      code: number;
      data?: {
        room_id?: number;
        live_status?: number;
        title?: string;
        live_start_time?: number;
      };
    };
    if (json.code !== 0 || !json.data) {
      throw new Error(`bilibili code ${json.code}`);
    }
    const data = json.data;
    const code = typeof data.live_status === "number" ? data.live_status : -1;
    return {
      roomId,
      status: mapStatus(code),
      liveStatusCode: code,
      title: data.title ?? null,
      liveStartTime: data.live_start_time ?? null,
      fetchedAt: Date.now(),
    };
  } finally {
    clearTimeout(timer);
  }
}

router.get("/live/bilibili", async (req, res) => {
  const rawRoomId =
    typeof req.query.roomId === "string" ? req.query.roomId.trim() : "";
  if (!/^\d{1,15}$/.test(rawRoomId)) {
    res.status(400).json({ error: "invalid_room_id" });
    return;
  }

  const cached = cache.get(rawRoomId);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    res.json(cached.payload);
    return;
  }

  try {
    const payload = await fetchBilibiliRoom(rawRoomId);
    cache.set(rawRoomId, { expiresAt: now + CACHE_TTL_MS, payload });
    res.json(payload);
  } catch (err) {
    logger.warn({ err, roomId: rawRoomId }, "bilibili live status fetch failed");
    if (cached) {
      res.json(cached.payload);
      return;
    }
    const fallback: LivePayload = {
      roomId: rawRoomId,
      status: "unknown",
      liveStatusCode: null,
      title: null,
      liveStartTime: null,
      fetchedAt: now,
    };
    res.json(fallback);
  }
});

export default router;
