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
  // For each firm with a draft or pending_review offer, pair it with the
  // current published version so the reviewer can diff and decide.
  // Per requirement: AI-generated rows land as `draft` first; an explicit
  // promote step (or direct approve) advances them.
  const pending = await db
    .select()
    .from(offersTable)
    .where(sql`${offersTable.status} IN ('draft','pending_review')`)
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

// Promote a draft into the human review queue. Idempotent.
router.post("/admin/offers/:id/promote", async (req, res) => {
  const id = Number(req.params.id);
  const actor = getActor(req);
  const [row] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.status !== "draft" && row.status !== "pending_review") {
    return res.status(409).json({ error: `Cannot promote from status=${row.status}` });
  }
  await db
    .update(offersTable)
    .set({ status: "pending_review", updatedAt: new Date() })
    .where(eq(offersTable.id, id));
  await db.insert(offerChangesTable).values({
    offerId: id,
    firmSlug: row.firmSlug,
    beforeJson: row,
    afterJson: { ...row, status: "pending_review" },
    diffSummary: `Promoted draft to pending_review by ${actor}`,
    actor,
    action: "promote",
  });
  return res.json({ ok: true });
});

// Restore the most recent published snapshot for a firm from offer_changes.
// Archives whatever is currently published and re-inserts the prior version
// as the live offer. Records a `rollback` audit row.
router.post("/admin/offers/rollback/:firmSlug", async (req, res) => {
  const firmSlug = req.params.firmSlug;
  const actor = getActor(req);

  // Find the most recent approve change for this firm where beforeJson
  // contains the previous published state.
  const history = await db
    .select()
    .from(offerChangesTable)
    .where(and(eq(offerChangesTable.firmSlug, firmSlug), eq(offerChangesTable.action, "approve")))
    .orderBy(desc(offerChangesTable.detectedAt))
    .limit(1);

  const prev = history[0]?.beforeJson as Record<string, unknown> | null;
  if (!prev || typeof prev !== "object") {
    return res.status(404).json({ error: "No previous published snapshot found" });
  }

  const [current] = await db
    .select()
    .from(offersTable)
    .where(and(eq(offersTable.firmSlug, firmSlug), eq(offersTable.status, "published")));

  if (current) {
    await db
      .update(offersTable)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(offersTable.id, current.id));
  }

  const [restored] = await db
    .insert(offersTable)
    .values({
      firmSlug,
      discountPercent: (prev.discountPercent as number | null) ?? null,
      code: (prev.code as string | null) ?? null,
      label: (prev.label as string | null) ?? null,
      validUntil: prev.validUntil ? new Date(prev.validUntil as string) : null,
      planScope: (prev.planScope as string[] | null) ?? [],
      affiliateUrl: (prev.affiliateUrl as string | null) ?? null,
      sourceUrl: (prev.sourceUrl as string | null) ?? null,
      sourceType: "rollback",
      status: "published",
      confidenceScore: (prev.confidenceScore as number | null) ?? null,
      notes: (prev.notes as string | null) ?? null,
      createdBy: actor,
      reviewedBy: actor,
      publishedAt: new Date(),
    })
    .returning();

  await db.insert(offerChangesTable).values({
    offerId: restored.id,
    firmSlug,
    beforeJson: current ?? null,
    afterJson: restored,
    diffSummary: `Rolled back to previous published snapshot by ${actor}`,
    actor,
    action: "rollback",
  });

  return res.json({ ok: true, restoredOfferId: restored.id });
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
  // stripped link, or one that redirects off the firm's official domain,
  // unless caller passes force=true.
  if (effectiveAffiliate) {
    const expectRef = "ref=propfirmmatch";
    const [firm] = await db
      .select()
      .from(firmsTable)
      .where(eq(firmsTable.slug, draft.firmSlug));
    const expectDomainSource =
      firm?.officialUrl || firm?.affiliateBaseUrl || effectiveAffiliate;
    const health = await runLinkHealth(effectiveAffiliate, expectRef, expectDomainSource);
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

// Try Playwright (real browser) first if SCRAPE_USE_PLAYWRIGHT=1 and the
// package is installed. Falls back to plain fetch+UA for hosts that don't
// need JS rendering. Playwright is intentionally NOT a hard dependency so
// the api-server bundle stays small; install separately when needed.
async function fetchHtml(url: string): Promise<{ html: string; via: "playwright" | "fetch" }> {
  if (process.env.SCRAPE_USE_PLAYWRIGHT === "1") {
    try {
      // Dynamic import with a runtime-only specifier so TS doesn't require
      // playwright types/install. Using new Function avoids static analysis.
      const dynamicImport = new Function("m", "return import(m)") as (m: string) => Promise<any>;
      const pw: any = await dynamicImport("playwright").catch(() => null);
      if (pw?.chromium) {
        const browser = await pw.chromium.launch({ headless: true });
        try {
          const ctx = await browser.newContext({
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          });
          const page = await ctx.newPage();
          await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
          const html = await page.content();
          return { html, via: "playwright" };
        } finally {
          await browser.close().catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Playwright path failed; falling back to fetch:", e);
    }
  }
  const resp = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
  return { html: await resp.text(), via: "fetch" };
}

async function runScrapeJob(jobId: number, slug: string, url: string) {
  const start = Date.now();
  try {
    const { html } = await fetchHtml(url);
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
      // Clear previous AI-staged rows (draft + pending_review) for this firm
      // so only the freshest scrape is in the review queue.
      await db
        .update(offersTable)
        .set({ status: "superseded", updatedAt: new Date() })
        .where(
          and(
            eq(offersTable.firmSlug, slug),
            sql`${offersTable.status} IN ('draft','pending_review')`,
          ),
        );

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
          // Spec: AI output defaults to `draft`; a reviewer (or `promote`
          // endpoint) advances it to `pending_review` before publish.
          status: "draft",
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
export interface LinkHealthResult {
  ok: boolean;
  status?: number;
  finalUrl?: string;
  hasRef?: boolean;
  domainOk?: boolean;
  error?: string;
  durationMs: number;
}

function rootDomain(host: string): string {
  // Strip leading "www." and return the registrable-ish suffix (last two
  // labels). Good enough for prop firm sites; not a full PSL parse.
  const cleaned = host.toLowerCase().replace(/^www\./, "");
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return parts.slice(-2).join(".");
}

export async function runLinkHealth(
  url: string,
  expectRef?: string,
  expectDomainSource?: string,
): Promise<LinkHealthResult> {
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

    // Redirect-domain validation: the final URL after all redirects must
    // resolve to the same root domain as the expected source. This catches
    // affiliate links that get hijacked to a different vendor.
    let domainOk = true;
    if (expectDomainSource) {
      try {
        const expected = rootDomain(new URL(expectDomainSource).hostname);
        const actual = rootDomain(new URL(finalUrl).hostname);
        domainOk = actual === expected;
      } catch {
        domainOk = false;
      }
    }

    return {
      ok: resp.ok && hasRef && domainOk,
      status: resp.status,
      finalUrl,
      hasRef,
      domainOk,
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
  const allFirms = await db.select().from(firmsTable);
  const firmBySlug = new Map(allFirms.map((f) => [f.slug, f] as const));
  const expectRef = "ref=propfirmmatch";
  const results: Array<{ offerId: number; firmSlug: string; url: string } & LinkHealthResult> = [];
  for (const o of published) {
    if (!o.affiliateUrl) continue;
    const firm = firmBySlug.get(o.firmSlug);
    const expectDomainSource = firm?.officialUrl || firm?.affiliateBaseUrl || o.affiliateUrl;
    const h = await runLinkHealth(o.affiliateUrl, expectRef, expectDomainSource);
    results.push({ offerId: o.id, firmSlug: o.firmSlug, url: o.affiliateUrl, ...h });
  }
  return res.json({ checked: results.length, results });
});

export default router;
