import { pgTable, text, integer, timestamp, jsonb, serial, index } from "drizzle-orm/pg-core";

export const scrapeJobsTable = pgTable(
  "scrape_jobs",
  {
    id: serial("id").primaryKey(),
    firmSlug: text("firm_slug").notNull(),
    status: text("status").notNull().default("queued"),
    triggeredBy: text("triggered_by"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    durationMs: integer("duration_ms"),
    sourceUrl: text("source_url"),
    rawSnippet: text("raw_snippet"),
    extractedJson: jsonb("extracted_json"),
    confidenceScore: integer("confidence_score"),
    offerId: integer("offer_id"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    firmSlugIdx: index("scrape_jobs_firm_slug_idx").on(t.firmSlug),
    statusIdx: index("scrape_jobs_status_idx").on(t.status),
  }),
);

export type ScrapeJob = typeof scrapeJobsTable.$inferSelect;
export type InsertScrapeJob = typeof scrapeJobsTable.$inferInsert;
