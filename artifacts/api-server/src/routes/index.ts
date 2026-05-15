import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import firmsOverridesRouter from "./firmsOverrides";
import firmReviewsRouter from "./firmReviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(firmsOverridesRouter);
router.use(firmReviewsRouter);

export default router;
