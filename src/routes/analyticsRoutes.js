import { Router } from "express";
import {
  getSiteSummary,
  getEquipmentLoad
} from "../controllers/analyticsController.js";

const router = Router();

router.get(
  "/sites/:id/summary",
  getSiteSummary
);

router.get(
  "/reports/equipment-load",
  getEquipmentLoad
);

export default router;