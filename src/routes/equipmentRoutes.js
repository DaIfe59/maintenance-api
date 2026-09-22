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

import { equipmentQuerySchema } from "../validators/queryValidator.js";

const router = Router();

router.get(
  "/",
  validate({
    query: equipmentQuerySchema
  }),
  getEquipment
);

router.post(
  "/",
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
  validate({
    params: equipmentIdSchema,
    body: updateEquipmentSchema
  }),
  updateEquipment
);

router.delete(
  "/:id",
  validate({
    params: equipmentIdSchema
  }),
  deleteEquipment
);

export default router;