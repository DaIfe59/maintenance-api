import * as analyticsService from "../services/analyticsService.js";

export async function getSiteSummary(req, res, next) {
  try {
    const result = await analyticsService.getSiteSummary(
      req.params.id
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getEquipmentLoad(req, res, next) {
  try {
    const result = await analyticsService.getEquipmentLoad({
      from: req.query.from,
      to: req.query.to,
      minCount: req.query.minCount
    });

    res.json({
      data: result,
      meta: {
        count: result.length
      }
    });
  } catch (error) {
    next(error);
  }
}