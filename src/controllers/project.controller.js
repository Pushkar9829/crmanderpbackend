const projectService = require("../services/project.service");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  res.json(await projectService.list(req.query));
});

const listLite = asyncHandler(async (_req, res) => {
  res.json(await projectService.listLite());
});

const getById = asyncHandler(async (req, res) => {
  res.json(await projectService.getById(req.params.id));
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await projectService.create(req.body, req.user.id));
});

const update = asyncHandler(async (req, res) => {
  res.json(await projectService.update(req.params.id, req.body));
});

const remove = asyncHandler(async (req, res) => {
  await projectService.remove(req.params.id);
  res.status(204).end();
});

module.exports = { list, listLite, getById, create, update, remove };
