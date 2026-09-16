const dashboardService = require("../services/dashboard.service");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboard = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getDashboard());
});

const getSettings = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getSettings());
});

const saveSettings = asyncHandler(async (req, res) => {
  res.json(await dashboardService.saveSettings(req.body));
});

module.exports = { dashboard, getSettings, saveSettings };
