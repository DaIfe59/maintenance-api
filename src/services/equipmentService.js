import { randomUUID } from "node:crypto";

import * as equipmentRepository
  from "../repositories/equipmentRepository.js";

import * as requestsRepository
  from "../repositories/requestsRepository.js";

import * as siteRepository
  from "../repositories/siteRepository.js";

import {
  ConflictError,
  NotFoundError
} from "../errors/AppError.js";

export async function getEquipmentList(options = {}) {
  return equipmentRepository.findAll(options);
}

export async function getEquipmentById(id) {
  const equipment =
    await equipmentRepository.findById(id);

  if (!equipment) {
    throw new NotFoundError(
      "Оборудование не найдено."
    );
  }

  return equipment;
}

export async function createEquipment(data) {
  const existing =
    await equipmentRepository.findBySerialNumber(
      data.serialNumber
    );

  if (existing) {
    throw new ConflictError(
      "Оборудование с таким серийным номером уже существует."
    );
  }

  const site =
    await siteRepository.findOrCreateByLocation(
      data.location
    );

  const equipment = {
    id: randomUUID(),
    name: data.name,
    type: data.type,
    serialNumber: data.serialNumber,
    status: data.status || "operational",
    installedAt: data.installedAt
  };

  return equipmentRepository.create(
    equipment,
    site.id
  );
}

export async function updateEquipment(id, data) {
  const existing =
    await equipmentRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(
      "Оборудование не найдено."
    );
  }

  if (
    data.serialNumber &&
    data.serialNumber !== existing.serialNumber
  ) {
    const duplicate =
      await equipmentRepository.findBySerialNumber(
        data.serialNumber
      );

    if (duplicate) {
      throw new ConflictError(
        "Оборудование с таким серийным номером уже существует."
      );
    }
  }

  let siteId;

  if (data.location) {
    const site =
      await siteRepository.findOrCreateByLocation(
        data.location
      );

    siteId = site.id;
  }

  const changes = {
    name: data.name,
    type: data.type,
    serialNumber: data.serialNumber,
    status: data.status,
    installedAt: data.installedAt
  };

  Object.keys(changes).forEach((key) => {
    if (
      changes[key] === undefined
    ) {
      delete changes[key];
    }
  });

  return equipmentRepository.update(
    id,
    changes,
    siteId
  );
}

export async function deleteEquipment(id) {
  const existing =
    await equipmentRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(
      "Оборудование не найдено."
    );
  }

  const openRequests =
    await requestsRepository.countOpenByEquipmentId(
      id
    );

  if (openRequests > 0) {
    throw new ConflictError(
      "Нельзя удалить оборудование с открытыми заявками."
    );
  }

  return equipmentRepository.remove(id);
}