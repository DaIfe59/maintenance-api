import * as equipmentRepository from "../repositories/equipmentRepository.js";
import { NotFoundError } from "../errors/AppError.js";
import { getForecast } from "../weather/openMeteo.js";
import config from "../config/config.js";

export async function getWeatherForEquipment(equipmentId) {
  const equipment =
    await equipmentRepository.findById(equipmentId);

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено.");
  }

  const forecast = await getForecast(
    equipment.location.lat,
    equipment.location.lon,
    3
  );

  const forecastWithSuitability = forecast.map((day) => ({
    ...day,
    suitableForOutdoorWork:
      day.precipitation <= config.weatherMaxPrecipitation &&
      day.windSpeed <= config.weatherMaxWindSpeed
  }));

  return {
    equipment: {
      id: equipment.id,
      name: equipment.name,
      location: equipment.location
    },
    forecast: forecastWithSuitability,
    outdoorWork: {
      suitableDays:
        forecastWithSuitability.filter(
          (day) => day.suitableForOutdoorWork
        ).length,
      totalDays: forecastWithSuitability.length
    }
  };
}
