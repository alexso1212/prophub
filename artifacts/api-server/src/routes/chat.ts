import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { StreamChat } from "stream-chat";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

let streamClient: StreamChat | null = null;
let seedAttempted = false;

function getStreamClient(): StreamChat | null {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) return null;
  if (!streamClient) {
    streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
  }
  return streamClient;
}

const SUPPORT_USER_ID = "support";

// Public rooms use Stream's `livestream` channel type — the recommended
// type for open chat rooms where any authenticated user can read + post
// without being explicitly added as a member.
const SEED_CHANNELS: Array<{ id: string; name: string }> = [
  { id: "futures", name: "期货交流" },
  { id: "forex", name: "外汇交流" },
  { id: "crypto", name: "加密交流" },
  { id: "announcements", name: "官方公告" },
];

/**
 * Fallback safety-net seeding. The canonical seed lives in
 * `src/scripts/seed-chat.ts` and should be run once as a deploy step
 * (e.g. `tsx src/scripts/seed-chat.ts`). This in-process call only runs
 * once per server boot and only as a defensive fallback when the script
 * has not been executed yet.
 */
async function fallbackSeed(client: StreamChat): Promise<void> {
  if (seedAttempted) return;
  seedAttempted = true;
  try {
    await client.upsertUser({
      id: SUPPORT_USER_ID,
      name: "Prophub 官方客服",
      role: "admin",
      ...({ official: true } as Record<string, unknown>),
    });
    for (const ch of SEED_CHANNELS) {
      const channel = client.channel("livestream", ch.id, {
        name: ch.name,
        created_by_id: SUPPORT_USER_ID,
        official: true,
      } as Record<string, unknown>);
      try {
        await channel.create();
      } catch (err) {
        const msg = (err as Error)?.message ?? "";
        if (!/already exists|duplicate/i.test(msg)) {
          logger.warn({ err, channelId: ch.id }, "stream channel create warning");
        }
      }
    }
  } catch (err) {
    logger.error({ err }, "stream fallback seed failed");
    seedAttempted = false; // allow retry on next request
  }
}

router.post("/chat/token", async (req: Request, res: Response) => {
  const client = getStreamClient();
  if (!client) {
    return res.status(503).json({
      error: "chat_not_configured",
      message: "聊天功能尚未配置 (Stream API 密钥缺失)。",
    });
  }

  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "unauthorized", message: "请先登录" });
  }

  try {
    await fallbackSeed(client);

    // Upsert this user so Stream knows about them
    const displayName =
      (req.body?.name as string | undefined)?.slice(0, 80) ||
      `用户 ${userId.slice(-6)}`;
    const image = (req.body?.image as string | undefined) || undefined;

    await client.upsertUser({
      id: userId,
      name: displayName,
      ...(image ? { image } : {}),
    });

    // Token valid for 24h
    const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const token = client.createToken(userId, exp);

    return res.json({
      apiKey: STREAM_API_KEY,
      userId,
      token,
      supportUserId: SUPPORT_USER_ID,
      channels: SEED_CHANNELS,
    });
  } catch (err) {
    logger.error({ err }, "chat token issuance failed");
    return res
      .status(500)
      .json({ error: "internal_error", message: "签发聊天 token 失败" });
  }
});

export default router;
