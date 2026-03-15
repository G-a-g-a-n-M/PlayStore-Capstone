const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  appId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },
  installedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Installation", installationSchema);
