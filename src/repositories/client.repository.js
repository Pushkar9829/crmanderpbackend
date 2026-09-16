const Client = require("../models/client.model");

function list() {
  return Client.find().sort({ name: 1 });
}

function findById(id) {
  return Client.findById(id);
}

function create(data) {
  return Client.create(data);
}

function update(id, data) {
  return Client.findByIdAndUpdate(id, data, { new: true });
}

function deleteMany() {
  return Client.deleteMany({});
}

module.exports = { list, findById, create, update, deleteMany };
