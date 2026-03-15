const Review = require("../models/Review");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

exports.addReview = async (userId, appId, rating, comment) => {
  const review = await Review.create({
    userId,
    appId,
    rating,
    comment
  });

  const reviews = await Review.find({ appId });

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const roundedRating = Number(avgRating.toFixed(1));

  const app = await Application.findByIdAndUpdate(appId, {
    rating: roundedRating
  });

  // Keep original notification logic
  const notify = new Notification({
    userId: app.ownerId,
    message: `New ${rating}⭐ review on ${app.name}!`
  });
  await notify.save();

  return review;
};
