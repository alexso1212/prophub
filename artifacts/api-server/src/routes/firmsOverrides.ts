import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { firmOverridesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/requireAdmin";
import { isHttpUrl } from "../lib/safeFetch";

// NOTE: `firm_overrides` is the legacy public-facing override layer used by
// the static `firms.ts` catalog for marketing tweaks. The new `firms` /
// `offers` tables (see admin.ts) are the canonical registry for the
// scrape→review→publish pipeline. The two are intentionally separate during
// MVP migration; consolidation tracked in follow-up #78.
const router: IRouter = Router();

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
  const slug = String(req.params.slug);
  const { affiliateUrl, promoCode, promoPercent, promoLabel, discountPercent } = req.body;

  const updateData: Partial<typeof firmOverridesTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (affiliateUrl !== undefined) {
    // Block non-http(s) schemes (e.g. javascript:) — this value is later fed
    // straight into window.location.assign on the public /go/:slug page.
    if (affiliateUrl && !isHttpUrl(String(affiliateUrl))) {
      res.status(400).json({ error: "affiliateUrl must be an http(s) URL" });
      return;
    }
    updateData.affiliateUrl = affiliateUrl || null;
  }
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
