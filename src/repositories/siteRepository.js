import { randomUUID } from "node:crypto";
import { Site } from "../../models/index.js";

export async function findById(id) {
  return Site.findByPk(id);
}

export async function findByLocation(latitude, longitude) {
  return Site.findOne({
    where: {
      latitude,
      longitude
    }
  });
}

export async function findOrCreateByLocation(location) {
  const existing = await findByLocation(
    location.lat,
    location.lon
  );

  if (existing) {
    return existing;
  }

  const suffix = `${location.lat}`
    .replace("-", "m")
    .replace(".", "_");

  const longitudeSuffix = `${location.lon}`
    .replace("-", "m")
    .replace(".", "_");

  return Site.create({
    id: randomUUID(),
    name: `Площадка ${location.lat}, ${location.lon}`,
    code: `SITE-${suffix}-${longitudeSuffix}`,
    region: "Не указан",
    latitude: location.lat,
    longitude: location.lon
  });
}