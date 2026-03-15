const Review = require("../models/Review");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const reviewService = require("../services/reviewService");

exports.addReview = async (req, res) => {
    try {
        const review = await reviewService.addReview(
            req.user.userId,
            req.params.id,
            req.body.rating,
            req.body.comment
        );

        res.json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(400).json({
            error: error.message
        });
    }
};

exports.getReviews = async (req, res) => {

    try {

        const appId = req.params.id;

        const reviews = await Review.find({ appId })
        .populate("userId", "name");

        res.json({
            totalReviews: reviews.length,
            reviews
        });

    } catch (error) {

        console.error("Get Reviews Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};