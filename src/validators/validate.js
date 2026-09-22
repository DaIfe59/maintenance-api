import { ValidationError } from "../errors/AppError.js";

function getDetails(error) {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0
      ? issue.path.join(".")
      : "body",
    message: issue.message
  }));
}

export function validate({ body, params, query } = {}) {
  return (req, res, next) => {
    const validated = {};
    const details = [];

    if (body) {
      const result = body.safeParse(req.body);

      if (!result.success) {
        details.push(...getDetails(result.error));
      } else {
        validated.body = result.data;
      }
    }

    if (params) {
      const result = params.safeParse(req.params);

      if (!result.success) {
        details.push(...getDetails(result.error));
      } else {
        validated.params = result.data;
      }
    }

    if (query) {
      const result = query.safeParse(req.query);

      if (!result.success) {
        details.push(...getDetails(result.error));
      } else {
        validated.query = result.data;
      }
    }

    if (details.length > 0) {
      return next(
        new ValidationError(
          "Некорректные данные запроса",
          details
        )
      );
    }

    req.validated = validated;

    next();
  };
}
