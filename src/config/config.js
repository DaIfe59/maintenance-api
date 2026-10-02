import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",

  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  rateLimitWindowMs: Number(
    process.env.RATE_LIMIT_WINDOW_MS || 900000
  ),

  rateLimitMax: Number(
    process.env.RATE_LIMIT_MAX || 100
  ),

  weatherApiUrl:
    process.env.WEATHER_API_URL ||
    "https://api.open-meteo.com/v1/forecast",

  requestTimeoutMs: Number(
    process.env.REQUEST_TIMEOUT_MS || 5000
  ),

  weatherMaxPrecipitation: Number(
    process.env.WEATHER_MAX_PRECIPITATION || 0
  ),

  weatherMaxWindSpeed: Number(
    process.env.WEATHER_MAX_WIND_SPEED || 10
  ),

  logLevel: process.env.LOG_LEVEL || "info",

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT || 5432),
  dbName: process.env.DB_NAME || "maintenance",
  dbUser: process.env.DB_USER || "maintenance",
  dbPassword: process.env.DB_PASSWORD || "maintenance",
  dbPoolMin: Number(process.env.DB_POOL_MIN || 0),
  dbPoolMax: Number(process.env.DB_POOL_MAX || 10),

  authAccessSecret: process.env.AUTH_ACCESS_SECRET,
  authAccessExpiresIn: process.env.AUTH_ACCESS_EXPIRES_IN || "15m",
  authRefreshSecret: process.env.AUTH_REFRESH_SECRET,
  authRefreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN || "7d",

  
};

export default config;