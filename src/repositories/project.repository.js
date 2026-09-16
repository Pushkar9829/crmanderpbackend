const Project = require("../models/project.model");

function list({ q, status } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, "i") },
      { location: new RegExp(q, "i") },
      { code: new RegExp(q, "i") },
    ];
  }
  return Project.find(filter).populate("clientId", "name company").sort({ updatedAt: -1 });
}

function findById(id) {
  return Project.findById(id).populate("clientId");
}

function create(data) {
  return Project.create(data);
}

function update(id, data) {
  return Project.findByIdAndUpdate(id, data, { new: true });
}

function remove(id) {
  return Project.findByIdAndDelete(id);
}

function countActive() {
  return Project.countDocuments({ status: "active" });
}

function recent(limit = 5) {
  return Project.find().populate("clientId", "name").sort({ updatedAt: -1 }).limit(limit);
}

function listLite() {
  return Project.find().select("name").sort({ name: 1 });
}

function deleteMany() {
  return Project.deleteMany({});
}

module.exports = { list, findById, create, update, remove, countActive, recent, listLite, deleteMany };
