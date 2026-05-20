import { Router, type IRouter } from "express";
import { requireLocalUser, type RequestWithLocalUser } from "../lib/users";

/**
 * /api/me — returns the local mirror of the authenticated user.
 *
 * Web and mobile clients call this on app boot after login to get the
 * canonical user row (with username slug, role, etc.). The handler
 * also doubles as the lazy-upsert trigger: first time a freshly
 * registered Clerk user hits any authed endpoint we materialise their
 * users-table row.
 */
const router: IRouter = Router();

router.get("/me", requireLocalUser, (req, res) => {
  const { localUser } = req as RequestWithLocalUser;
  res.json({ user: localUser });
});

export default router;
