const Setting = require("../models/setting.model");

function getDefault() {
  return Setting.findOne({ key: "default" });
}

function upsert(data) {
  return Setting.findOneAndUpdate({ key: "default" }, { $set: { ...data, key: "default" } }, { upsert: true, new: true });
}

function deleteMany() {
  return Setting.deleteMany({});
}

module.exports = { getDefault, upsert, deleteMany };
