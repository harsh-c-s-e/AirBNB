const listing= require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${list._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New Review Deleted!");
    res.redirect(`/listings/${id}`);
};