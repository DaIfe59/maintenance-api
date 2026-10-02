export class AppError extends Error {
  constructor(message, statusCode, code, details = []) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ресурс не найден", details = []) {
    super(message, 404, "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Некорректные данные запроса",
    details = []
  ) {
    super(message, 422, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class ConflictError extends AppError {
  constructor(
    message = "Конфликт данных",
    details = []
  ) {
    super(message, 409, "CONFLICT", details);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Требуется аутентификация",
    details = []
  ) {
    super(message, 401, "UNAUTHORIZED", details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = "Недостаточно прав",
    details = []
  ) {
    super(message, 403, "FORBIDDEN", details);
    this.name = "ForbiddenError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message = "Внешний сервис временно недоступен",
    details = []
  ) {
    super(message, 502, "EXTERNAL_SERVICE_ERROR", details);
    this.name = "ExternalServiceError";
  }
}