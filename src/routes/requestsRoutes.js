import { Router } from "express";

import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
  getRequestHistory,
  addRequestAssignee,
  removeRequestAssignee
} from "../controllers/requestsController.js";

import { validate } from "../validators/validate.js";

import {
  createRequestSchema,
  updateRequestSchema,
  statusSchema,
  requestIdSchema
} from "../validators/requestValidator.js";

import {
  requestsQuerySchema
} from "../validators/queryValidator.js";
import { authenticate } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate({
    query: requestsQuerySchema
  }),
  getRequests
);

router.post(
  "/",
  requireRoles("technician", "admin"),
  validate({
    body: createRequestSchema
  }),
  createRequest
);

router.post(
  "/:id/assignees",
  requireRoles("admin"),
  addRequestAssignee
);

router.delete(
  "/:id/assignees/:userId",
  requireRoles("admin"),
  removeRequestAssignee
);

router.get(
  "/:id/history",
  getRequestHistory
);

router.get(
  "/:id",
  validate({
    params: requestIdSchema
  }),
  getRequestById
);

router.patch(
  "/:id/status",
  requireRoles("technician", "admin"),
  validate({
    params: requestIdSchema,
    body: statusSchema
  }),
  updateRequestStatus
);

router.patch(
  "/:id",
  requireRoles("technician", "admin"),
  validate({
    params: requestIdSchema,
    body: updateRequestSchema
  }),
  updateRequest
);

router.delete(
  "/:id",
  requireRoles("admin"),
  validate({
    params: requestIdSchema
  }),
  deleteRequest
);

export default router;