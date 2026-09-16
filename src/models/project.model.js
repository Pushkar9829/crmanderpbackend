const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, sparse: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    location: String,
    startDate: Date,
    endDate: Date,
    budget: Number,
    status: {
      type: String,
      enum: ["draft", "active", "on_hold", "completed", "cancelled"],
      default: "draft",
    },
    description: String,
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    notes: String,
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
