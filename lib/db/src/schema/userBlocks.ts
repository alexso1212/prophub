import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Directional block relationships. A row `(blockerId, blockedId)` means
 * `blockerId` does not want to see content from `blockedId` and does
 * not want `blockedId` to interact with them.
 *
 * Enforcement points (gradually wired up):
 *   - firm-review listings hide rows where `userId` is blocked by the
 *     viewer.
 *   - DM creation in Stream chat checks blocks before opening a channel.
 *   - public-profile pages still resolve, but interaction buttons are
 *     hidden when either side has blocked the other.
 */
export const userBlocksTable = pgTable(
  "user_blocks",
  {
    blockerId: text("blocker_id").notNull(),
    blockedId: text("blocked_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pair: uniqueIndex("user_blocks_pair_unique").on(
      table.blockerId,
      table.blockedId,
    ),
  }),
);

export type UserBlock = typeof userBlocksTable.$inferSelect;
export type InsertUserBlock = typeof userBlocksTable.$inferInsert;
