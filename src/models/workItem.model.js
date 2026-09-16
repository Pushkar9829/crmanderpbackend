const mongoose = require("mongoose");

const workItemSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["planned", "in_progress", "completed"], default: "planned" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkItem", workItemSchema);
