const Assignment = require("../models/assignment.model");

function listByEmployee(employeeId) {
  return Assignment.find({ employeeId }).populate({
    path: "workItemId",
    populate: { path: "projectId", select: "name" },
  });
}

function listByWorkItem(workItemId) {
  return Assignment.find({ workItemId }).populate("employeeId", "name trade");
}

function findPair(employeeId, workItemId) {
  return Assignment.findOne({ employeeId, workItemId });
}

function create(data) {
  return Assignment.findOneAndUpdate(
    { employeeId: data.employeeId, workItemId: data.workItemId },
    { $setOnInsert: data },
    { upsert: true, new: true },
  );
}

function remove(id) {
  return Assignment.findByIdAndDelete(id);
}

function deleteMany(filter = {}) {
  return Assignment.deleteMany(filter);
}

module.exports = { listByEmployee, listByWorkItem, findPair, create, remove, deleteMany };
