import { randomUUID } from "node:crypto";

import * as requestsRepository from "../repositories/requestsRepository.js";
import * as equipmentRepository from "../repositories/equipmentRepository.js";

import {
  ConflictError,
  NotFoundError
} from "../errors/AppError.js";

const allowedTransitions = {
  new: ["in_progress", "rejected"],
  in_progress: ["done", "rejected"],
  done: [],
  rejected: []
};

export async function getRequestsList(options = {}) {
  const requests = await requestsRepository.findAll();

  let result = requests;

  if (options.status) {
    result = result.filter(
      (item) => item.status === options.status
    );
  }

  if (options.priority) {
    result = result.filter(
      (item) => item.priority === options.priority
    );
  }

  if (options.equipmentId) {
    result = result.filter(
      (item) => item.equipmentId === options.equipmentId
    );
  }

  if (options.createdFrom) {
    result = result.filter(
      (item) =>
        new Date(item.createdAt) >=
        new Date(options.createdFrom)
    );
  }

  if (options.createdTo) {
    result = result.filter(
      (item) =>
        new Date(item.createdAt) <=
        new Date(options.createdTo)
    );
  }

  if (options.plannedFrom) {
    result = result.filter(
      (item) =>
        item.plannedAt &&
        new Date(item.plannedAt) >=
        new Date(options.plannedFrom)
    );
  }

  if (options.plannedTo) {
    result = result.filter(
      (item) =>
        item.plannedAt &&
        new Date(item.plannedAt) <=
        new Date(options.plannedTo)
    );
  }

  const sortBy = options.sortBy || "createdAt";
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

export async function getRequestById(id) {
  const request = await requestsRepository.findById(id);

  if (!request) {
    throw new NotFoundError("Заявка не найдена.");
  }

  return request;
}

export async function getRequestsByEquipmentId(equipmentId) {
  const equipment = await equipmentRepository.findById(equipmentId);

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено.");
  }

  return requestsRepository.findByEquipmentId(equipmentId);
}

export async function createRequest(data) {
  const equipment = await equipmentRepository.findById(
    data.equipmentId
  );

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено.");
  }

  const now = new Date().toISOString();

  const request = {
    id: randomUUID(),
    equipmentId: data.equipmentId,
    title: data.title,
    description: data.description || "",
    priority: data.priority,
    status: "new",
    plannedAt: data.plannedAt,
    createdAt: now,
    updatedAt: now
  };

  return requestsRepository.create(request);
}

export async function updateRequest(id, data) {
  const existing = await requestsRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Заявка не найдена.");
  }

  const changes = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  return requestsRepository.update(id, changes);
}

export async function updateRequestStatus(id, status) {
  const existing = await requestsRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Заявка не найдена.");
  }

  const allowed = allowedTransitions[existing.status] || [];

  if (!allowed.includes(status)) {
    throw new ConflictError(
      `Недопустимый переход статуса: ${existing.status} → ${status}.`
    );
  }

  return requestsRepository.update(id, {
    status,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteRequest(id) {
  const existing = await requestsRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Заявка не найдена.");
  }

  return requestsRepository.remove(id);
}

export function getAllowedTransitions() {
  return allowedTransitions;
}