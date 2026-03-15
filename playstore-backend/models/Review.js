const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    },

    rating: {
        type: Number,
        required: true
    },

    comment: {
        type: String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Review", reviewSchema);