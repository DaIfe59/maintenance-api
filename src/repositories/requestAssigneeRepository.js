import { RequestAssignee, Technician } from "../../models/index.js";

export async function findTechnicianById(id, transaction = null) {
  return Technician.findByPk(id, { transaction });
}

export async function findByRequestId(requestId, transaction = null) {
  return RequestAssignee.findAll({
    where: { requestId },
    order: [["createdAt", "ASC"]],
    transaction
  });
}

export async function findByRequestAndTechnician(
  requestId,
  technicianId,
  transaction = null
) {
  return RequestAssignee.findOne({
    where: {
      requestId,
      technicianId
    },
    transaction
  });
}

export async function create(data, transaction) {
  return RequestAssignee.create(data, { transaction });
}

export async function remove(requestId, technicianId, transaction) {
  return RequestAssignee.destroy({
    where: {
      requestId,
      technicianId
    },
    transaction
  });
}

export async function countLeads(requestId, transaction = null) {
  return RequestAssignee.count({
    where: {
      requestId,
      role: "lead"
    },
    transaction
  });
}