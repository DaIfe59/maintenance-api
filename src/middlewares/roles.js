import { ForbiddenError } from "../errors/AppError.js";

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ForbiddenError("Пользователь не определён")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("Недостаточно прав")
      );
    }

    next();
  };
}