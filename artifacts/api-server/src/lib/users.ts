import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable, type User } from "@workspace/db/schema";
import { logger } from "./logger";

/**
 * Identity helpers — the single source of truth for "who is the current
 * user" inside the API server. All routes that need a logged-in user
 * should reach for `getOrCreateLocalUser(req)` or the `requireLocalUser`
 * middleware below, never poke at Clerk directly.
 *
 * Sync strategy: lazy upsert. On every authenticated request we look up
 * the local users row by Clerk user id; if missing we create it from
 * the Clerk profile, if present and Clerk data has shifted we refresh
 * the cached fields. The Clerk webhook (./routes/clerkWebhook.ts)
 * additionally handles user.deleted and acts as a faster propagation
 * path for profile edits when configured.
 */

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "api",
  "me",
  "settings",
  "support",
  "system",
  "u",
  "user",
  "users",
  "www",
]);

function slugify(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 24) || "user";
}

/**
 * Pick a username that is (a) URL-safe, (b) not reserved, (c) unique
 * across the users table. We prefer the Clerk-supplied username, then
 * the email local part, then the display name, and finally fall back
 * to a short hash of the Clerk user id. Collisions append `_N`.
 */
async function pickUsername(seed: string, fallbackId: string): Promise<string> {
  let base = slugify(seed);
  if (RESERVED_USERNAMES.has(base)) base = `${base}_user`;

  // First-try the bare slug.
  let candidate = base;
  for (let attempt = 0; attempt < 12; attempt++) {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    // Collision: append a 2-3 digit random suffix.
    const suffix = Math.floor(10 + Math.random() * 9990);
    candidate = `${base}_${suffix}`.slice(0, 30);
  }
  // Extremely unlikely fallthrough: use the tail of the Clerk id.
  return `${base}_${fallbackId.slice(-6)}`.toLowerCase();
}

type ClerkSnapshot = {
  displayName: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
};

/**
 * Fetch the canonical Clerk record for `clerkId` and reduce it to the
 * fields we mirror locally. Falls back to whatever is in `sessionClaims`
 * if the API call fails so we can still create a usable local row.
 */
async function loadClerkSnapshot(
  clerkId: string,
  sessionClaims?: Record<string, unknown> | null,
): Promise<ClerkSnapshot> {
  try {
    const u = await clerkClient.users.getUser(clerkId);
    const email = u.primaryEmailAddress?.emailAddress ?? null;
    const displayName =
      [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
      u.username ||
      email?.split("@")[0] ||
      "用户";
    return {
      displayName,
      username: u.username ?? null,
      email: email ? email.toLowerCase() : null,
      avatarUrl: u.imageUrl ?? null,
    };
  } catch (err) {
    logger.warn({ err, clerkId }, "[users] clerkClient.getUser failed, falling back to session claims");
    const claims = (sessionClaims ?? {}) as Record<string, unknown>;
    const email =
      typeof claims.email === "string"
        ? claims.email
        : typeof claims.primary_email_address === "string"
          ? (claims.primary_email_address as string)
          : null;
    const displayName =
      (typeof claims.name === "string" && claims.name) ||
      (typeof claims.username === "string" && (claims.username as string)) ||
      email?.split("@")[0] ||
      "用户";
    return {
      displayName,
      username: typeof claims.username === "string" ? (claims.username as string) : null,
      email: email ? email.toLowerCase() : null,
      avatarUrl: typeof claims.picture === "string" ? (claims.picture as string) : null,
    };
  }
}

/**
 * Upsert the local users row for the given Clerk id. Returns the
 * persisted row, with role honoured by ADMIN_EMAILS so newly seen
 * admins are promoted automatically.
 */
export async function syncUserFromClerk(
  clerkId: string,
  sessionClaims?: Record<string, unknown> | null,
): Promise<User> {
  const snap = await loadClerkSnapshot(clerkId, sessionClaims);

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, clerkId))
    .limit(1);

  const role = computeRole(snap.email);
  const now = new Date();

  if (existing.length === 0) {
    const username = await pickUsername(
      snap.username || snap.email?.split("@")[0] || snap.displayName,
      clerkId,
    );
    const [created] = await db
      .insert(usersTable)
      .values({
        id: clerkId,
        username,
        displayName: snap.displayName,
        email: snap.email,
        avatarUrl: snap.avatarUrl,
        role,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return created;
  }

  const row = existing[0];
  const next: Partial<typeof usersTable.$inferInsert> = {};
  if (row.displayName !== snap.displayName) next.displayName = snap.displayName;
  if ((row.email ?? null) !== snap.email) next.email = snap.email;
  if ((row.avatarUrl ?? null) !== snap.avatarUrl) next.avatarUrl = snap.avatarUrl;
  if (row.role !== role) next.role = role;
  // Un-soft-delete if the user came back.
  if (row.deletedAt) next.deletedAt = null;

  if (Object.keys(next).length === 0) return row;

  next.updatedAt = now;
  const [updated] = await db
    .update(usersTable)
    .set(next)
    .where(eq(usersTable.id, clerkId))
    .returning();
  return updated;
}

function computeRole(email: string | null): "user" | "admin" {
  if (!email) return "user";
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase()) ? "admin" : "user";
}

/**
 * Soft-delete a user (e.g. from the Clerk webhook). Idempotent.
 */
export async function softDeleteUser(clerkId: string): Promise<void> {
  await db
    .update(usersTable)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(usersTable.id, clerkId));
}

/**
 * Resolve & upsert the local user for the current request. Returns
 * null when the request is unauthenticated.
 */
export async function getOrCreateLocalUser(req: Request): Promise<User | null> {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return null;
  return syncUserFromClerk(clerkId, auth?.sessionClaims as Record<string, unknown> | null);
}

export interface RequestWithLocalUser extends Request {
  localUser: User;
}

/**
 * Express middleware that loads (or creates) the local user row for
 * the authenticated caller and stashes it on `req.localUser`.
 * Responds 401 when there is no Clerk session.
 *
 * Downstream handlers that want typed access can cast the request:
 *   `const { localUser } = req as RequestWithLocalUser;`
 */
export async function requireLocalUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    res.status(503).json({ error: "Auth not configured" });
    return;
  }
  try {
    const user = await getOrCreateLocalUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as RequestWithLocalUser).localUser = user;
    next();
  } catch (err) {
    logger.error({ err }, "[users] requireLocalUser failed");
    res.status(500).json({ error: "Internal error" });
  }
}
