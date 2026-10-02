import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      technicianId: user.technicianId || null,
      type: "access"
    },
    config.authAccessSecret,
    {
      expiresIn: config.authAccessExpiresIn
    }
  );
}

export function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh"
    },
    config.authRefreshSecret,
    {
      expiresIn: config.authRefreshExpiresIn
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    config.authAccessSecret
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    config.authRefreshSecret
  );
}