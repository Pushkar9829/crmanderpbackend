const Deliverable = require("../models/deliverable.model");

function listByProject(projectId) {
  return Deliverable.find({ projectId }).sort({ dueDate: 1 });
}

function listAll() {
  return Deliverable.find().populate("projectId", "name").sort({ dueDate: 1 });
}

function findById(id) {
  return Deliverable.findById(id);
}

function create(data) {
  return Deliverable.create(data);
}

function update(id, data) {
  return Deliverable.findByIdAndUpdate(id, data, { new: true });
}

function remove(id) {
  return Deliverable.findByIdAndDelete(id);
}

function deleteMany(filter = {}) {
  return Deliverable.deleteMany(filter);
}

module.exports = { listByProject, listAll, findById, create, update, remove, deleteMany };
