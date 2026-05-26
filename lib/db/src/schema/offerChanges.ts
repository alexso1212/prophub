import { pgTable, text, integer, timestamp, jsonb, serial, index } from "drizzle-orm/pg-core";

export const offerChangesTable = pgTable(
  "offer_changes",
  {
    id: serial("id").primaryKey(),
    offerId: integer("offer_id"),
    firmSlug: text("firm_slug").notNull(),
    beforeJson: jsonb("before_json"),
    afterJson: jsonb("after_json"),
    diffSummary: text("diff_summary"),
    actor: text("actor"),
    action: text("action").notNull(),
    detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    firmSlugIdx: index("offer_changes_firm_slug_idx").on(t.firmSlug),
  }),
);

export type OfferChange = typeof offerChangesTable.$inferSelect;
export type InsertOfferChange = typeof offerChangesTable.$inferInsert;
