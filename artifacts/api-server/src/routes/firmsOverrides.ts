import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { firmOverridesTable } from "@workspace/db/schema";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const getAdminEmails = (): string[] => {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    return res.status(503).json({ error: "Auth not configured" });
  }
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const email = (auth?.sessionClaims?.email as string | undefined)?.toLowerCase();
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0 && (!email || !adminEmails.includes(email))) {
    return res.status(403).json({ error: "Forbidden: not an admin" });
  }
  next();
};

router.get("/firms-overrides", async (_req, res) => {
  try {
    const rows = await db.select().from(firmOverridesTable);
    const map: Record<string, typeof rows[0]> = {};
    for (const row of rows) {
      map[row.slug] = row;
    }
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overrides" });
  }
});

router.get("/admin/firms", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(firmOverridesTable);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch firms" });
  }
});

router.patch("/admin/firms/:slug", requireAdmin, async (req, res) => {
  const { slug } = req.params;
  const { affiliateUrl, promoCode, promoPercent, promoLabel, discountPercent } = req.body;

  const updateData: Partial<typeof firmOverridesTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (affiliateUrl !== undefined) updateData.affiliateUrl = affiliateUrl || null;
  if (promoCode !== undefined) updateData.promoCode = promoCode;
  if (promoPercent !== undefined) updateData.promoPercent = Number(promoPercent);
  if (promoLabel !== undefined) updateData.promoLabel = promoLabel || null;
  if (discountPercent !== undefined) {
    if (discountPercent === null || discountPercent === "") {
      updateData.discountPercent = null;
    } else {
      const n = Number(discountPercent);
      if (!Number.isInteger(n) || n < 0 || n > 100) {
        res
          .status(400)
          .json({ error: "discountPercent must be an integer between 0 and 100" });
        return;
      }
      updateData.discountPercent = n;
    }
  }

  try {
    const existing = await db
      .select()
      .from(firmOverridesTable)
      .where(eq(firmOverridesTable.slug, slug));

    if (existing.length === 0) {
      await db.insert(firmOverridesTable).values({ slug, ...updateData });
    } else {
      await db
        .update(firmOverridesTable)
        .set(updateData)
        .where(eq(firmOverridesTable.slug, slug));
    }
    const [updated] = await db
      .select()
      .from(firmOverridesTable)
      .where(eq(firmOverridesTable.slug, slug));
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update firm" });
  }
});

export default router;
