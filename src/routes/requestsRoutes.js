import { Router } from "express";

import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
  deleteRequest
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

const router = Router();

router.get(
  "/",
  validate({
    query: requestsQuerySchema
  }),
  getRequests
);

router.post(
  "/",
  validate({
    body: createRequestSchema
  }),
  createRequest
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
  validate({
    params: requestIdSchema,
    body: statusSchema
  }),
  updateRequestStatus
);

router.patch(
  "/:id",
  validate({
    params: requestIdSchema,
    body: updateRequestSchema
  }),
  updateRequest
);

router.delete(
  "/:id",
  validate({
    params: requestIdSchema
  }),
  deleteRequest
);

export default router;
