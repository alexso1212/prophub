import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { firmReviewsTable } from "@workspace/db/schema";
import { getAuth, clerkClient } from "@clerk/express";
import { and, desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const requireUser = async (req: any, res: any, next: any): Promise<void> => {
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    res.status(503).json({ error: "Auth not configured" });
    return;
  }
  const auth = getAuth(req);
  const userId = (auth?.userId || (auth?.sessionClaims as any)?.userId) as string | undefined;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const user = await clerkClient.users.getUser(userId);
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "用户";
    req.authUser = {
      id: userId,
      name,
      avatar: user.imageUrl ?? null,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};

router.get("/firms/:slug/reviews", async (req, res) => {
  const { slug } = req.params;
  try {
    const rows = await db
      .select()
      .from(firmReviewsTable)
      .where(eq(firmReviewsTable.slug, slug))
      .orderBy(desc(firmReviewsTable.createdAt));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.get("/firms/:slug/reviews/mine", requireUser, async (req: any, res) => {
  const { slug } = req.params;
  try {
    const [row] = await db
      .select()
      .from(firmReviewsTable)
      .where(and(eq(firmReviewsTable.slug, slug), eq(firmReviewsTable.userId, req.authUser.id)));
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

router.post("/firms/:slug/reviews", requireUser, async (req: any, res) => {
  const { slug } = req.params;
  const v = validate(req.body);
  if (typeof v === "string") { res.status(400).json({ error: v }); return; }

  try {
    const [row] = await db
      .insert(firmReviewsTable)
      .values({
        slug,
        userId: req.authUser.id,
        userName: req.authUser.name,
        userAvatar: req.authUser.avatar,
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
          userName: req.authUser.name,
          userAvatar: req.authUser.avatar,
          updatedAt: new Date(),
        },
      })
      .returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.patch("/firms/:slug/reviews/:id", requireUser, async (req: any, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "invalid id" }); return; }
  const v = validate(req.body);
  if (typeof v === "string") { res.status(400).json({ error: v }); return; }

  try {
    const [existing] = await db.select().from(firmReviewsTable).where(eq(firmReviewsTable.id, id));
    if (!existing) { res.status(404).json({ error: "not found" }); return; }
    if (existing.userId !== req.authUser.id) { res.status(403).json({ error: "forbidden" }); return; }
    const [updated] = await db
      .update(firmReviewsTable)
      .set({ rating: v.rating, title: v.title, body: v.text, updatedAt: new Date() })
      .where(eq(firmReviewsTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

router.delete("/firms/:slug/reviews/:id", requireUser, async (req: any, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "invalid id" }); return; }
  try {
    const [existing] = await db.select().from(firmReviewsTable).where(eq(firmReviewsTable.id, id));
    if (!existing) { res.status(404).json({ error: "not found" }); return; }
    if (existing.userId !== req.authUser.id) { res.status(403).json({ error: "forbidden" }); return; }
    await db.delete(firmReviewsTable).where(eq(firmReviewsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
