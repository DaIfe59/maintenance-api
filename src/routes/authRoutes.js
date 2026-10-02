import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  me
} from "../controllers/authController.js";

import { authenticate } from "../middlewares/auth.js";
import { loginRateLimit } from "../middlewares/loginRateLimit.js";

import { validate } from "../validators/validate.js";

import {
  registerSchema,
  loginSchema
} from "../validators/authValidator.js";

const router = Router();

router.post(
  "/register",
  validate({
    body: registerSchema
  }),
  register
);

router.post(
  "/login",
  loginRateLimit,
  validate({
    body: loginSchema
  }),
  login
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/logout",
  authenticate,
  logout
);

router.get(
  "/me",
  authenticate,
  me
);

export default router;