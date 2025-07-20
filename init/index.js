const mongoose =require("mongoose");
const dataObj = require("./data.js");
const listing= require("../models/listing.js");

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
};

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(dataObj.data);
    console.log("data was initialised");
}

initDB();