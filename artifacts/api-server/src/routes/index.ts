import { Router, type IRouter } from "express";
import healthRouter from "./health";
import medicationLabelsRouter from "./medication-labels";

const router: IRouter = Router();

router.use(healthRouter);
router.use(medicationLabelsRouter);

export default router;
