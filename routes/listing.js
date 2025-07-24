const express = require("express");
const router=express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("../schema.js");

const validateListing = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//index route
router.get('/',wrapAsync(async (req,res)=>{
    const allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get('/new', (req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get('/:id',wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const list = await listing.findById(id).populate("reviews");
    if(!list){
        req.flash("error","Listing doesn't exists");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}));

//create route
router.post('/',wrapAsync( async (req,res,next)=>{
        let newListing= new listing(req.body);
        console.log(req.body);
        if(!newListing.title){
            throw new ExpressError(400,"Title is missing!");
        }
        if(!newListing.description){
            throw new ExpressError(400,"Description is missing!");
        }
        if(!newListing.location){
            throw new ExpressError(400,"Location is missing!");
        }
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    if(!list){
        req.flash("error","Listing doesn't exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}));

//Update route
router.put("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // console.log(req.body.list);
    await listing.findByIdAndUpdate(id,{...req.body.list});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router ;