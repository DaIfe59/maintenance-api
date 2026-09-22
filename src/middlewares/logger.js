import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
});

export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;

    logger.info({
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration
    }, "HTTP request");
  });

  next();
}

export function getLogger() {
  return logger;
}