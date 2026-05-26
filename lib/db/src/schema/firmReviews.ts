import { pgTable, text, integer, timestamp, uniqueIndex, serial } from "drizzle-orm/pg-core";

export const firmReviewsTable = pgTable(
  "firm_reviews",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    userId: text("user_id").notNull(),
    userName: text("user_name").notNull(),
    userAvatar: text("user_avatar"),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUserUnique: uniqueIndex("firm_reviews_slug_user_unique").on(table.slug, table.userId),
  }),
);

export type FirmReview = typeof firmReviewsTable.$inferSelect;
export type InsertFirmReview = typeof firmReviewsTable.$inferInsert;
