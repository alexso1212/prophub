import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import firmsOverridesRouter from "./firmsOverrides";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(firmsOverridesRouter);

export default router;
