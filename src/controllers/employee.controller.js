const employeeService = require("../services/employee.service");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (_req, res) => {
  res.json(await employeeService.list());
});

const listActive = asyncHandler(async (_req, res) => {
  res.json(await employeeService.listActive());
});

const getById = asyncHandler(async (req, res) => {
  res.json(await employeeService.getById(req.params.id));
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await employeeService.create(req.body));
});

const assign = asyncHandler(async (req, res) => {
  res.status(201).json(await employeeService.assign(req.body.employeeId, req.body.workItemId));
});

const unassign = asyncHandler(async (req, res) => {
  await employeeService.unassign(req.params.id);
  res.status(204).end();
});

module.exports = { list, listActive, getById, create, assign, unassign };
