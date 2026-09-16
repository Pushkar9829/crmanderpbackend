const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    workItemId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkItem", required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true, min: 0.25 },
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("TimeEntry", timeEntrySchema);
