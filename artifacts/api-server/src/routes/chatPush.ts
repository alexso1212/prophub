import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import webpush, { type PushSubscription } from "web-push";
import { StreamChat } from "stream-chat";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

/**
 * VAPID keys. Configure VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY env vars for
 * production so existing client subscriptions survive a restart. If not
 * provided, we generate an ephemeral pair at boot — subscriptions made
 * against that key become invalid after the next restart, which is fine
 * for development.
 */
let VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || "";
let VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@prophub.local";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  const keys = webpush.generateVAPIDKeys();
  VAPID_PUBLIC = keys.publicKey;
  VAPID_PRIVATE = keys.privateKey;
  logger.warn(
    "VAPID keys not configured — generated ephemeral pair. Set VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY env vars in production.",
  );
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

/**
 * In-memory subscription store keyed by Clerk user id. For a multi-instance
 * deployment, swap this for a DB-backed store.
 */
const subscriptionsByUser = new Map<string, PushSubscription[]>();

function addSubscription(userId: string, sub: PushSubscription) {
  const list = subscriptionsByUser.get(userId) ?? [];
  if (!list.some((s) => s.endpoint === sub.endpoint)) {
    list.push(sub);
    subscriptionsByUser.set(userId, list);
  }
}

function removeSubscription(userId: string, endpoint: string) {
  const list = subscriptionsByUser.get(userId);
  if (!list) return;
  const next = list.filter((s) => s.endpoint !== endpoint);
  if (next.length) subscriptionsByUser.set(userId, next);
  else subscriptionsByUser.delete(userId);
}

function removeByEndpoint(endpoint: string) {
  for (const [uid, list] of subscriptionsByUser.entries()) {
    const next = list.filter((s) => s.endpoint !== endpoint);
    if (next.length !== list.length) {
      if (next.length) subscriptionsByUser.set(uid, next);
      else subscriptionsByUser.delete(uid);
    }
  }
}

async function pushToUser(
  userId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const subs = subscriptionsByUser.get(userId);
  if (!subs || subs.length === 0) return;
  const body = JSON.stringify(payload);
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, body);
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          // Subscription expired/unregistered — drop it.
          removeByEndpoint(sub.endpoint);
        } else {
          logger.warn({ err, userId }, "web push send failed");
        }
      }
    }),
  );
}

router.get("/chat/push/vapid-public-key", (_req: Request, res: Response) => {
  res.json({ key: VAPID_PUBLIC });
});

router.post("/chat/push/subscribe", (req: Request, res: Response) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const sub = req.body?.subscription as PushSubscription | undefined;
  if (!sub || !sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return res.status(400).json({ error: "invalid_subscription" });
  }
  addSubscription(userId, sub);
  return res.json({ ok: true });
});

router.post("/chat/push/unsubscribe", (req: Request, res: Response) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const endpoint = String(req.body?.endpoint ?? "");
  if (!endpoint) return res.status(400).json({ error: "missing_endpoint" });
  removeSubscription(userId, endpoint);
  return res.json({ ok: true });
});

/**
 * Stream Chat webhook receiver. Configure your Stream Dashboard:
 *   Chat > Webhook URL: https://<your-host>/api/chat/webhook
 * Signature is verified via the Stream server secret.
 *
 * On every `message.new` event, push a desktop notification to:
 *   - all DM channel members other than the author, and
 *   - any explicitly @-mentioned users.
 */
router.post("/chat/webhook", async (req: Request, res: Response) => {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    return res.status(503).json({ error: "chat_not_configured" });
  }
  try {
    const sig = req.header("x-signature") || "";
    // Use the raw request body captured by the express.json `verify` hook
    // in app.ts. Re-serializing the parsed JSON would not match the bytes
    // Stream signed (whitespace / key order differences).
    const rawBody =
      (req as unknown as { rawBody?: string }).rawBody ??
      JSON.stringify(req.body ?? {});
    const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    if (!client.verifyWebhook(rawBody, sig)) {
      return res.status(401).json({ error: "bad_signature" });
    }

    const evt = req.body as {
      type?: string;
      channel_type?: string;
      channel_id?: string;
      cid?: string;
      message?: {
        text?: string;
        user?: { id?: string; name?: string };
        mentioned_users?: Array<{ id?: string }>;
      };
      members?: Array<{ user_id?: string; user?: { id?: string } }>;
    };

    if (evt.type !== "message.new") {
      return res.json({ ok: true });
    }

    const msg = evt.message;
    if (!msg) return res.json({ ok: true });

    const authorId = msg.user?.id ?? "";
    const authorName = msg.user?.name || authorId || "用户";
    const text = (msg.text || "").slice(0, 140);
    const channelType = evt.channel_type || "";
    const channelId = evt.channel_id || "";
    const cid = evt.cid || (channelType && channelId ? `${channelType}:${channelId}` : "");
    const isDm = channelType === "messaging";

    const recipients = new Set<string>();
    if (isDm && Array.isArray(evt.members)) {
      for (const m of evt.members) {
        const uid = m.user_id || m.user?.id;
        if (uid && uid !== authorId) recipients.add(uid);
      }
    }
    if (Array.isArray(msg.mentioned_users)) {
      for (const u of msg.mentioned_users) {
        if (u.id && u.id !== authorId) recipients.add(u.id);
      }
    }

    if (recipients.size === 0) return res.json({ ok: true });

    const title = isDm ? `${authorName} 给你发了私聊` : `${authorName} @了你`;
    const payload = {
      title,
      body: text || "查看新消息",
      url: "/community",
      channelCid: cid,
      tag: cid || "prophub-chat",
    };

    await Promise.all(Array.from(recipients).map((uid) => pushToUser(uid, payload)));
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "chat webhook handler failed");
    return res.status(500).json({ error: "internal_error" });
  }
});

export default router;
