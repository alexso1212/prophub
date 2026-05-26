import { Router, type IRouter } from "express";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable, firmReviewsTable } from "@workspace/db/schema";

/**
 * Public user routes.
 *
 * GET /api/users/:username
 *   Returns the public profile (display name, avatar, bio, location,
 *   member-since) plus their recent firm reviews. Used by /u/<username>
 *   on the web and (later) the same handle in the mobile app.
 *
 *   Returns 404 if the user doesn't exist or has soft-deleted their
 *   account.
 *
 *   The `:username` path is matched case-insensitively against the
 *   slug — same handle, different case, still resolves.
 */
const router: IRouter = Router();

router.get("/users/:username", async (req, res) => {
  const username = String(req.params.username || "").trim().toLowerCase();
  if (!username) {
    res.status(400).json({ error: "missing_username" });
    return;
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        displayName: usersTable.displayName,
        avatarUrl: usersTable.avatarUrl,
        bio: usersTable.bio,
        location: usersTable.location,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(and(eq(usersTable.username, username), isNull(usersTable.deletedAt)))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "not_found", message: "用户不存在" });
      return;
    }

    // Recent reviews authored by this user. We join purely by user_id so
    // legacy reviews (pre-#100) still light up the moment their author
    // gets a local row.
    const reviews = await db
      .select({
        id: firmReviewsTable.id,
        slug: firmReviewsTable.slug,
        rating: firmReviewsTable.rating,
        title: firmReviewsTable.title,
        body: firmReviewsTable.body,
        createdAt: firmReviewsTable.createdAt,
      })
      .from(firmReviewsTable)
      .where(eq(firmReviewsTable.userId, user.id))
      .orderBy(desc(firmReviewsTable.createdAt))
      .limit(20);

    res.json({ user, reviews });
  } catch (err) {
    res.status(500).json({ error: "internal" });
  }
});

export default router;
