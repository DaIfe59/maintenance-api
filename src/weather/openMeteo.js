import config from "../config/config.js";
import { ExternalServiceError } from "../errors/AppError.js";

async function fetchJson(url) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    config.requestTimeoutMs
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new ExternalServiceError(
        `Погодный API вернул HTTP ${response.status}.`
      );
    }

    try {
      return await response.json();
    } catch {
      throw new ExternalServiceError(
        "Погодный API вернул некорректный JSON."
      );
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ExternalServiceError(
        "Погодный API не ответил вовремя."
      );
    }

    if (error instanceof ExternalServiceError) {
      throw error;
    }

    throw new ExternalServiceError(
      "Не удалось подключиться к погодному API."
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function getForecast(
  latitude,
  longitude,
  days = 3
) {
  const url = new URL(config.weatherApiUrl);

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    forecast_days: String(days),
    timezone: "auto"
  }).toString();

  const data = await fetchJson(url);

  const daily = data?.daily;

  if (
    !daily ||
    !Array.isArray(daily.time) ||
    !Array.isArray(daily.temperature_2m_min) ||
    !Array.isArray(daily.temperature_2m_max) ||
    !Array.isArray(daily.precipitation_sum) ||
    !Array.isArray(daily.wind_speed_10m_max)
  ) {
    throw new ExternalServiceError(
      "Погодный API вернул данные в неожиданном формате."
    );
  }

  return daily.time.map((date, index) => ({
    date,
    minTemperature: daily.temperature_2m_min[index],
    maxTemperature: daily.temperature_2m_max[index],
    precipitation: daily.precipitation_sum[index],
    windSpeed: daily.wind_speed_10m_max[index]
  }));
}
