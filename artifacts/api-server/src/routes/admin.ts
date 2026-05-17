import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  firmsTable,
  offersTable,
  offerChangesTable,
  scrapeJobsTable,
} from "@workspace/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { requireAdmin, getActor } from "../lib/requireAdmin";
import { extractOfferFromText, textFromHtml } from "../lib/aiExtract";
import { z } from "zod";

type Firm = typeof firmsTable.$inferSelect;
type Offer = typeof offersTable.$inferSelect;
type FirmUpdate = Partial<typeof firmsTable.$inferInsert>;
type OfferUpdate = Partial<typeof offersTable.$inferInsert>;

const FirmPatchSchema = z
  .object({
    name: z.string(),
    officialUrl: z.string().nullable(),
    affiliateBaseUrl: z.string().nullable(),
    affiliateId: z.string().nullable(),
    logo: z.string().nullable(),
    country: z.string().nullable(),
    countryCode: z.string().nullable(),
    category: z.string().nullable(),
    status: z.string(),
    scrapeUrl: z.string().nullable(),
    scrapeEnabled: z.number().int(),
  })
  .partial();

const OfferPatchSchema = z
  .object({
    discountPercent: z.number().nullable(),
    code: z.string().nullable(),
    label: z.string().nullable(),
    affiliateUrl: z.string().nullable(),
    notes: z.string().nullable(),
    validUntil: z.string().nullable(),
  })
  .partial();

const router: IRouter = Router();

router.use("/admin", requireAdmin);

// ---------- Firms ----------
router.get("/admin/firms-v2", async (_req, res) => {
  const rows = await db.select().from(firmsTable).orderBy(firmsTable.name);
  res.json(rows);
});

// Create a new firm in the canonical registry. `slug` and `name` are
// required; everything else has sensible defaults.
const FirmCreateSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/i, "slug must be lowercase alphanumeric + dashes"),
  name: z.string().min(1),
  officialUrl: z.string().url().nullable().optional(),
  affiliateBaseUrl: z.string().url().nullable().optional(),
  affiliateId: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  countryCode: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.string().optional(),
  scrapeUrl: z.string().url().nullable().optional(),
  scrapeEnabled: z.number().int().optional(),
});

router.post("/admin/firms-v2", async (req, res) => {
  const parsed = FirmCreateSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid firm payload", issues: parsed.error.issues });
    return;
  }
  const [existing] = await db
    .select()
    .from(firmsTable)
    .where(eq(firmsTable.slug, parsed.data.slug));
  if (existing) {
    res.status(409).json({ error: `firm with slug=${parsed.data.slug} already exists` });
    return;
  }
  const [row] = await db
    .insert(firmsTable)
    .values({ ...parsed.data, slug: parsed.data.slug.toLowerCase() })
    .returning();
  res.status(201).json(row);
});

// Hard-delete a firm and its dependent rows. Refuses to delete if there's
// still a published offer (operator must archive first).
router.delete("/admin/firms-v2/:slug", async (req, res) => {
  const { slug } = req.params;
  const [pub] = await db
    .select()
    .from(offersTable)
    .where(and(eq(offersTable.firmSlug, slug), eq(offersTable.status, "published")));
  if (pub) {
    res
      .status(409)
      .json({ error: "Firm has a published offer; archive it before deleting the firm." });
    return;
  }
  // Drop dependent rows in scrape_jobs / offer_changes / offers first.
  await db.delete(scrapeJobsTable).where(eq(scrapeJobsTable.firmSlug, slug));
  await db.delete(offerChangesTable).where(eq(offerChangesTable.firmSlug, slug));
  await db.delete(offersTable).where(eq(offersTable.firmSlug, slug));
  const deleted = await db.delete(firmsTable).where(eq(firmsTable.slug, slug)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

router.patch("/admin/firms-v2/:slug", async (req, res) => {
  const { slug } = req.params;
  const parsed = FirmPatchSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid firm patch", issues: parsed.error.issues });
    return;
  }
  const allowed: FirmUpdate = { ...parsed.data, updatedAt: new Date() };
  const updated = await db
    .update(firmsTable)
    .set(allowed)
    .where(eq(firmsTable.slug, slug))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated[0]);
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
  const currentMap: Record<string, Offer> = {};
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
    .where(
      and(
        eq(offerChangesTable.firmSlug, firmSlug),
        // Include both normal and force-overridden approves so rollback works
        // even when the most recent publish was forced through a failed
        // link-health check.
        inArray(offerChangesTable.action, ["approve", "approve_forced"]),
      ),
    )
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

  // Same transactional invariants as approve: archive + insert + audit
  // must all succeed or none. The partial unique index will block double-
  // publish if the archive step somehow gets skipped.
  let restoredId: number;
  try {
    restoredId = await db.transaction(async (tx) => {
      if (current) {
        await tx
          .update(offersTable)
          .set({ status: "expired", updatedAt: new Date() })
          .where(eq(offersTable.id, current.id));
      }
      const [restored] = await tx
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
      await tx.insert(offerChangesTable).values({
        offerId: restored.id,
        firmSlug,
        beforeJson: current ?? null,
        afterJson: restored,
        diffSummary: `Rolled back to previous published snapshot by ${actor}`,
        actor,
        action: "rollback",
      });
      return restored.id;
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Rollback transaction failed: ${msg}` });
  }

  return res.json({ ok: true, restoredOfferId: restoredId });
});

router.post("/admin/offers/:id/approve", async (req, res) => {
  const id = Number(req.params.id);
  const actor = getActor(req);
  const force = req.body?.force === true;
  const [draft] = await db.select().from(offersTable).where(eq(offersTable.id, id));
  if (!draft) return res.status(404).json({ error: "Not found" });

  // Status guard: only allow publishing from draft / pending_review. Refuse
  // republish from expired/superseded/rejected/published (use rollback for
  // those flows). Prevents accidental republishes via direct API calls.
  if (draft.status !== "draft" && draft.status !== "pending_review") {
    return res
      .status(409)
      .json({ error: `Cannot approve from status=${draft.status}; use rollback to restore prior published.` });
  }

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
    // Stash health result so we can record force-override context in the
    // audit trail below.
    (req as unknown as { _health?: typeof health })._health = health;
  }

  // Wrap archive + publish + audit in a single transaction so a partial
  // failure can't leave the firm with two published rows. The partial unique
  // index `offers_one_published_per_firm` is the DB-level backstop.
  try {
    await db.transaction(async (tx) => {
      if (current) {
        await tx
          .update(offersTable)
          .set({ status: "expired", updatedAt: new Date() })
          .where(eq(offersTable.id, current.id));
      }
      await tx
        .update(offersTable)
        .set({
          status: "published",
          reviewedBy: actor,
          affiliateUrl: effectiveAffiliate,
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(offersTable.id, id));
      const health = (req as unknown as { _health?: { ok: boolean; reason?: string } })._health;
      const forcedNote =
        force && health && !health.ok
          ? ` [FORCE-OVERRIDE link health: ${health.reason ?? "failed"}]`
          : "";
      await tx.insert(offerChangesTable).values({
        offerId: id,
        firmSlug: draft.firmSlug,
        beforeJson: current ?? null,
        afterJson: { ...draft, status: "published" },
        diffSummary: `Approved by ${actor}${forcedNote}`,
        actor,
        action: force && health && !health.ok ? "approve_forced" : "approve",
      });
    });
    // Fire a webhook alert for force-publish so ops can audit out-of-band.
    if (force) {
      const health = (req as unknown as { _health?: { ok: boolean; reason?: string } })._health;
      if (health && !health.ok) {
        const hook = process.env.LINK_HEALTH_ALERT_WEBHOOK;
        if (hook) {
          fetch(hook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "force_publish",
              firmSlug: draft.firmSlug,
              offerId: id,
              actor,
              healthReason: health.reason,
            }),
          }).catch(() => undefined);
        }
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Publish transaction failed: ${msg}` });
  }

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
  const parsed = OfferPatchSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid offer patch", issues: parsed.error.issues });
    return;
  }
  const { validUntil, ...rest } = parsed.data;
  const allowed: OfferUpdate = { ...rest, updatedAt: new Date() };
  if (validUntil !== undefined) {
    allowed.validUntil = validUntil ? new Date(validUntil) : null;
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

    // Diff against all user-relevant fields so the reviewer is alerted to
    // marketing copy / deadline / plan-scope changes too, not just the code
    // or discount headline.
    const sameArr = (a: string[] | null, b: string[] | null) =>
      JSON.stringify((a ?? []).slice().sort()) === JSON.stringify((b ?? []).slice().sort());
    const sameDate = (a: Date | null, b: string | null) => {
      const aIso = a ? new Date(a).toISOString().slice(0, 10) : null;
      const bIso = b ? new Date(b).toISOString().slice(0, 10) : null;
      return aIso === bIso;
    };
    const changed =
      !current ||
      current.discountPercent !== extracted.discountPercent ||
      current.code !== extracted.code ||
      (current.label ?? null) !== (extracted.label ?? null) ||
      !sameDate(current.validUntil ?? null, extracted.validUntil) ||
      !sameArr((current.planScope as string[] | null) ?? null, extracted.applicablePlans) ||
      (current.notes ?? null) !== (extracted.summary ?? null);

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
        extractedJson: extracted,
        confidenceScore: Math.round((extracted.confidence ?? 0) * 100),
        offerId,
      })
      .where(eq(scrapeJobsTable.id, jobId));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .update(scrapeJobsTable)
      .set({
        status: "failed",
        finishedAt: new Date(),
        durationMs: Date.now() - start,
        errorMessage: msg,
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
  // Coarse reason code so audit/webhook can record *why* a check failed.
  // One of: blocked_url | http_status | missing_ref | domain_mismatch | fetch_error
  reason?: string;
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
    return {
      ok: false,
      error: "Non-public URL blocked",
      reason: "blocked_url",
      durationMs: Date.now() - start,
    };
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

    const ok = resp.ok && hasRef && domainOk;
    let reason: string | undefined;
    if (!ok) {
      if (!resp.ok) reason = "http_status";
      else if (!hasRef) reason = "missing_ref";
      else if (!domainOk) reason = "domain_mismatch";
    }
    return {
      ok,
      status: resp.status,
      finalUrl,
      hasRef,
      domainOk,
      reason,
      durationMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg, reason: "fetch_error", durationMs: Date.now() - start };
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
