import * as equipmentService from "../services/equipmentService.js";
import {
  getRequestsByEquipmentId
} from "../services/requestsService.js";
import {
  getWeatherForEquipment
} from "../services/weatherService.js";

export async function getEquipment(req, res) {
  const result = await equipmentService.getEquipmentList(
    req.validated?.query || req.query
  );

  res.json(result);
}

export async function getEquipmentById(req, res) {
  const id = req.validated?.params?.id || req.params.id;

  const equipment =
    await equipmentService.getEquipmentById(id);

  res.json({
    data: equipment
  });
}

export async function createEquipment(req, res) {
  const data = req.validated?.body || req.body;

  const equipment =
    await equipmentService.createEquipment(data);

  res
    .status(201)
    .location(`/api/equipment/${equipment.id}`)
    .json({
      data: equipment
    });
}

export async function updateEquipment(req, res) {
  const id = req.validated?.params?.id || req.params.id;
  const data = req.validated?.body || req.body;

  const equipment =
    await equipmentService.updateEquipment(id, data);

  res.json({
    data: equipment
  });
}

export async function deleteEquipment(req, res) {
  const id = req.validated?.params?.id || req.params.id;

  await equipmentService.deleteEquipment(id);

  res.status(204).send();
}

export async function getEquipmentRequests(req, res) {
  const id = req.validated?.params?.id || req.params.id;

  const requests =
    await getRequestsByEquipmentId(id);

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
  const id = req.validated?.params?.id || req.params.id;

  const weather =
    await getWeatherForEquipment(id);

  res.json({
    data: weather
  });
}
