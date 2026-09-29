import { Op } from "sequelize";

import {
  Equipment,
  EquipmentPassport,
  Site
} from "../../models/index.js";

const sortFields = {
  name: "name",
  type: "type",
  serialNumber: "serialNumber",
  status: "status",
  installedAt: "installedAt"
};

function mapEquipment(item) {
  if (!item) {
    return null;
  }

  const equipment = item.toJSON();

  return {
    id: equipment.id,
    name: equipment.name,
    type: equipment.type,
    serialNumber: equipment.serialNumber,
    location: equipment.site
      ? {
          lat: equipment.site.latitude,
          lon: equipment.site.longitude
        }
      : null,
    status: equipment.status,
    installedAt: equipment.installedAt,
    createdAt: equipment.createdAt,
    updatedAt: equipment.updatedAt,
    site: equipment.site || null,
    passport: equipment.passport || null
  };
}

const include = [
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
  },
  {
    model: EquipmentPassport,
    as: "passport",
    attributes: [
      "id",
      "manufacturer",
      "model",
      "nominalPower",
      "lastVerificationAt"
    ]
  }
];

export async function findAll(options = {}) {
  const where = {};

  if (options.status) {
    where.status = options.status;
  }

  if (options.type) {
    where.type = options.type;
  }

  if (options.installedFrom || options.installedTo) {
    where.installedAt = {};

    if (options.installedFrom) {
      where.installedAt[Op.gte] =
        new Date(options.installedFrom);
    }

    if (options.installedTo) {
      where.installedAt[Op.lte] =
        new Date(options.installedTo);
    }
  }

  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const offset = (page - 1) * limit;

  const sortBy =
    sortFields[options.sortBy] || "name";

  const sortOrder =
    options.sortOrder === "desc"
      ? "DESC"
      : "ASC";

  const result = await Equipment.findAndCountAll({
    where,
    include,
    distinct: true,
    limit,
    offset,
    order: [[sortBy, sortOrder]]
  });

  return {
    data: result.rows.map(mapEquipment),
    meta: {
      total: result.count,
      page,
      limit
    }
  };
}

export async function findById(id) {
  const equipment = await Equipment.findByPk(id, {
    include
  });

  return mapEquipment(equipment);
}

export async function findBySerialNumber(
  serialNumber
) {
  const equipment = await Equipment.findOne({
    where: {
      serialNumber
    },
    include
  });

  return mapEquipment(equipment);
}

export async function create(item, siteId) {
  const equipment = await Equipment.create({
    id: item.id,
    siteId,
    name: item.name,
    type: item.type,
    serialNumber: item.serialNumber,
    status: item.status,
    installedAt: item.installedAt
  });

  return findById(equipment.id);
}

export async function update(id, changes, siteId) {
  const equipment = await Equipment.findByPk(id);

  if (!equipment) {
    return null;
  }

  const updateData = {
    ...changes
  };

  if (siteId) {
    updateData.siteId = siteId;
  }

  await equipment.update(updateData);

  return findById(id);
}

export async function remove(id) {
  const equipment = await Equipment.findByPk(id);

  if (!equipment) {
    return null;
  }

  await equipment.destroy();

  return equipment.toJSON();
}

export async function countOpenRequests(id) {
  const { MaintenanceRequest } =
    await import("../../models/index.js");

  return MaintenanceRequest.count({
    where: {
      equipmentId: id,
      status: {
        [Op.notIn]: ["done", "rejected"]
      }
    }
  });
}