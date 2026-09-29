import * as analyticsRepository from "../repositories/analyticsRepository.js";
import * as siteRepository from "../repositories/siteRepository.js";
import { NotFoundError, ValidationError } from "../errors/AppError.js";

function parseDate(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} имеет некорректную дату`);
  }

  return date.toISOString();
}

export async function getSiteSummary(siteId) {
  const site = await siteRepository.findById(siteId);

  if (!site) {
    throw new NotFoundError("Площадка не найдена");
  }

  return analyticsRepository.getSiteSummary(siteId);
}

export async function getEquipmentLoad(options = {}) {
  const dateFrom = parseDate(options.from, "from");
  const dateTo = parseDate(options.to, "to");

  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    throw new ValidationError(
      "Дата from не может быть позже даты to"
    );
  }

  const minCount = Number(options.minCount ?? 0);

  if (!Number.isInteger(minCount) || minCount < 0) {
    throw new ValidationError(
      "minCount должен быть целым числом >= 0"
    );
  }

  return analyticsRepository.getEquipmentLoad({
    dateFrom,
    dateTo,
    minCount
  });
}