const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
