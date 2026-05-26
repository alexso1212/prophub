import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { userBlocksTable, usersTable } from "@workspace/db/schema";
import { requireLocalUser, type RequestWithLocalUser } from "../lib/users";

/**
 * User-to-user block list.
 *
 *   GET    /api/blocks            — list everyone the caller has blocked
 *   POST   /api/blocks/:userId    — block someone (idempotent)
 *   DELETE /api/blocks/:userId    — unblock
 *
 * `:userId` here is the target's local user id (= Clerk user id), the
 * same value you get from a public-profile fetch.
 *
 * The block list is consulted whenever we render user-authored content
 * (firm reviews, chat DMs) so the caller never sees rows from people
 * they've blocked. Enforcement points are wired in incrementally —
 * this route + the underlying table are the source of truth.
 */
const router: IRouter = Router();

router.get("/blocks", requireLocalUser, async (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  try {
    const rows = await db
      .select({
        userId: usersTable.id,
        username: usersTable.username,
        displayName: usersTable.displayName,
        avatarUrl: usersTable.avatarUrl,
        blockedAt: userBlocksTable.createdAt,
      })
      .from(userBlocksTable)
      .innerJoin(usersTable, eq(usersTable.id, userBlocksTable.blockedId))
      .where(eq(userBlocksTable.blockerId, localUser.id))
      .orderBy(desc(userBlocksTable.createdAt));
    res.json({ blocks: rows });
  } catch {
    res.status(500).json({ error: "internal" });
  }
});

router.post("/blocks/:userId", requireLocalUser, async (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  const target = String(req.params.userId || "").trim();
  if (!target) {
    res.status(400).json({ error: "missing_target" });
    return;
  }
  if (target === localUser.id) {
    res.status(400).json({ error: "cannot_block_self" });
    return;
  }
  try {
    const [exists] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, target))
      .limit(1);
    if (!exists) {
      res.status(404).json({ error: "user_not_found" });
      return;
    }
    await db
      .insert(userBlocksTable)
      .values({ blockerId: localUser.id, blockedId: target })
      .onConflictDoNothing();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "internal" });
  }
});

router.delete("/blocks/:userId", requireLocalUser, async (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  const target = String(req.params.userId || "").trim();
  try {
    await db
      .delete(userBlocksTable)
      .where(
        and(
          eq(userBlocksTable.blockerId, localUser.id),
          eq(userBlocksTable.blockedId, target),
        ),
      );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "internal" });
  }
});

export default router;
