const express = require("express");
const app=express();
const mongoose=require("mongoose");
const listing = require("./models/listing.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate"); 

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
app.get('/listings',async (req,res)=>{
    const allListings =await listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route
app.get('/listings/new', (req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get('/listings/:id',async (req,res)=>{
    let {id}= req.params;
    const list = await listing.findById(id);
    res.render("listings/show.ejs",{list});
});

//create route
app.post('/listings',async (req,res)=>{
    let newListing= new listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const list= await listing.findById(id);
    res.render("listings/edit.ejs",{list});
});

//Update route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    // console.log(req.body.list);
    await listing.findByIdAndUpdate(id,{...req.body.list});
    res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



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

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});