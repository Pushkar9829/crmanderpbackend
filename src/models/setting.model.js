const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "default" },
  yellowDays: { type: Number, default: 7 },
  redDays: { type: Number, default: 0 },
});

module.exports = mongoose.model("Setting", settingSchema);
