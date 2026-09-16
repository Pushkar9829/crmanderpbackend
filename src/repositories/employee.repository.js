const Employee = require("../models/employee.model");

function list({ activeOnly = false } = {}) {
  const filter = activeOnly ? { active: true } : {};
  return Employee.find(filter).sort({ name: 1 });
}

function findById(id) {
  return Employee.findById(id);
}

function findByUserId(userId) {
  return Employee.findOne({ userId });
}

function create(data) {
  return Employee.create(data);
}

function update(id, data) {
  return Employee.findByIdAndUpdate(id, data, { new: true });
}

function deleteMany() {
  return Employee.deleteMany({});
}

module.exports = { list, findById, findByUserId, create, update, deleteMany };
