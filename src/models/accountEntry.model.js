const mongoose = require("mongoose");

const accountEntrySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["invoice", "receipt", "payment", "expense"], required: true },
    date: { type: Date, required: true },
    party: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, default: 0 },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    category: String,
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("AccountEntry", accountEntrySchema);
