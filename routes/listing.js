const express = require("express");
const router=express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const { valid } = require("joi");

//index route
router.get('/',wrapAsync(async (req,res)=>{
    const allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get('/new',isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get('/:id',wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const list = await listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!list){
        req.flash("error","Listing doesn't exists");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}));

//create route
router.post('/',isLoggedIn,validateListing ,wrapAsync( async (req,res,next)=>{
        let newListing= new listing(req.body.list);
        // console.log(req.body);
        if(!newListing.title){
            throw new ExpressError(400,"Title is missing!");
        }
        if(!newListing.description){
            throw new ExpressError(400,"Description is missing!");
        }
        if(!newListing.location){
            throw new ExpressError(400,"Location is missing!");
        }
        newListing.owner =req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    if(!list){
        req.flash("error","Listing doesn't exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}));

//Update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // console.log(req.body);
    await listing.findByIdAndUpdate(id,{...req.body.list});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router ;