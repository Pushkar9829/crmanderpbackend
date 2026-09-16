const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    workItemId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkItem", required: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

assignmentSchema.index({ employeeId: 1, workItemId: 1 }, { unique: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
