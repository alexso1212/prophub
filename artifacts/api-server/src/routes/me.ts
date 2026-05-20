import { Router, type IRouter } from "express";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { requireLocalUser, type RequestWithLocalUser } from "../lib/users";
import { logger } from "../lib/logger";

/**
 * /api/me — the canonical "current user" endpoint.
 *
 * GET  /api/me           → returns the local users row (auto-creates on first hit).
 * PATCH /api/me          → updates the editable profile fields.
 *
 * Editable fields: username, displayName, bio, location, avatarUrl.
 * Email + role are NOT editable here — email lives in Clerk and role is
 * controlled by ADMIN_EMAILS / admin actions.
 */
const router: IRouter = Router();

router.get("/me", requireLocalUser, (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  res.json({ user: localUser });
});

/**
 * Username slug validation. Matches the slug shape produced by
 * `pickUsername` so user-chosen and auto-assigned handles stay
 * compatible: lowercase letters / digits / underscore, 3-24 chars.
 */
const USERNAME_RE = /^[a-z0-9_]{3,24}$/;
const RESERVED = new Set([
  "admin", "administrator", "api", "me", "settings", "support",
  "system", "u", "user", "users", "www",
]);

const MAX_BIO = 500;
const MAX_LOCATION = 80;
const MAX_DISPLAY_NAME = 60;

type PatchBody = {
  username?: unknown;
  displayName?: unknown;
  bio?: unknown;
  location?: unknown;
  avatarUrl?: unknown;
};

function trimOrNull(v: unknown, max: number): string | null | undefined {
  if (v === undefined) return undefined; // not provided → leave unchanged
  if (v === null) return null;
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (t.length === 0) return null;
  return t.length > max ? t.slice(0, max) : t;
}

router.patch("/me", requireLocalUser, async (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  const body = (req.body ?? {}) as PatchBody;

  const updates: Record<string, unknown> = {};

  // username — strict slug, uniqueness checked.
  if (body.username !== undefined) {
    if (typeof body.username !== "string") {
      res.status(400).json({ error: "invalid_username", message: "用户名格式不正确" });
      return;
    }
    const next = body.username.trim().toLowerCase();
    if (next !== localUser.username) {
      if (!USERNAME_RE.test(next)) {
        res.status(400).json({
          error: "invalid_username",
          message: "用户名只能含小写字母、数字、下划线,长度 3-24 位",
        });
        return;
      }
      if (RESERVED.has(next)) {
        res.status(400).json({ error: "reserved_username", message: "该用户名为系统保留" });
        return;
      }
      const clash = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(and(eq(usersTable.username, next), ne(usersTable.id, localUser.id)))
        .limit(1);
      if (clash.length > 0) {
        res.status(409).json({ error: "username_taken", message: "该用户名已被占用" });
        return;
      }
      updates.username = next;
    }
  }

  // displayName — required-ish: cannot be cleared to empty.
  if (body.displayName !== undefined) {
    const next = trimOrNull(body.displayName, MAX_DISPLAY_NAME);
    if (next === null || next === undefined) {
      res.status(400).json({ error: "invalid_display_name", message: "昵称不能为空" });
      return;
    }
    updates.displayName = next;
  }

  // bio / location / avatarUrl — clearable.
  if (body.bio !== undefined) {
    const next = trimOrNull(body.bio, MAX_BIO);
    if (next !== undefined) updates.bio = next;
  }
  if (body.location !== undefined) {
    const next = trimOrNull(body.location, MAX_LOCATION);
    if (next !== undefined) updates.location = next;
  }
  if (body.avatarUrl !== undefined) {
    const next = trimOrNull(body.avatarUrl, 2048);
    if (next !== undefined) updates.avatarUrl = next;
  }

  if (Object.keys(updates).length === 0) {
    res.json({ user: localUser });
    return;
  }

  updates.updatedAt = new Date();

  try {
    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, localUser.id))
      .returning();
    res.json({ user: updated });
  } catch (err) {
    logger.error({ err, userId: localUser.id }, "[me] PATCH failed");
    res.status(500).json({ error: "internal", message: "保存失败,请重试" });
  }
});

export default router;
