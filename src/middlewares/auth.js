import {
  verifyAccessToken
} from "../utils/auth.js";

import {
  UnauthorizedError
} from "../errors/AppError.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError("Требуется access-токен")
    );
  }

  const token = header.slice(7).trim();

  if (!token) {
    return next(
      new UnauthorizedError("Требуется access-токен")
    );
  }

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== "access") {
      throw new Error("Invalid token type");
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      technicianId: payload.technicianId || null
    };

    next();
  } catch {
    next(
      new UnauthorizedError("Недействительный access-токен")
    );
  }
}