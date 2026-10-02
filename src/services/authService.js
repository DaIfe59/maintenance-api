import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { User } from "../../models/index.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from "../utils/auth.js";

import {
  ConflictError,
  UnauthorizedError,
  NotFoundError
} from "../errors/AppError.js";

const LOGIN_ERROR = "Неверный email или пароль";

function hashRefreshToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    technicianId: user.technicianId || null
  };
}

export async function register({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({
    where: { email: normalizedEmail }
  });

  if (existing) {
    throw new ConflictError("Пользователь уже существует");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    role: "viewer"
  });

  return publicUser(user);
}

export async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: { email: normalizedEmail }
  });

  if (!user) {
    throw new UnauthorizedError(LOGIN_ERROR);
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    throw new UnauthorizedError(LOGIN_ERROR);
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshTokenHash = hashRefreshToken(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: publicUser(user)
  };
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh-токен отсутствует");
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Недействительный refresh-токен");
  }

  if (payload.type !== "refresh") {
    throw new UnauthorizedError("Недействительный refresh-токен");
  }

  const user = await User.findByPk(payload.sub);

  if (!user || !user.refreshTokenHash) {
    throw new UnauthorizedError("Сессия недействительна");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  if (tokenHash !== user.refreshTokenHash) {
    throw new UnauthorizedError("Сессия недействительна");
  }

  const accessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  user.refreshTokenHash = hashRefreshToken(newRefreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: publicUser(user)
  };
}

export async function logout(userId) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new NotFoundError("Пользователь не найден");
  }

  user.refreshTokenHash = null;
  await user.save();
}

export async function getCurrentUser(userId) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new NotFoundError("Пользователь не найден");
  }

  return publicUser(user);
}