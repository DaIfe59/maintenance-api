import * as requestsService from "../services/requestsService.js";

export async function getRequests(req, res) {
  const result = await requestsService.getRequestsList(
    req.validated?.query || req.query
  );

  res.json(result);
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
