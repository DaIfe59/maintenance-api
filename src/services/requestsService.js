import { randomUUID } from "node:crypto";
import * as requestsRepository from "../repositories/requestsRepository.js";
import * as equipmentRepository from "../repositories/equipmentRepository.js";
import * as requestHistoryRepository from "../repositories/requestHistoryRepository.js";
import sequelize from "../config/database.js";
import { ConflictError, NotFoundError } from "../errors/AppError.js";
import * as requestAssigneeRepository from "../repositories/requestAssigneeRepository.js";
import { ValidationError } from "../errors/AppError.js";

const allowedTransitions = {
  new: ["in_progress", "rejected"],
  in_progress: ["done", "rejected"],
  done: [],
  rejected: []
};

export async function getRequestsList(options = {}) {
  return requestsRepository.findAll(options);
}

export async function getRequestById(id) {
  const request = await requestsRepository.findById(id);

  if (!request) {
    throw new NotFoundError("Заявка не найдена");
  }

  return request;
}

export async function getRequestsByEquipmentId(equipmentId, options = {}) {
  const equipment = await equipmentRepository.findById(equipmentId);

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено");
  }

  return requestsRepository.findByEquipmentId(equipmentId, options);
}

export async function createRequest(data) {
  const equipment = await equipmentRepository.findById(data.equipmentId);

  if (!equipment) {
    throw new NotFoundError("Оборудование не найдено");
  }

  return requestsRepository.create({
    id: randomUUID(),
    equipmentId: data.equipmentId,
    title: data.title,
    description: data.description || "",
    priority: data.priority,
    status: "new",
    plannedAt: data.plannedAt ?? null,
    author: data.author || "system"
  });
}

export async function updateRequest(id, data) {
  const existing = await requestsRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Заявка не найдена");
  }

  return requestsRepository.update(id, data);
}

export async function updateRequestStatus(
  id,
  status,
  user,
  comment = null
) {
  return sequelize.transaction(async transaction => {
    const request = await requestsRepository.findById(id);

    if (!request) {
      throw new NotFoundError("Заявка не найдена");
    }

    const currentStatus = request.status;

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      throw new ConflictError(
        `Недопустимый переход статуса: ${currentStatus} -> ${status}`
      );
    }

    if (user.role === "technician") {
  if (!user.technicianId) {
    throw new ConflictError(
      "У пользователя не указан техник"
    );
  }

  const assignees =
    await requestsRepository.findAssignees(id);

  const assigned = assignees.some(
    item => item.id === user.technicianId
  );

  if (!assigned) {
    throw new ConflictError(
      "Техник не назначен на эту заявку"
    );
  }
}

    if (
      currentStatus === "new" &&
      status === "in_progress"
    ) {
      const assignees =
        await requestsRepository.findAssignees(id);

      if (assignees.length === 0) {
        throw new ConflictError(
          "Нельзя перевести заявку в работу без назначенных техников"
        );
      }

      const leadCount = assignees.filter(
        item => item.RequestAssignee?.role === "lead"
      ).length;

      if (leadCount !== 1) {
        throw new ConflictError(
          "Для заявки должен быть назначен ровно один lead-техник"
        );
      }
    }

    await requestsRepository.update(
      id,
      { status },
      transaction
    );

    await requestHistoryRepository.create(
      {
        id: randomUUID(),
        requestId: id,
        previousStatus: currentStatus,
        newStatus: status,
        author: user.email,
        comment,
        changedAt: new Date()
      },
      transaction
    );

    return requestsRepository.findById(id);
  });
}

export async function deleteRequest(id) {
  const existing = await requestsRepository.findById(id);

  if (!existing) {
    throw new NotFoundError("Заявка не найдена");
  }

  await requestsRepository.remove(id);

  return existing;
}

export function getAllowedTransitions(status) {
  return allowedTransitions[status] || [];
}

export async function getRequestHistory(id) {
  const request = await requestsRepository.findById(id);

  if (!request) {
    throw new NotFoundError("Заявка не найдена");
  }

  return requestHistoryRepository.findByRequestId(id);
}

export async function addRequestAssignee(
  requestId,
  userId,
  role,
  plannedHours
) {
  return sequelize.transaction(async transaction => {
    const request = await requestsRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError("Заявка не найдена");
    }

    const technician = await requestAssigneeRepository.findTechnicianById(
      userId,
      transaction
    );

    if (!technician) {
      throw new NotFoundError("Техник не найден");
    }

    if (!["lead", "member"].includes(role)) {
      throw new ValidationError(
        "Роль должна быть lead или member"
      );
    }

    const existing = await requestAssigneeRepository.findByRequestAndTechnician(
      requestId,
      userId,
      transaction
    );

    if (existing) {
      throw new ConflictError(
        "Техник уже назначен на эту заявку"
      );
    }

    const currentAssignees =
      await requestAssigneeRepository.findByRequestId(
        requestId,
        transaction
      );

    const finalLeadCount =
      currentAssignees.filter(item => item.role === "lead").length +
      (role === "lead" ? 1 : 0);

    if (finalLeadCount !== 1) {
      throw new ValidationError(
        "У заявки должен быть ровно один lead-техник"
      );
    }

    await requestAssigneeRepository.create(
      {
        id: randomUUID(),
        requestId,
        technicianId: userId,
        role,
        hours: plannedHours ?? 0
      },
      transaction
    );

    return requestsRepository.findById(requestId);
  });
}

export async function removeRequestAssignee(requestId, userId) {
  return sequelize.transaction(async transaction => {
    const request = await requestsRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError("Заявка не найдена");
    }

    const existing = await requestAssigneeRepository.findByRequestAndTechnician(
      requestId,
      userId,
      transaction
    );

    if (!existing) {
      throw new NotFoundError("Назначение не найдено");
    }

    const currentAssignees =
      await requestAssigneeRepository.findByRequestId(
        requestId,
        transaction
      );

    const finalLeadCount = currentAssignees.filter(
      item =>
        item.role === "lead" &&
        item.technicianId !== userId
    ).length;

    if (finalLeadCount !== 1) {
      throw new ValidationError(
        "Нельзя удалить техника: у заявки должен остаться ровно один lead"
      );
    }

    await requestAssigneeRepository.remove(
      requestId,
      userId,
      transaction
    );

    return requestsRepository.findById(requestId);
  });
}