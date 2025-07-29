const listing = require("../models/listing.js");

module.exports.renderAllListings = async (req,res)=>{
    const allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.show = async (req,res)=>{
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
};

module.exports.create = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= new listing(req.body.list);
    newListing.owner =req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    if(!list){
        req.flash("error","Listing doesn't exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
};

module.exports.update = async (req,res)=>{
    let {id}=req.params;
    // console.log(req.body);
    await listing.findByIdAndUpdate(id,{...req.body.list});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};