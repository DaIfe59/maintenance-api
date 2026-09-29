import { RequestStatusHistory } from "../../models/index.js";

export async function create(data, transaction) {
  return RequestStatusHistory.create(data, { transaction });
}

export async function findByRequestId(requestId) {
  return RequestStatusHistory.findAll({
    where: { requestId },
    order: [["changedAt", "ASC"]]
  });
}