const deliverableService = require("../services/deliverable.service");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  res.json(await deliverableService.list(req.query.zone));
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await deliverableService.create(req.body));
});

const update = asyncHandler(async (req, res) => {
  res.json(await deliverableService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await deliverableService.remove(req.params.id);
  res.status(204).end();
});

module.exports = { list, create, update, remove };
