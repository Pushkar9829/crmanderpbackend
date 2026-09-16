const accountService = require("../services/account.service");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  res.json(await accountService.list(req.query));
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json(await accountService.create(req.body));
});

const remove = asyncHandler(async (req, res) => {
  await accountService.remove(req.params.id);
  res.status(204).end();
});

const exportCsv = asyncHandler(async (req, res) => {
  const entries = await accountService.list(req.query);
  const csv = accountService.toCsv(entries);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="accounts.csv"`);
  res.send(csv);
});

module.exports = { list, create, remove, exportCsv };
