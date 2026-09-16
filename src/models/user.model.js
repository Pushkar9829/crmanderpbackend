const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "staff"], default: "staff" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
