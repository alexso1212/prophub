import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/**
 * Admin/moderator action audit trail. Append-only; never updated or
 * deleted from application code. Used by the admin "审计日志" page so
 * the team can see who banned whom, who deleted which review, who
 * promoted whose role, etc.
 *
 * `actorId` is the local users.id (= Clerk user id) of the person
 * performing the action. `action` is a short verb-namespaced string
 * (e.g. "user.role_changed", "user.banned", "review.deleted",
 * "chat.message_deleted"). `targetType` + `targetId` point to the
 * affected entity; `metadata` carries arbitrary structured context
 * (before/after values, reason text, etc.).
 */
export const auditLogTable = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    actorId: text("actor_id").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    byActor: index("audit_log_actor_idx").on(table.actorId, table.createdAt),
    byTarget: index("audit_log_target_idx").on(
      table.targetType,
      table.targetId,
    ),
    byAction: index("audit_log_action_idx").on(table.action, table.createdAt),
  }),
);

export type AuditLogEntry = typeof auditLogTable.$inferSelect;
export type InsertAuditLogEntry = typeof auditLogTable.$inferInsert;
