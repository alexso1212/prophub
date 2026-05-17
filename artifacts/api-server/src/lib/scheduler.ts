import { runDailyScrapeSweep, runLinkHealth } from "../routes/admin";
import { db } from "@workspace/db";
import { offersTable, firmsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger";

// Lightweight in-process scheduler. For MVP we don't need a separate worker
// or BullMQ — a single API server instance running setInterval is enough to
// keep the loop alive. Replace with a proper queue when scaling.

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

async function hourlyLinkHealth() {
  try {
    const published = await db
      .select()
      .from(offersTable)
      .where(eq(offersTable.status, "published"));
    const allFirms = await db.select().from(firmsTable);
    const firmBySlug = new Map(allFirms.map((f) => [f.slug, f] as const));
    let auto_unpublished = 0;
    let checked = 0;
    for (const o of published) {
      if (!o.affiliateUrl) continue;
      checked++;
      const firm = firmBySlug.get(o.firmSlug);
      const expectDomainSource =
        firm?.officialUrl || firm?.affiliateBaseUrl || o.affiliateUrl;
      const h = await runLinkHealth(o.affiliateUrl, "ref=propfirmmatch", expectDomainSource);
      if (!h.ok) {
        // Auto-archive broken offers and flag for re-review.
        await db
          .update(offersTable)
          .set({
            status: "pending_review",
            notes: `[auto] link health failed: ${h.error ?? h.status ?? "no ref"} @ ${new Date().toISOString()}`,
            updatedAt: new Date(),
          })
          .where(and(eq(offersTable.id, o.id), eq(offersTable.status, "published")));
        auto_unpublished++;
      }
    }
    logger.info({ checked, auto_unpublished }, "[scheduler] hourly link health");
  } catch (err) {
    logger.error({ err }, "[scheduler] hourly link health failed");
  }
}

async function dailyScrape() {
  try {
    const r = await runDailyScrapeSweep();
    logger.info(r, "[scheduler] daily scrape sweep");
  } catch (err) {
    logger.error({ err }, "[scheduler] daily scrape failed");
  }
}

let started = false;
export function startScheduler() {
  if (started) return;
  started = true;
  logger.info("[scheduler] starting in-process scheduler (hourly link health + daily scrape)");
  // Stagger: do not run immediately on boot to avoid cold-start collisions
  // with web traffic; wait 2 minutes for first run.
  const warmup = 2 * 60 * 1000;
  setTimeout(() => {
    hourlyLinkHealth();
    setInterval(hourlyLinkHealth, ONE_HOUR_MS);
  }, warmup);
  setTimeout(() => {
    dailyScrape();
    setInterval(dailyScrape, ONE_DAY_MS);
  }, warmup + 30_000);
}
