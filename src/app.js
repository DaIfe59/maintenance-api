import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import config from "./config/config.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import requestsRoutes from "./routes/requestsRoutes.js";
import { requestId } from "./middlewares/requestId.js";
import { requestLogger } from "./middlewares/logger.js";
import {
  notFoundHandler,
  errorHandler
} from "./middlewares/errorHandler.js";

const app = express();

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

app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
