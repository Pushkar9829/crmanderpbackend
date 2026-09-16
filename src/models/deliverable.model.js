const mongoose = require("mongoose");

const deliverableSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    isImportant: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "blocked"],
      default: "not_started",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Deliverable", deliverableSchema);
