const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    },

    downloadDate: {
        type: Date,
        default: Date.now
    }
}
);

module.exports = mongoose.model("Download", downloadSchema);