import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { StreamChat } from "stream-chat";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

let streamClient: StreamChat | null = null;
let seedPromise: Promise<void> | null = null;

function getStreamClient(): StreamChat | null {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) return null;
  if (!streamClient) {
    streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
  }
  return streamClient;
}

const SUPPORT_USER_ID = "support";

const SEED_CHANNELS: Array<{ id: string; name: string }> = [
  { id: "futures", name: "期货交流" },
  { id: "forex", name: "外汇交流" },
  { id: "crypto", name: "加密交流" },
  { id: "announcements", name: "官方公告" },
];

async function runSeed(client: StreamChat): Promise<void> {
  // Upsert support user (admin role + 官方 badge)
  await client.upsertUser({
    id: SUPPORT_USER_ID,
    name: "Prophub 官方客服",
    role: "admin",
    ...({ official: true } as Record<string, unknown>),
  });

  // Create 4 public channels (idempotent thanks to create-or-get semantics)
  for (const ch of SEED_CHANNELS) {
    const channel = client.channel("livestream", ch.id, {
      name: ch.name,
      created_by_id: SUPPORT_USER_ID,
      official: true,
    } as Record<string, unknown>);
    try {
      await channel.create();
    } catch (err) {
      // already exists -> fine, otherwise log
      const msg = (err as Error)?.message ?? "";
      if (!/already exists|duplicate/i.test(msg)) {
        logger.warn({ err, channelId: ch.id }, "stream channel create warning");
      }
    }
  }
}

function ensureSeed(client: StreamChat): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed(client).catch((err) => {
      seedPromise = null; // allow retry
      logger.error({ err }, "stream seed failed");
      throw err;
    });
  }
  return seedPromise;
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
    await ensureSeed(client);

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
