const TimeEntry = require("../models/timeEntry.model");

function listByEmployee(employeeId) {
  return TimeEntry.find({ employeeId })
    .populate({ path: "workItemId", populate: { path: "projectId", select: "name" } })
    .sort({ date: -1 });
}

function listInRange({ start, end, employeeId } = {}) {
  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (start || end) {
    filter.date = {};
    if (start) filter.date.$gte = start;
    if (end) filter.date.$lte = end;
  }
  return TimeEntry.find(filter)
    .populate("employeeId", "name trade")
    .populate({ path: "workItemId", populate: { path: "projectId", select: "name" } })
    .sort({ date: -1 });
}

function listByWorkItem(workItemId) {
  return TimeEntry.find({ workItemId });
}

function create(data) {
  return TimeEntry.create(data);
}

function remove(id) {
  return TimeEntry.findByIdAndDelete(id);
}

function findById(id) {
  return TimeEntry.findById(id);
}

function sumHours({ start } = {}) {
  const match = {};
  if (start) match.date = { $gte: start };
  return TimeEntry.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: "$hours" } } }]);
}

function deleteMany(filter = {}) {
  return TimeEntry.deleteMany(filter);
}

module.exports = {
  listByEmployee,
  listInRange,
  listByWorkItem,
  create,
  remove,
  findById,
  sumHours,
  deleteMany,
};
