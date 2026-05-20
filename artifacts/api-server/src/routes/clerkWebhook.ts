import { Router, type IRouter, type Request, type Response } from "express";
import { Webhook } from "svix";
import { logger } from "../lib/logger";
import { softDeleteUser, syncUserFromClerk } from "../lib/users";

/**
 * Clerk webhook receiver.
 *
 * Optional but recommended: when CLERK_WEBHOOK_SECRET is configured the
 * endpoint verifies svix signatures and reacts to:
 *   - user.created / user.updated → refresh the local mirror immediately
 *   - user.deleted → soft-delete the local user
 *
 * If the secret is missing we respond 503 so a misconfigured Clerk
 * dashboard fails loudly instead of silently dropping events. The
 * lazy `getOrCreateLocalUser` upsert on every authenticated request
 * means the system stays functional without the webhook configured —
 * the webhook only accelerates propagation and is the only way to
 * catch deletions.
 */

const router: IRouter = Router();

router.post("/clerk/webhook", async (req: Request, res: Response) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    res.status(503).json({ error: "CLERK_WEBHOOK_SECRET not configured" });
    return;
  }

  const rawBody = (req as unknown as { rawBody?: string }).rawBody;
  if (!rawBody) {
    res.status(400).json({ error: "missing raw body" });
    return;
  }

  const svixId = req.header("svix-id");
  const svixTimestamp = req.header("svix-timestamp");
  const svixSignature = req.header("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ error: "missing svix headers" });
    return;
  }

  let evt: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    logger.warn({ err }, "[clerk-webhook] signature verification failed");
    res.status(401).json({ error: "bad signature" });
    return;
  }

  try {
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const clerkId = String(evt.data.id ?? "");
      if (!clerkId) {
        res.status(400).json({ error: "missing user id" });
        return;
      }
      await syncUserFromClerk(clerkId);
      logger.info({ clerkId, type: evt.type }, "[clerk-webhook] synced user");
    } else if (evt.type === "user.deleted") {
      const clerkId = String(evt.data.id ?? "");
      if (clerkId) await softDeleteUser(clerkId);
      logger.info({ clerkId }, "[clerk-webhook] soft-deleted user");
    }
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err, type: evt.type }, "[clerk-webhook] handler failed");
    res.status(500).json({ error: "handler failed" });
  }
});

export default router;
