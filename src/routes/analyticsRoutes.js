import { Router } from "express";
import {
  getSiteSummary,
  getEquipmentLoad
} from "../controllers/analyticsController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get(
  "/sites/:id/summary",
  getSiteSummary
);

router.get(
  "/reports/equipment-load",
  getEquipmentLoad
);

export default router;