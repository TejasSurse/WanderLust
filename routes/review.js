const express = require("express");
const router = express.Router( {mergeParams: true});// to merge object to come id from parent route app.js to reviews.js
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
// reviews validation 
const reviewController = require("../controllers/reviews");



// Reviews - Post Route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.postReview));

// delete review 
router.delete("/:reviewId" , isLoggedIn, isReviewAuthor , wrapAsync(reviewController.deleteReview ));


module.exports = router;