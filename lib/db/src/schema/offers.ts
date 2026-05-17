import { pgTable, text, integer, timestamp, jsonb, serial, real, index } from "drizzle-orm/pg-core";

export const offersTable = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    firmSlug: text("firm_slug").notNull(),
    discountPercent: integer("discount_percent"),
    code: text("code"),
    label: text("label"),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    planScope: jsonb("plan_scope"),
    affiliateUrl: text("affiliate_url"),
    sourceUrl: text("source_url"),
    sourceType: text("source_type").notNull().default("manual"),
    status: text("status").notNull().default("draft"),
    confidenceScore: real("confidence_score"),
    notes: text("notes"),
    createdBy: text("created_by"),
    reviewedBy: text("reviewed_by"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    firmSlugIdx: index("offers_firm_slug_idx").on(t.firmSlug),
    statusIdx: index("offers_status_idx").on(t.status),
  }),
);

export type Offer = typeof offersTable.$inferSelect;
export type InsertOffer = typeof offersTable.$inferInsert;
