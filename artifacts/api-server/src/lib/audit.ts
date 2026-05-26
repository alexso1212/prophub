import { db } from "@workspace/db";
import { auditLogTable } from "@workspace/db/schema";
import { logger } from "./logger";

/**
 * Append a single entry to the admin audit log. Never throws — audit
 * failures must not break the admin action that triggered them; we
 * fall back to a structured warn log so on-call can still see it.
 */
export async function audit(entry: {
  actorId: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    await db.insert(auditLogTable).values({
      actorId: entry.actorId,
      action: entry.action,
      targetType: entry.targetType ?? null,
      targetId: entry.targetId ?? null,
      metadata: entry.metadata ?? null,
    });
  } catch (err) {
    logger.warn({ err, entry }, "[audit] failed to persist audit entry");
  }
}
