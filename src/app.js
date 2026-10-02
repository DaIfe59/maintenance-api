import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import config from "./config/config.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import requestsRoutes from "./routes/requestsRoutes.js";
import { requestId } from "./middlewares/requestId.js";
import { requestLogger } from "./middlewares/logger.js";
import {
  notFoundHandler,
  errorHandler
} from "./middlewares/errorHandler.js";
import {
  metricsMiddleware,
  metricsRegistry
} from "./middlewares/metrics.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import sequelize from "./config/database.js";
import swaggerUi from "swagger-ui-express";
import openapi from "./config/openapi.js";

const app = express();

app.set("trust proxy", true);
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  })
);

app.use(requestId);
app.use(requestLogger);

app.use(
  express.json({
    limit: "100kb"
  })
);

app.use(metricsMiddleware);

const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.json({
    data: {
      status: "ok"
    }
  });
});

app.get("/api/health/live", (req, res) => {
  res.json({
    data: {
      status: "live"
    }
  });
});

app.get("/api/health/ready", async (req, res, next) => {
  try {
    await sequelize.authenticate();

    res.json({
      data: {
        status: "ready",
        database: "ok"
      }
    });
  } catch (error) {
    res.status(503).json({
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Сервис не готов",
        details: {
          database: "unavailable"
        }
      }
    });
  }
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi)
);

app.use("/api", analyticsRoutes);

app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/auth", authRoutes);

app.get("/metrics", async (req, res, next) => {
  try {
    res.set(
      "Content-Type",
      metricsRegistry.contentType
    );

    res.end(
      await metricsRegistry.metrics()
    );
  } catch (error) {
    next(error);
  }
});


app.use(notFoundHandler);
app.use(errorHandler);

export default app;
