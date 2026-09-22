import { randomUUID } from "node:crypto";

import * as requestsRepository from "../repositories/requestsRepository.js";
import * as equipmentRepository from "../repositories/equipmentRepository.js";

import {
  ConflictError,
  NotFoundError
} from "../errors/AppError.js";

export async function getEquipmentList(options = {}) {
  const equipment = await equipmentRepository.findAll();

  let result = equipment;

  if (options.status) {
    result = result.filter(
      (item) => item.status === options.status
    );
  }

  if (options.type) {
    result = result.filter(
      (item) => item.type === options.type
    );
  }

  if (options.installedFrom) {
    result = result.filter(
      (item) =>
        new Date(item.installedAt) >=
        new Date(options.installedFrom)
    );
  }

  if (options.installedTo) {
    result = result.filter(
      (item) =>
        new Date(item.installedAt) <=
        new Date(options.installedTo)
    );
  }

  const sortBy = options.sortBy || "name";
  const sortOrder = options.sortOrder || "asc";

  result.sort((a, b) => {
    const first = String(a[sortBy] ?? "");
    const second = String(b[sortBy] ?? "");

    const comparison = first.localeCompare(second);

    return sortOrder === "asc"
      ? comparison
      : -comparison;
  });

  const page = options.page || 1;
  const limit = options.limit || 10;

  const total = result.length;
  const start = (page - 1) * limit;

  result = result.slice(start, start + limit);

  return {
    data: result,
    meta: {
      total,
      page,
      limit
    }
  };
}

export async function getEquipmentById(id) {
  const equipment = await equipmentRepository.findById(id);

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено.");
  }

  return equipment;
}

export async function createEquipment(data) {
  const existing = await equipmentRepository.findBySerialNumber(
    data.serialNumber
  );

  if (existing) {
    throw new ConflictError(
      "Оборудование с таким серийным номером уже существует."
    );
  }

  const equipment = {
    id: randomUUID(),
    name: data.name,
    type: data.type,
    serialNumber: data.serialNumber,
    location: data.location,
    status: data.status || "operational",
    installedAt: data.installedAt
  };

  return equipmentRepository.create(equipment);
}

export async function updateEquipment(id, data) {
  const existing = await equipmentRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Оборудование не найдено.");
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

  return equipmentRepository.update(id, data);
}

export async function deleteEquipment(id) {
  const existing = await equipmentRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Оборудование не найдено.");
  }

  const requests =
    await requestsRepository.findByEquipmentId(id);

  const hasOpenRequests = requests.some(
    (request) =>
      request.status !== "done" &&
      request.status !== "rejected"
  );

  if (hasOpenRequests) {
    throw new ConflictError(
      "Нельзя удалить оборудование с открытыми заявками."
    );
  }

  return equipmentRepository.remove(id);
}