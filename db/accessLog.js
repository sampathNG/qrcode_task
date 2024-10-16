const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  accessedBy: { type: String, required: true },
  accessedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AccessLog", accessLogSchema);
