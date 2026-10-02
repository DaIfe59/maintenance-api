import pino from "pino";
import config from "../config/config.js";

const logger = pino({
  level: config.logLevel
});

export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info(
      {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt
      },
      "HTTP request"
    );
  });

  next();
}

export function getLogger() {
  return logger;
}
