import * as equipmentService from "../services/equipmentService.js";

import {
  getRequestsByEquipmentId
} from "../services/requestsService.js";

import {
  getWeatherForEquipment
} from "../services/weatherService.js";


export async function getEquipment(req, res) {
  const result =
    await equipmentService.getEquipmentList(req.query);

  res.json(result);
}

export async function getEquipmentById(req, res) {
  const equipment =
    await equipmentService.getEquipmentById(req.params.id);

  res.json({
    data: equipment
  });
}

export async function createEquipment(req, res) {
  const equipment =
    await equipmentService.createEquipment(req.body);

  res
    .status(201)
    .location(`/api/equipment/${equipment.id}`)
    .json({
      data: equipment
    });
}

export async function updateEquipment(req, res) {
  const equipment =
    await equipmentService.updateEquipment(
      req.params.id,
      req.body
    );

  res.json({
    data: equipment
  });
}

export async function deleteEquipment(req, res) {
  await equipmentService.deleteEquipment(req.params.id);

  res.status(204).send();
}

export async function getEquipmentRequests(req, res) {
  const requests =
    await getRequestsByEquipmentId(req.params.id);

  res.json({
    data: requests,
    meta: {
      total: requests.length,
      page: 1,
      limit: requests.length
    }
  });
}

export async function getEquipmentWeather(req, res) {
  const weather =
    await getWeatherForEquipment(req.params.id);

  res.json({
    data: weather
  });
}