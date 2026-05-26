import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { StreamChat } from "stream-chat";
import { logger } from "../lib/logger";
import { requireAdmin, getActor } from "../lib/requireAdmin";

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

// ---------- Admin moderation ----------
// All /admin/chat/* routes require an authenticated admin (Clerk email
// in ADMIN_EMAILS). The Stream client uses the server-side secret so it
// has full moderation powers (delete any message, ban any user, etc.).

router.use("/admin/chat", requireAdmin);

function adminClientOr503(res: Response): StreamChat | null {
  const client = getStreamClient();
  if (!client) {
    res.status(503).json({
      error: "chat_not_configured",
      message: "聊天功能尚未配置 (Stream API 密钥缺失)。",
    });
    return null;
  }
  return client;
}

// List recently flagged (reported) messages for the moderation queue.
router.get("/admin/chat/flags", async (req: Request, res: Response) => {
  const client = adminClientOr503(res);
  if (!client) return;
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  try {
    const result = await client.queryMessageFlags({}, { limit });
    const flags = (result.flags ?? []).map((f) => ({
      messageId: f.message?.id,
      messageText: f.message?.text ?? "",
      messageType: f.message?.type ?? null,
      messageDeletedAt: (f.message as { deleted_at?: string })?.deleted_at ?? null,
      channelCid: (f.message as { cid?: string })?.cid ?? null,
      authorId: f.message?.user?.id ?? null,
      authorName: f.message?.user?.name ?? null,
      reporterId: f.user?.id ?? null,
      reporterName: f.user?.name ?? null,
      createdAt: f.created_at ?? null,
      reviewedAt: f.reviewed_at ?? null,
      approvedAt: f.approved_at ?? null,
      rejectedAt: f.rejected_at ?? null,
    }));
    return res.json({ flags });
  } catch (err) {
    logger.error({ err }, "queryMessageFlags failed");
    return res
      .status(500)
      .json({ error: "internal_error", message: "查询举报记录失败" });
  }
});

// Stats: count of DM channels created in last 24h + top reported users.
router.get("/admin/chat/stats", async (_req: Request, res: Response) => {
  const client = adminClientOr503(res);
  if (!client) return;
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // DMs use the built-in `messaging` channel type (1:1 / small group),
    // distinct from `livestream` public rooms we seed above.
    const dmChannels = await client.queryChannels(
      { type: "messaging", created_at: { $gte: since } } as Record<string, unknown>,
      [{ created_at: -1 }],
      { limit: 100, state: false, watch: false, presence: false },
    );

    const flagsResp = await client.queryMessageFlags({}, { limit: 100 });
    const tally: Record<string, { userId: string; name: string | null; count: number }> = {};
    for (const f of flagsResp.flags ?? []) {
      const uid = f.message?.user?.id;
      if (!uid) continue;
      const name = f.message?.user?.name ?? null;
      tally[uid] ??= { userId: uid, name, count: 0 };
      tally[uid].count += 1;
    }
    const topReportedUsers = Object.values(tally)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.json({
      newDmChannels24h: dmChannels.length,
      topReportedUsers,
      sampleDmChannels: dmChannels.slice(0, 10).map((c) => ({
        cid: c.cid,
        memberCount: c.state?.members ? Object.keys(c.state.members).length : null,
        createdAt: c.data?.created_at ?? null,
      })),
    });
  } catch (err) {
    logger.error({ err }, "chat stats failed");
    return res
      .status(500)
      .json({ error: "internal_error", message: "查询统计失败" });
  }
});

// Hard-delete a flagged message.
router.delete(
  "/admin/chat/messages/:id",
  async (req: Request, res: Response) => {
    const client = adminClientOr503(res);
    if (!client) return;
    const actor = getActor(req);
    try {
      const messageId = String(req.params.id);
      await client.deleteMessage(messageId, true);
      logger.info({ actor, messageId }, "admin deleted message");
      return res.json({ ok: true });
    } catch (err) {
      logger.error({ err }, "deleteMessage failed");
      return res
        .status(500)
        .json({ error: "internal_error", message: "删除消息失败" });
    }
  },
);

// Ban a user. `timeoutMinutes` makes it a temporary mute; omit for
// permanent ban. Optional `reason` is shown to moderators in audit logs.
router.post(
  "/admin/chat/users/:id/ban",
  async (req: Request, res: Response) => {
    const client = adminClientOr503(res);
    if (!client) return;
    const actor = getActor(req);
    const { timeoutMinutes, reason } = (req.body ?? {}) as {
      timeoutMinutes?: number;
      reason?: string;
    };
    try {
      const targetUserId = String(req.params.id);
      await client.banUser(targetUserId, {
        banned_by_id: SUPPORT_USER_ID,
        reason: reason || `Banned by ${actor}`,
        ...(typeof timeoutMinutes === "number" && timeoutMinutes > 0
          ? { timeout: timeoutMinutes }
          : {}),
      });
      logger.info(
        { actor, targetUserId, timeoutMinutes, reason },
        "admin banned user",
      );
      return res.json({ ok: true });
    } catch (err) {
      logger.error({ err }, "banUser failed");
      return res
        .status(500)
        .json({ error: "internal_error", message: "封禁用户失败" });
    }
  },
);

router.post(
  "/admin/chat/users/:id/unban",
  async (req: Request, res: Response) => {
    const client = adminClientOr503(res);
    if (!client) return;
    const actor = getActor(req);
    try {
      const targetUserId = String(req.params.id);
      await client.unbanUser(targetUserId);
      logger.info({ actor, targetUserId }, "admin unbanned user");
      return res.json({ ok: true });
    } catch (err) {
      logger.error({ err }, "unbanUser failed");
      return res
        .status(500)
        .json({ error: "internal_error", message: "解封用户失败" });
    }
  },
);

export default router;
