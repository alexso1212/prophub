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
  const force = req.body?.force === true;
  const [draft] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  if (!draft) return res.status(404).json({ error: "Not found" });

  const [current] = await db
    .select()
    .from(offersTable)
    .where(and(eq(offersTable.firmSlug, draft.firmSlug), eq(offersTable.status, "published")));

  // Carry affiliateUrl forward from current published offer if the draft
  // doesn't have one. Preserves `?ref=propfirmmatch` tracking params.
  const effectiveAffiliate = draft.affiliateUrl ?? current?.affiliateUrl ?? null;

  // Pre-publish link health gate. We refuse to publish a broken/affiliate-
  // stripped link unless caller passes force=true.
  if (effectiveAffiliate) {
    const expectRef = "ref=propfirmmatch";
    const health = await runLinkHealth(effectiveAffiliate, expectRef);
    if (!health.ok && !force) {
      return res.status(409).json({
        error: "Link health check failed; publish blocked",
        health,
        hint: "Re-submit with { force: true } to override.",
      });
    }
  }

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
      affiliateUrl: effectiveAffiliate,
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

// Reusable trigger used by HTTP route AND cron scheduler.
export async function triggerScrapeForFirm(
  slug: string,
  triggeredBy: string,
): Promise<
  | { ok: true; jobId: number }
  | { ok: false; status: number; error: string }
> {
  const [firm] = await db.select().from(firmsTable).where(eq(firmsTable.slug, slug));
  if (!firm) return { ok: false, status: 404, error: "Firm not found" };
  if (!firm.scrapeUrl) return { ok: false, status: 400, error: "Firm has no scrapeUrl configured" };
  const [job] = await db
    .insert(scrapeJobsTable)
    .values({
      firmSlug: slug,
      status: "running",
      triggeredBy,
      startedAt: new Date(),
      sourceUrl: firm.scrapeUrl,
    })
    .returning();
  runScrapeJob(job.id, slug, firm.scrapeUrl).catch((e) => {
    console.error("Scrape job failed", e);
  });
  return { ok: true, jobId: job.id };
}

router.post("/admin/scrape/run", async (req, res) => {
  const { slug } = req.body ?? {};
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "slug required" });
  }
  const actor = getActor(req);
  const result = await triggerScrapeForFirm(slug, actor);
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.json({ jobId: result.jobId, status: "running" });
});

// Run scrapes for every firm where scrapeEnabled=1 and scrapeUrl is set.
export async function runDailyScrapeSweep(triggeredBy = "cron"): Promise<{ triggered: number; skipped: number }> {
  const firms = await db.select().from(firmsTable);
  let triggered = 0;
  let skipped = 0;
  for (const f of firms) {
    if (!f.scrapeUrl || f.scrapeEnabled !== 1) {
      skipped++;
      continue;
    }
    const r = await triggerScrapeForFirm(f.slug, triggeredBy);
    if (r.ok) triggered++;
    else skipped++;
    // Small delay to avoid hammering the AI provider or upstreams.
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return { triggered, skipped };
}

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
          // Carry affiliateUrl from the current published offer so `?ref=` is
          // preserved through scrape -> draft -> approve. The scraper only
          // updates marketing fields; affiliate URL is managed manually.
          affiliateUrl: current?.affiliateUrl ?? null,
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
export async function runLinkHealth(
  url: string,
  expectRef?: string,
): Promise<{ ok: boolean; status?: number; finalUrl?: string; hasRef?: boolean; error?: string; durationMs: number }> {
  const start = Date.now();
  if (!isPublicHttpUrl(url)) {
    return { ok: false, error: "Non-public URL blocked", durationMs: Date.now() - start };
  }
  try {
    const resp = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "ProphubLinkChecker/1.0" },
    });
    const finalUrl = resp.url;
    const hasRef = expectRef ? finalUrl.includes(expectRef) : true;
    return {
      ok: resp.ok && hasRef,
      status: resp.status,
      finalUrl,
      hasRef,
      durationMs: Date.now() - start,
    };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err), durationMs: Date.now() - start };
  }
}

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
  const result = await runLinkHealth(url, expectRef);
  return res.json(result);
});

// Bulk health: run against all currently-published offers with an affiliateUrl.
router.post("/admin/link-health/sweep", async (_req, res) => {
  const published = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.status, "published"));
  const expectRef = "ref=propfirmmatch";
  const results: Array<{
    offerId: number;
    firmSlug: string;
    url: string;
    ok: boolean;
    status?: number;
    finalUrl?: string;
    hasRef?: boolean;
    error?: string;
  }> = [];
  for (const o of published) {
    if (!o.affiliateUrl) continue;
    const h = await runLinkHealth(o.affiliateUrl, expectRef);
    results.push({ offerId: o.id, firmSlug: o.firmSlug, url: o.affiliateUrl, ...h });
  }
  return res.json({ checked: results.length, results });
});

export default router;
