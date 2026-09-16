const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: String,
    email: String,
    phone: String,
    address: String,
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Client", clientSchema);
