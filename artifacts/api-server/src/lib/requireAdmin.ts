import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { z } from "zod";

const ClaimsSchema = z
  .object({
    email: z.string().optional(),
    primary_email_address: z.string().optional(),
  })
  .passthrough();

interface ResolvedAuth {
  userId: string | null;
  email: string | null;
}

function resolveAuth(req: Request): ResolvedAuth {
  const auth = getAuth(req);
  const userId = auth?.userId ?? null;
  const claimsParse = ClaimsSchema.safeParse(auth?.sessionClaims ?? {});
  const claims = claimsParse.success ? claimsParse.data : {};
  const rawEmail = claims.email ?? claims.primary_email_address ?? null;
  const email = rawEmail ? rawEmail.toLowerCase() : null;
  return { userId, email };
}

const getAdminEmails = (): string[] => {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    // Dev bypass requires explicit opt-in env flag to prevent accidental
    // exposure on preview/staging URLs. Set ADMIN_DEV_BYPASS=1 locally only.
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ADMIN_DEV_BYPASS === "1"
    ) {
      return next();
    }
    return res.status(503).json({ error: "Auth not configured" });
  }
  const { userId, email } = resolveAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0 || !email || !adminEmails.includes(email)) {
    return res.status(403).json({ error: "Forbidden: not an admin" });
  }
  next();
};

export const getActor = (req: Request): string => {
  try {
    const { email } = resolveAuth(req);
    return email || "dev";
  } catch {
    return "dev";
  }
};
