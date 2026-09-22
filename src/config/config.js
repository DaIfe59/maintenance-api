import "dotenv/config";

function getNumber(value, fallback, name, minimum) {
  const result = Number(value ?? fallback);

  if (!Number.isFinite(result) || result < minimum) {
    throw new Error(`${name} должен быть числом не меньше ${minimum}.`);
  }

  return result;
}

const config = {
  port: getNumber(process.env.PORT, 3000, "PORT", 1),
  nodeEnv: process.env.NODE_ENV || "development",

  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  rateLimitWindowMs: getNumber(
    process.env.RATE_LIMIT_WINDOW_MS,
    900000,
    "RATE_LIMIT_WINDOW_MS",
    1000
  ),

  rateLimitMax: getNumber(
    process.env.RATE_LIMIT_MAX,
    100,
    "RATE_LIMIT_MAX",
    1
  ),

  weatherApiUrl:
    process.env.WEATHER_API_URL ||
    "https://api.open-meteo.com/v1/forecast",

  requestTimeoutMs: getNumber(
    process.env.REQUEST_TIMEOUT_MS,
    5000,
    "REQUEST_TIMEOUT_MS",
    100
  ),

  weatherMaxPrecipitation: getNumber(
    process.env.WEATHER_MAX_PRECIPITATION,
    0,
    "WEATHER_MAX_PRECIPITATION",
    0
  ),

  weatherMaxWindSpeed: getNumber(
    process.env.WEATHER_MAX_WIND_SPEED,
    10,
    "WEATHER_MAX_WIND_SPEED",
    0
  ),

  logLevel: process.env.LOG_LEVEL || "info"
};

export default config;
