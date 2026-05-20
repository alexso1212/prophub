import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, isNull, or, sql, count } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  usersTable,
  firmReviewsTable,
  auditLogTable,
} from "@workspace/db/schema";
import { requireAdmin } from "../lib/requireAdmin";
import {
  requireLocalUser,
  type RequestWithLocalUser,
} from "../lib/users";
import { audit } from "../lib/audit";

/**
 * Admin "user management" surface.
 *
 *   GET   /api/admin/users           — paged list, supports `q` search + role/banned filters
 *   PATCH /api/admin/users/:id       — change role and/or ban state
 *   GET   /api/admin/audit           — append-only mod action log
 *
 * Every state-changing endpoint writes an `audit_log` row so #106
 * (审计日志) shows a complete trail of who did what.
 *
 * Auth: requireAdmin (ADMIN_EMAILS env-driven), then requireLocalUser
 * so we have an actor row to attribute audit entries to.
 */
const router: IRouter = Router();

const ROLES = new Set(["user", "mod", "admin"]);

router.get("/admin/users", requireAdmin, async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const role = String(req.query.role ?? "").trim();
  const status = String(req.query.status ?? "").trim(); // "" | "active" | "banned" | "deleted"
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const conds = [];
  if (q) {
    const pattern = `%${q.toLowerCase()}%`;
    conds.push(
      or(
        ilike(usersTable.username, pattern),
        ilike(usersTable.displayName, pattern),
        ilike(usersTable.email, pattern),
      ),
    );
  }
  if (role && ROLES.has(role)) conds.push(eq(usersTable.role, role));
  if (status === "banned") {
    conds.push(sql`${usersTable.bannedAt} IS NOT NULL`);
  } else if (status === "deleted") {
    conds.push(sql`${usersTable.deletedAt} IS NOT NULL`);
  } else if (status === "active") {
    conds.push(isNull(usersTable.bannedAt));
    conds.push(isNull(usersTable.deletedAt));
  }
  const whereExpr = conds.length ? and(...conds) : undefined;

  try {
    const rows = await db
      .select()
      .from(usersTable)
      .where(whereExpr)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ value: total } = { value: 0 }] = await db
      .select({ value: count() })
      .from(usersTable)
      .where(whereExpr);

    res.json({ users: rows, total, limit, offset });
  } catch {
    res.status(500).json({ error: "internal" });
  }
});

router.patch(
  "/admin/users/:id",
  requireAdmin,
  requireLocalUser,
  async (req, res) => {
    const { localUser: actor } = req as RequestWithLocalUser;
    const id = String(req.params.id || "");
    const body = (req.body ?? {}) as {
      role?: string;
      banned?: boolean;
      banReason?: string | null;
    };

    if (id === actor.id) {
      res.status(400).json({
        error: "cannot_modify_self",
        message: "为防止误操作,不能在这里修改自己",
      });
      return;
    }

    try {
      const [target] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
      if (!target) {
        res.status(404).json({ error: "not_found" });
        return;
      }

      const updates: Record<string, unknown> = {};
      const auditMeta: Record<string, unknown> = {};

      if (typeof body.role === "string" && body.role !== target.role) {
        if (!ROLES.has(body.role)) {
          res.status(400).json({ error: "invalid_role" });
          return;
        }
        updates.role = body.role;
        auditMeta.role = { from: target.role, to: body.role };
      }

      if (typeof body.banned === "boolean") {
        const shouldBeBanned = body.banned;
        const isBanned = !!target.bannedAt;
        if (shouldBeBanned !== isBanned) {
          updates.bannedAt = shouldBeBanned ? new Date() : null;
          updates.banReason = shouldBeBanned
            ? (typeof body.banReason === "string" ? body.banReason.trim().slice(0, 500) : null)
            : null;
          auditMeta.banned = { from: isBanned, to: shouldBeBanned };
          if (shouldBeBanned && body.banReason) {
            auditMeta.reason = updates.banReason;
          }
        }
      }

      if (Object.keys(updates).length === 0) {
        res.json({ user: target });
        return;
      }

      updates.updatedAt = new Date();
      const [updated] = await db
        .update(usersTable)
        .set(updates)
        .where(eq(usersTable.id, id))
        .returning();

      // One audit entry per logical change. Keeps the timeline tidy.
      if (auditMeta.role) {
        await audit({
          actorId: actor.id,
          action: "user.role_changed",
          targetType: "user",
          targetId: id,
          metadata: { role: auditMeta.role },
        });
      }
      if (auditMeta.banned !== undefined) {
        await audit({
          actorId: actor.id,
          action: (auditMeta.banned as { to: boolean }).to ? "user.banned" : "user.unbanned",
          targetType: "user",
          targetId: id,
          metadata: {
            banned: auditMeta.banned,
            ...(auditMeta.reason ? { reason: auditMeta.reason } : {}),
          },
        });
      }

      res.json({ user: updated });
    } catch {
      res.status(500).json({ error: "internal" });
    }
  },
);

router.get("/admin/audit", requireAdmin, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const actor = String(req.query.actor ?? "").trim();
  const action = String(req.query.action ?? "").trim();
  const targetType = String(req.query.targetType ?? "").trim();

  const conds = [];
  if (actor) conds.push(eq(auditLogTable.actorId, actor));
  if (action) conds.push(eq(auditLogTable.action, action));
  if (targetType) conds.push(eq(auditLogTable.targetType, targetType));
  const whereExpr = conds.length ? and(...conds) : undefined;

  try {
    // Join actor user once so the table renders names instead of raw Clerk IDs.
    const rows = await db
      .select({
        id: auditLogTable.id,
        actorId: auditLogTable.actorId,
        actorName: usersTable.displayName,
        actorUsername: usersTable.username,
        action: auditLogTable.action,
        targetType: auditLogTable.targetType,
        targetId: auditLogTable.targetId,
        metadata: auditLogTable.metadata,
        createdAt: auditLogTable.createdAt,
      })
      .from(auditLogTable)
      .leftJoin(usersTable, eq(usersTable.id, auditLogTable.actorId))
      .where(whereExpr)
      .orderBy(desc(auditLogTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ entries: rows, limit, offset });
  } catch {
    res.status(500).json({ error: "internal" });
  }
});

// Allow other admin routes to delete reviews while recording audit context.
// (Wired here so the audit + review_summary live with their siblings.)
router.delete(
  "/admin/reviews/:id",
  requireAdmin,
  requireLocalUser,
  async (req, res) => {
    const { localUser: actor } = req as RequestWithLocalUser;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "invalid_id" });
      return;
    }
    try {
      const [row] = await db
        .select()
        .from(firmReviewsTable)
        .where(eq(firmReviewsTable.id, id))
        .limit(1);
      if (!row) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      await db.delete(firmReviewsTable).where(eq(firmReviewsTable.id, id));
      await audit({
        actorId: actor.id,
        action: "review.deleted",
        targetType: "review",
        targetId: String(id),
        metadata: {
          slug: row.slug,
          author: row.userId,
          title: row.title,
          rating: row.rating,
        },
      });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "internal" });
    }
  },
);

export default router;
