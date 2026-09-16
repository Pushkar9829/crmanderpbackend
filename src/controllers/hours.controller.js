const hoursService = require("../services/hours.service");
const { asyncHandler } = require("../utils/asyncHandler");

const listWorks = asyncHandler(async (_req, res) => {
  res.json(await hoursService.list());
});

const createWork = asyncHandler(async (req, res) => {
  res.status(201).json(await hoursService.create(req.body));
});

const logTime = asyncHandler(async (req, res) => {
  res.status(201).json(await hoursService.logTime(req.body, req.user));
});

const summary = asyncHandler(async (req, res) => {
  res.json(await hoursService.summary(req.query));
});

module.exports = { listWorks, createWork, logTime, summary };
