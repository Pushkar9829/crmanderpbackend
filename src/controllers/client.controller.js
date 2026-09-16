const clientService = require("../services/client.service");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (_req, res) => {
  res.json(await clientService.list());
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await clientService.create(req.body));
});

module.exports = { list, create };
