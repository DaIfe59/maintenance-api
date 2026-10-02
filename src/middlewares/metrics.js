import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics
} from "prom-client";

export const metricsRegistry = new Registry();

collectDefaultMetrics({
  register: metricsRegistry
});

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegistry]
});

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [metricsRegistry]
});

export const httpErrorsTotal = new Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status_code"],
  registers: [metricsRegistry]
});

function getRoute(req) {
  if (req.route?.path) {
    return `${req.baseUrl || ""}${req.route.path}`;
  }

  return "unknown";
}

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationNs =
      process.hrtime.bigint() - start;

    const durationSeconds =
      Number(durationNs) / 1_000_000_000;

    const method = req.method;
    const route = getRoute(req);
    const statusCode = String(res.statusCode);

    httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode
    });

    httpRequestDuration.observe(
      {
        method,
        route,
        status_code: statusCode
      },
      durationSeconds
    );

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({
        method,
        route,
        status_code: statusCode
      });
    }
  });

  next();
}