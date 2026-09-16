const AccountEntry = require("../models/accountEntry.model");

function list({ type, projectId } = {}) {
  const filter = {};
  if (type) filter.type = type;
  if (projectId) filter.projectId = projectId;
  return AccountEntry.find(filter).populate("projectId", "name").sort({ date: -1 });
}

function findById(id) {
  return AccountEntry.findById(id);
}

function create(data) {
  return AccountEntry.create(data);
}

function update(id, data) {
  return AccountEntry.findByIdAndUpdate(id, data, { new: true });
}

function remove(id) {
  return AccountEntry.findByIdAndDelete(id);
}

function deleteMany(filter = {}) {
  return AccountEntry.deleteMany(filter);
}

module.exports = { list, findById, create, update, remove, deleteMany };
