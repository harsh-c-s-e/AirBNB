const express = require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} =require("../middleware.js");

//post review route
router.post("/",isLoggedIn,validateReview ,wrapAsync(async (req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${list._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router ;
