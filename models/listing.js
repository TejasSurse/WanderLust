const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { urlencoded } = require("express");
const { required } = require("joi");


// setting schema for mongodb 
const listingSchema = new Schema({
    title :{
        type : String,
        required: true
    }, 
    description : String,

    image : {
      url : String,
      filename : String,
    },
    price : Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref: "Review",   
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry:{
        type:{
            type:String,
            enum : ['Point'],
            required: true
        },
        coordinates :{
            type: [Number],
            required: true
        }
    },
    
});


listingSchema.post("findOneAndDelete", async( listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
  
});



// creaating model using listing schema 
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;