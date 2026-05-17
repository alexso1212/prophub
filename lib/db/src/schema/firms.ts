import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const firmsTable = pgTable("firms", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  officialUrl: text("official_url"),
  affiliateBaseUrl: text("affiliate_base_url"),
  affiliateId: text("affiliate_id"),
  logo: text("logo"),
  country: text("country"),
  countryCode: text("country_code"),
  category: text("category"),
  status: text("status").notNull().default("active"),
  scrapeUrl: text("scrape_url"),
  scrapeEnabled: integer("scrape_enabled").notNull().default(0),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Firm = typeof firmsTable.$inferSelect;
export type InsertFirm = typeof firmsTable.$inferInsert;
