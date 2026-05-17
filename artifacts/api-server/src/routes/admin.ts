import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  firmsTable,
  offersTable,
  offerChangesTable,
  scrapeJobsTable,
} from "@workspace/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAdmin, getActor } from "../lib/requireAdmin";
import { extractOfferFromText, textFromHtml } from "../lib/aiExtract";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

// ---------- Firms ----------
router.get("/admin/firms-v2", async (_req, res) => {
  const rows = await db.select().from(firmsTable).orderBy(firmsTable.name);
  res.json(rows);
});

router.patch("/admin/firms-v2/:slug", async (req, res) => {
  const { slug } = req.params;
  const updates = req.body ?? {};
  const allowed: any = { updatedAt: new Date() };
  for (const k of [
    "name",
    "officialUrl",
    "affiliateBaseUrl",
    "affiliateId",
    "logo",
    "country",
    "countryCode",
    "category",
    "status",
    "scrapeUrl",
    "scrapeEnabled",
  ]) {
    if (k in updates) allowed[k] = updates[k];
  }
  await db.update(firmsTable).set(allowed).where(eq(firmsTable.slug, slug));
  const [row] = await db.select().from(firmsTable).where(eq(firmsTable.slug, slug));
  res.json(row);
});

// ---------- Offers ----------
router.get("/admin/offers", async (req, res) => {
  const status = (req.query.status as string | undefined) || undefined;
  let rows;
  if (status) {
    rows = await db
      .select()
      .from(offersTable)
      .where(eq(offersTable.status, status))
      .orderBy(desc(offersTable.updatedAt));
  } else {
    rows = await db.select().from(offersTable).orderBy(desc(offersTable.updatedAt));
  }
  res.json(rows);
});

router.get("/admin/offers/queue", async (_req, res) => {
  // For each firm that has a pending_review offer, return paired current published + pending draft.
  const pending = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.status, "pending_review"))
    .orderBy(desc(offersTable.createdAt));

  const slugs = [...new Set(pending.map((o) => o.firmSlug))];
  const currentMap: Record<string, any> = {};
  if (slugs.length > 0) {
    const currents = await db
      .select()
      .from(offersTable)
      .where(and(eq(offersTable.status, "published"), sql`${offersTable.firmSlug} = ANY(${slugs})`));
    for (const c of currents) currentMap[c.firmSlug] = c;
  }

  const cards = pending.map((draft) => ({
    draft,
    current: currentMap[draft.firmSlug] ?? null,
  }));
  res.json(cards);
});

router.post("/admin/offers/:id/approve", async (req, res) => {
  const id = Number(req.params.id);
  const actor = getActor(req);
  const [draft] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  if (!draft) return res.status(404).json({ error: "Not found" });

  const [current] = await db
    .select()
    .from(offersTable)
    .where(and(eq(offersTable.firmSlug, draft.firmSlug), eq(offersTable.status, "published")));

  // archive current
  if (current) {
    await db
      .update(offersTable)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(offersTable.id, current.id));
  }

  await db
    .update(offersTable)
    .set({
      status: "published",
      reviewedBy: actor,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(offersTable.id, id));

  await db.insert(offerChangesTable).values({
    offerId: id,
    firmSlug: draft.firmSlug,
    beforeJson: current ?? null,
    afterJson: { ...draft, status: "published" },
    diffSummary: `Approved by ${actor}`,
    actor,
    action: "approve",
  });

  return res.json({ ok: true });
});

router.post("/admin/offers/:id/reject", async (req, res) => {
  const id = Number(req.params.id);
  const actor = getActor(req);
  const reason = (req.body?.reason as string) || "";
  const [draft] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  if (!draft) return res.status(404).json({ error: "Not found" });
  await db
    .update(offersTable)
    .set({ status: "rejected", reviewedBy: actor, notes: reason, updatedAt: new Date() })
    .where(eq(offersTable.id, id));
  await db.insert(offerChangesTable).values({
    offerId: id,
    firmSlug: draft.firmSlug,
    beforeJson: draft,
    afterJson: null,
    diffSummary: `Rejected by ${actor}: ${reason}`,
    actor,
    action: "reject",
  });
  return res.json({ ok: true });
});

router.patch("/admin/offers/:id", async (req, res) => {
  const id = Number(req.params.id);
  const allowed: any = { updatedAt: new Date() };
  for (const k of ["discountPercent", "code", "label", "affiliateUrl", "notes", "validUntil"]) {
    if (k in req.body) allowed[k] = req.body[k];
  }
  if (allowed.validUntil && typeof allowed.validUntil === "string") {
    allowed.validUntil = new Date(allowed.validUntil);
  }
  await db.update(offersTable).set(allowed).where(eq(offersTable.id, id));
  const [row] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  res.json(row);
});

// ---------- Scrape jobs ----------
router.get("/admin/scrape/jobs", async (_req, res) => {
  const rows = await db
    .select()
    .from(scrapeJobsTable)
    .orderBy(desc(scrapeJobsTable.createdAt))
    .limit(50);
  res.json(rows);
});

router.post("/admin/scrape/run", async (req, res) => {
  const { slug } = req.body ?? {};
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "slug required" });
  }
  const [firm] = await db.select().from(firmsTable).where(eq(firmsTable.slug, slug));
  if (!firm) return res.status(404).json({ error: "Firm not found" });
  if (!firm.scrapeUrl) return res.status(400).json({ error: "Firm has no scrapeUrl configured" });

  const actor = getActor(req);
  const [job] = await db
    .insert(scrapeJobsTable)
    .values({
      firmSlug: slug,
      status: "running",
      triggeredBy: actor,
      startedAt: new Date(),
      sourceUrl: firm.scrapeUrl,
    })
    .returning();

  // Run async (don't await), but capture result via promise
  runScrapeJob(job.id, slug, firm.scrapeUrl).catch((e) => {
    console.error("Scrape job failed", e);
  });

  return res.json({ jobId: job.id, status: "running" });
});

async function runScrapeJob(jobId: number, slug: string, url: string) {
  const start = Date.now();
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const html = await resp.text();
    const text = textFromHtml(html);
    const snippet = text.slice(0, 2000);

    const extracted = await extractOfferFromText(text);

    // Compare with current published offer
    const [current] = await db
      .select()
      .from(offersTable)
      .where(and(eq(offersTable.firmSlug, slug), eq(offersTable.status, "published")));

    const changed =
      !current ||
      current.discountPercent !== extracted.discountPercent ||
      current.code !== extracted.code;

    let offerId: number | null = null;
    if (changed) {
      // Clear previous pending_review drafts for this firm
      await db
        .update(offersTable)
        .set({ status: "superseded", updatedAt: new Date() })
        .where(and(eq(offersTable.firmSlug, slug), eq(offersTable.status, "pending_review")));

      const [inserted] = await db
        .insert(offersTable)
        .values({
          firmSlug: slug,
          discountPercent: extracted.discountPercent,
          code: extracted.code,
          label: extracted.label,
          validUntil: extracted.validUntil ? new Date(extracted.validUntil) : null,
          planScope: extracted.applicablePlans,
          sourceUrl: url,
          sourceType: "ai_scrape",
          status: "pending_review",
          confidenceScore: extracted.confidence,
          notes: extracted.summary,
          createdBy: "ai",
        })
        .returning();
      offerId = inserted.id;
    }

    await db
      .update(scrapeJobsTable)
      .set({
        status: changed ? "extracted" : "no_change",
        finishedAt: new Date(),
        durationMs: Date.now() - start,
        rawSnippet: snippet,
        extractedJson: extracted as any,
        confidenceScore: Math.round((extracted.confidence ?? 0) * 100),
        offerId,
      })
      .where(eq(scrapeJobsTable.id, jobId));
  } catch (err: any) {
    await db
      .update(scrapeJobsTable)
      .set({
        status: "failed",
        finishedAt: new Date(),
        durationMs: Date.now() - start,
        errorMessage: err?.message ?? String(err),
      })
      .where(eq(scrapeJobsTable.id, jobId));
  }
}

// ---------- Link health ----------
function isPublicHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host) ||
      host === "::1" ||
      host.startsWith("[fc") ||
      host.startsWith("[fd") ||
      host.startsWith("[fe80")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

router.post("/admin/link-health/check", async (req, res) => {
  const { url, expectRef } = req.body ?? {};
  if (!url || typeof url !== "string") return res.status(400).json({ error: "url required" });
  if (!isPublicHttpUrl(url)) return res.status(400).json({ error: "Only public http(s) URLs allowed" });
  const start = Date.now();
  try {
    const resp = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "ProphubLinkChecker/1.0" },
    });
    const finalUrl = resp.url;
    const hasRef = expectRef ? finalUrl.includes(expectRef) : true;
    return res.json({
      ok: resp.ok && hasRef,
      status: resp.status,
      finalUrl,
      hasRef,
      durationMs: Date.now() - start,
    });
  } catch (err: any) {
    return res.json({ ok: false, error: err?.message ?? String(err), durationMs: Date.now() - start });
  }
});

export default router;
