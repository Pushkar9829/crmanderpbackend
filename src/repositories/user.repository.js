const User = require("../models/user.model");

function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

function findById(id) {
  return User.findById(id);
}

function create(data) {
  return User.create(data);
}

function deleteMany() {
  return User.deleteMany({});
}

module.exports = { findByEmail, findById, create, deleteMany };
