import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const firmOverridesTable = pgTable("firm_overrides", {
  slug: text("slug").primaryKey(),
  affiliateUrl: text("affiliate_url"),
  promoCode: text("promo_code"),
  promoPercent: integer("promo_percent"),
  promoLabel: text("promo_label"),
  discountPercent: integer("discount_percent"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type FirmOverride = typeof firmOverridesTable.$inferSelect;
export type InsertFirmOverride = typeof firmOverridesTable.$inferInsert;
