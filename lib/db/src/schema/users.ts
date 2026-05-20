import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Local mirror of the Clerk user record.
 *
 * The primary key is the Clerk user id (e.g. "user_abc123"). We never let
 * the local row's id drift from Clerk's. All other fields are lazily
 * filled in (on first authenticated request) and kept up to date by:
 *   1. The lazy upsert in `getOrCreateLocalUser` (every authed request).
 *   2. The Clerk webhook endpoint (when configured), which handles
 *      user.created / user.updated / user.deleted events.
 *
 * `deleted_at` is a soft-delete marker so we can keep referential
 * integrity on reviews / reports / audit log entries authored by users
 * who later closed their account.
 */
export const usersTable = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk user id
    username: text("username").notNull(), // public @handle slug
    displayName: text("display_name").notNull(),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    location: text("location"),
    role: text("role").notNull().default("user"), // 'user' | 'mod' | 'admin'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    bannedAt: timestamp("banned_at", { withTimezone: true }),
    banReason: text("ban_reason"),
  },
  (table) => ({
    usersUsernameUnique: uniqueIndex("users_username_unique").on(table.username),
  }),
);

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
