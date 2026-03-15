const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
"/:id/review",
authMiddleware,
reviewController.addReview
);

router.get(
"/:id/reviews",
reviewController.getReviews
);

module.exports = router;