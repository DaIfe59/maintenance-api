import * as requestsService from "../services/requestsService.js";

export async function getRequests(req, res) {
  const result = await requestsService.getRequestsList(
    req.validated?.query || req.query
  );

  res.json(result);
}


export async function getRequestHistory(req, res, next) {
  try {
    const history = await requestsService.getRequestHistory(req.params.id);

    res.json(history);
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(req, res) {
  const id = req.validated?.params?.id || req.params.id;

  const request =
    await requestsService.getRequestById(id);

  res.json({
    data: request
  });
}

export async function createRequest(req, res) {
  const data = req.validated?.body || req.body;

  const request =
    await requestsService.createRequest(data);

  res
    .status(201)
    .location(`/api/requests/${request.id}`)
    .json({
      data: request
    });
}

export async function updateRequest(req, res) {
  const id = req.validated?.params?.id || req.params.id;
  const data = req.validated?.body || req.body;

  const request =
    await requestsService.updateRequest(id, data);

  res.json({
    data: request
  });
}

export async function updateRequestStatus(req, res) {
  const id = req.validated?.params?.id || req.params.id;
  const data = req.validated?.body || req.body;

  const request =
    await requestsService.updateRequestStatus(
      id,
      data.status
    );

  res.json({
    data: request
  });
}

export async function deleteRequest(req, res) {
  const id = req.validated?.params?.id || req.params.id;

  await requestsService.deleteRequest(id);

  res.status(204).send();
}

export async function addRequestAssignee(req, res, next) {
  try {
    const result = await requestsService.addRequestAssignee(
      req.params.id,
      req.body.userId,
      req.body.role,
      req.body.plannedHours
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeRequestAssignee(req, res, next) {
  try {
    await requestsService.removeRequestAssignee(
      req.params.id,
      req.params.userId
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
