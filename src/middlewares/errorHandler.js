import { AppError, NotFoundError } from "../errors/AppError.js";
import { getLogger } from "./logger.js";

const logger = getLogger();

export function notFoundHandler(req, res, next) {
  next(
    new NotFoundError(
      `Маршрут ${req.method} ${req.originalUrl} не найден`
    )
  );
}

export function errorHandler(err, req, res, next) {
  const requestId = req.requestId;

  logger.error(
    {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: err.statusCode,
      error: err.message,
      stack: err.stack
    },
    "Request error"
  );

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId
      }
    });
  }

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Некорректный JSON в теле запроса",
        details: [],
        requestId
      }
    });
  }

  const isProduction = process.env.NODE_ENV === "production";

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: isProduction
        ? "Внутренняя ошибка сервера"
        : err.message,
      details: [],
      requestId
    }
  });
}
