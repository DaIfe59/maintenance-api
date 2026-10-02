import { Router } from "express";

import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentRequests,
  getEquipmentWeather
} from "../controllers/equipmentController.js";

import { validate } from "../validators/validate.js";

import {
  createEquipmentSchema,
  updateEquipmentSchema,
  equipmentIdSchema
} from "../validators/equipmentValidator.js";

import {
  equipmentQuerySchema
} from "../validators/queryValidator.js";

import { authenticate } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate({
    query: equipmentQuerySchema
  }),
  getEquipment
);

router.post(
  "/",
  requireRoles("admin"),
  validate({
    body: createEquipmentSchema
  }),
  createEquipment
);

router.get(
  "/:id/requests",
  validate({
    params: equipmentIdSchema
  }),
  getEquipmentRequests
);

router.get(
  "/:id/weather",
  validate({
    params: equipmentIdSchema
  }),
  getEquipmentWeather
);

router.get(
  "/:id",
  validate({
    params: equipmentIdSchema
  }),
  getEquipmentById
);

router.patch(
  "/:id",
  requireRoles("admin"),
  validate({
    params: equipmentIdSchema,
    body: updateEquipmentSchema
  }),
  updateEquipment
);

router.delete(
  "/:id",
  requireRoles("admin"),
  validate({
    params: equipmentIdSchema
  }),
  deleteEquipment
);

export default router;
