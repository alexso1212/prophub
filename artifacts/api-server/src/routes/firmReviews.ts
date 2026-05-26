import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { firmReviewsTable } from "@workspace/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { requireLocalUser, type RequestWithLocalUser } from "../lib/users";

const router: IRouter = Router();

// Public list — explicit columns only. We never expose the author's Clerk
// user id here; identity comes from the denormalized userName/userAvatar.
router.get("/firms/:slug/reviews", async (req, res) => {
  const slug = String(req.params.slug);
  try {
    const rows = await db
      .select({
        id: firmReviewsTable.id,
        slug: firmReviewsTable.slug,
        userName: firmReviewsTable.userName,
        userAvatar: firmReviewsTable.userAvatar,
        rating: firmReviewsTable.rating,
        title: firmReviewsTable.title,
        body: firmReviewsTable.body,
        createdAt: firmReviewsTable.createdAt,
        updatedAt: firmReviewsTable.updatedAt,
      })
      .from(firmReviewsTable)
      .where(eq(firmReviewsTable.slug, slug))
      .orderBy(desc(firmReviewsTable.createdAt));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.get("/firms/:slug/reviews/mine", requireLocalUser, async (req, res) => {
  const slug = String(req.params.slug);
  const { localUser } = req as RequestWithLocalUser;
  try {
    const [row] = await db
      .select()
      .from(firmReviewsTable)
      .where(and(eq(firmReviewsTable.slug, slug), eq(firmReviewsTable.userId, localUser.id)));
    res.json(row ?? null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch own review" });
  }
});

const validate = (body: any): { rating: number; title: string; text: string } | string => {
  const rating = Number(body?.rating);
  const title = String(body?.title ?? "").trim();
  const text = String(body?.body ?? "").trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "rating must be an integer 1-5";
  if (title.length < 2 || title.length > 120) return "title must be 2-120 chars";
  if (text.length < 20 || text.length > 4000) return "body must be 20-4000 chars";
  return { rating, title, text };
};

router.post("/firms/:slug/reviews", requireLocalUser, async (req, res) => {
  const slug = String(req.params.slug);
  const { localUser } = req as RequestWithLocalUser;
  const v = validate(req.body);
  if (typeof v === "string") { res.status(400).json({ error: v }); return; }

  try {
    const [row] = await db
      .insert(firmReviewsTable)
      .values({
        slug,
        userId: localUser.id,
        userName: localUser.displayName,
        userAvatar: localUser.avatarUrl,
        rating: v.rating,
        title: v.title,
        body: v.text,
      })
      .onConflictDoUpdate({
        target: [firmReviewsTable.slug, firmReviewsTable.userId],
        set: {
          rating: v.rating,
          title: v.title,
          body: v.text,
          userName: localUser.displayName,
          userAvatar: localUser.avatarUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.patch("/firms/:slug/reviews/:id", requireLocalUser, async (req, res) => {
  const slug = String(req.params.slug);
  const { localUser } = req as RequestWithLocalUser;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "invalid id" }); return; }
  const v = validate(req.body);
  if (typeof v === "string") { res.status(400).json({ error: v }); return; }

  try {
    const [existing] = await db
      .select()
      .from(firmReviewsTable)
      .where(and(eq(firmReviewsTable.id, id), eq(firmReviewsTable.slug, slug)));
    if (!existing) { res.status(404).json({ error: "not found" }); return; }
    if (existing.userId !== localUser.id) { res.status(403).json({ error: "forbidden" }); return; }
    const [updated] = await db
      .update(firmReviewsTable)
      .set({ rating: v.rating, title: v.title, body: v.text, updatedAt: new Date() })
      .where(and(eq(firmReviewsTable.id, id), eq(firmReviewsTable.slug, slug)))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

router.delete("/firms/:slug/reviews/:id", requireLocalUser, async (req, res) => {
  const slug = String(req.params.slug);
  const { localUser } = req as RequestWithLocalUser;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "invalid id" }); return; }
  try {
    const [existing] = await db
      .select()
      .from(firmReviewsTable)
      .where(and(eq(firmReviewsTable.id, id), eq(firmReviewsTable.slug, slug)));
    if (!existing) { res.status(404).json({ error: "not found" }); return; }
    if (existing.userId !== localUser.id) { res.status(403).json({ error: "forbidden" }); return; }
    await db
      .delete(firmReviewsTable)
      .where(and(eq(firmReviewsTable.id, id), eq(firmReviewsTable.slug, slug)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
