const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    version: {
        type: String
    },

    releaseDate: {
        type: Date
    },

    rating: {
        type: Number,
        default: 0
    },

    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    downloads: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Application", applicationSchema);