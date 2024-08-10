const mongoose = require("mongoose");
const indata = require("./data");
const Listing = require("../models/listing");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
main().then(()=>{
    console.log("data inserted successfully (b)");
}).catch((err)=>{
    console.log("error occurred while inseting data (b)");
});

const initB = async()=>{
    await Listing.deleteMany({}); // clear previous data form databse wanderlust 
    indata.data = indata.data.map((obj) => ({...obj, owner : "6699434f2486057dc69e5a84"}))
    await Listing.insertMany(indata.data);
    console.log("data was Initilized ");
    
}

initB();