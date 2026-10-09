import { Router, type IRouter } from "express";
import healthRouter from "./health";
import medicationLabelsRouter from "./medication-labels";
import doctorsRouter from "./doctors";

const router: IRouter = Router();

router.use(healthRouter);
router.use(medicationLabelsRouter);
router.use(doctorsRouter);

export default router;
