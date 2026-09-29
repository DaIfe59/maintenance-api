import { Op } from "sequelize";

import {
  Equipment,
  MaintenanceRequest,
  RequestAssignee,
  Technician,
  Site
} from "../../models/index.js";

const sortFields = {
  title: "title",
  priority: "priority",
  status: "status",
  plannedAt: "plannedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};

function mapRequest(item) {
  if (!item) {
    return null;
  }

  const request = item.toJSON();

  return {
    id: request.id,
    equipmentId: request.equipmentId,
    title: request.title,
    description: request.description,
    priority: request.priority,
    status: request.status,
    plannedAt: request.plannedAt,
    author: request.author,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    equipment: request.equipment || null,
    assignees: request.assignees || []
  };
}

const include = [
  {
    model: Equipment,
    as: "equipment",
    attributes: [
      "id",
      "name",
      "type",
      "serialNumber",
      "status",
      "installedAt"
    ],
    include: [
      {
        model: Site,
        as: "site",
        attributes: [
          "id",
          "name",
          "code",
          "region",
          "latitude",
          "longitude"
        ]
      }
    ]
  },
  {
    model: Technician,
    as: "assignees",
    attributes: [
      "id",
      "fullName",
      "specialization",
      "employeeNumber"
    ],
    through: {
      attributes: [
        "role",
        "hours"
      ]
    }
  }
];

export async function findAll(options = {}) {
  const where = {};

  if (options.status) {
    where.status = options.status;
  }

  if (options.priority) {
    where.priority = options.priority;
  }

  if (options.equipmentId) {
    where.equipmentId = options.equipmentId;
  }

  if (options.createdFrom || options.createdTo) {
    where.createdAt = {};

    if (options.createdFrom) {
      where.createdAt[Op.gte] =
        new Date(options.createdFrom);
    }

    if (options.createdTo) {
      where.createdAt[Op.lte] =
        new Date(options.createdTo);
    }
  }

  if (options.plannedFrom || options.plannedTo) {
    where.plannedAt = {};

    if (options.plannedFrom) {
      where.plannedAt[Op.gte] =
        new Date(options.plannedFrom);
    }

    if (options.plannedTo) {
      where.plannedAt[Op.lte] =
        new Date(options.plannedTo);
    }
  }

  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const offset = (page - 1) * limit;

  const sortBy =
    sortFields[options.sortBy] || "createdAt";

  const sortOrder =
    options.sortOrder === "desc"
      ? "DESC"
      : "ASC";

  const result =
    await MaintenanceRequest.findAndCountAll({
      where,
      include,
      distinct: true,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    });

  return {
    data: result.rows.map(mapRequest),
    meta: {
      total: result.count,
      page,
      limit
    }
  };
}

export async function findById(id) {
  const request =
    await MaintenanceRequest.findByPk(id, {
      include
    });

  return mapRequest(request);
}

export async function findByEquipmentId(
  equipmentId
) {
  const requests =
    await MaintenanceRequest.findAll({
      where: {
        equipmentId
      },
      include,
      order: [["createdAt", "DESC"]]
    });

  return requests.map(mapRequest);
}

export async function create(item) {
  const request =
    await MaintenanceRequest.create({
      id: item.id,
      equipmentId: item.equipmentId,
      title: item.title,
      description: item.description || "",
      priority: item.priority,
      status: item.status || "new",
      plannedAt: item.plannedAt || null,
      author: item.author || "system",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });

  return findById(request.id);
}

export async function update(id, changes, transaction = null) {
  await MaintenanceRequest.update(changes, {
    where: { id },
    transaction
  });

  return findById(id);
}

export async function remove(id) {
  const request =
    await MaintenanceRequest.findByPk(id);

  if (!request) {
    return null;
  }

  await request.destroy();

  return request.toJSON();
}

export async function countOpenByEquipmentId(
  equipmentId
) {
  return MaintenanceRequest.count({
    where: {
      equipmentId,
      status: {
        [Op.notIn]: ["done", "rejected"]
      }
    }
  });
}

export async function findAssignees(id) {
  const request =
    await MaintenanceRequest.findByPk(id, {
      include: [
        {
          model: Technician,
          as: "assignees",
          attributes: [
            "id",
            "fullName",
            "specialization",
            "employeeNumber"
          ],
          through: {
            attributes: ["role", "hours"]
          }
        }
      ]
    });

  return request?.assignees || [];
}

export async function replaceAssignees(
  requestId,
  assignees,
  transaction
) {
  await RequestAssignee.destroy({
    where: {
      requestId
    },
    transaction
  });

  if (assignees.length === 0) {
    return;
  }

  await RequestAssignee.bulkCreate(
    assignees.map((item) => ({
      requestId,
      technicianId: item.technicianId,
      role: item.role,
      hours: item.hours
    })),
    {
      transaction
    }
  );
}