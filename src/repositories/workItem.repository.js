const WorkItem = require("../models/workItem.model");

function listByProject(projectId) {
  return WorkItem.find({ projectId }).sort({ createdAt: 1 });
}

function listAll() {
  return WorkItem.find().populate("projectId", "name").sort({ name: 1 });
}

function findById(id) {
  return WorkItem.findById(id);
}

function create(data) {
  return WorkItem.create(data);
}

function update(id, data) {
  return WorkItem.findByIdAndUpdate(id, data, { new: true });
}

function remove(id) {
  return WorkItem.findByIdAndDelete(id);
}

function deleteMany(filter = {}) {
  return WorkItem.deleteMany(filter);
}

module.exports = { listByProject, listAll, findById, create, update, remove, deleteMany };
