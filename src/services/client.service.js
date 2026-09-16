const clientRepository = require("../repositories/client.repository");

function list() {
  return clientRepository.list();
}

function create(data) {
  if (!data.name) {
    const error = new Error("Name is required");
    error.status = 400;
    throw error;
  }
  return clientRepository.create(data);
}

module.exports = { list, create };
