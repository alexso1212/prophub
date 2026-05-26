import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import firmsOverridesRouter from "./firmsOverrides";
import firmReviewsRouter from "./firmReviews";
import liveRouter from "./live";
import adminRouter from "./admin";
import chatRouter from "./chat";
import chatPushRouter from "./chatPush";
import clerkWebhookRouter from "./clerkWebhook";
import meRouter from "./me";
import usersRouter from "./users";
import blocksRouter from "./blocks";
import adminUsersRouter from "./adminUsers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(firmsOverridesRouter);
router.use(firmReviewsRouter);
router.use(liveRouter);
router.use(adminRouter);
router.use(chatRouter);
router.use(chatPushRouter);
router.use(clerkWebhookRouter);
router.use(meRouter);
router.use(usersRouter);
router.use(blocksRouter);
router.use(adminUsersRouter);

export default router;
