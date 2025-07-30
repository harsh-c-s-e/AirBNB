const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingControllers =require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route('/')
//index route
.get(wrapAsync(listingControllers.renderAllListings))
//create route
.post(isLoggedIn,upload.single('list[image]'),validateListing,wrapAsync(listingControllers.create));

//new route
router.get('/new',isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")
//show route
.get(wrapAsync(listingControllers.show))
//Update route
.put(isLoggedIn,isOwner,upload.single('list[image]'),validateListing, wrapAsync(listingControllers.update))
//Delete route
.delete(isLoggedIn,isOwner, wrapAsync(listingControllers.delete));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControllers.renderEditForm));

module.exports = router ;