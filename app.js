const express = require("express");
const app=express();
const mongoose=require("mongoose");
const listing = require("./models/listing.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//index route
app.get('/listings',wrapAsync(async (req,res)=>{
    const allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
app.get('/listings/new', (req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get('/listings/:id',wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const list = await listing.findById(id);
    res.render("listings/show.ejs",{list});
}));

//create route
app.post('/listings',wrapAsync( async (req,res,next)=>{
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
        res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    res.render("listings/edit.ejs",{list});
}));

//Update route
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    // console.log(req.body.list);
    await listing.findByIdAndUpdate(id,{...req.body.list});
    res.redirect(`/listings/${id}`);
}));

//Delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



// app.get('/testListing', async (req,res)=>{
//     let sampleListing = new listing({
//         title:"My new villa",
//         description:"near town",
//         price:10500,
//         country:"india"
//     });
//     await sampleListing.save();
//     console.log("saved");
//     res.send("successful testing");
// });
app.get('/',(req,res)=>{
    res.send("hi i m root");
});

app.all('/{*any}', (req, res, next) => {
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!!");
});


app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});