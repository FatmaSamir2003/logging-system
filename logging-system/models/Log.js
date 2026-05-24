const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      required: true,
    },

    count: {
      type: Number,
      default: 1,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Log", logSchema);
