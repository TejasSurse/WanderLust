const Listing = require("../models/listing");

const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({accessToken : mapToken});


module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
}

module.exports.newForm =  (req, res)=>{
    
    res.render("listings/new");
}

module.exports.show =  async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    })
    .populate("owner");// nested popluations 
    if(!listing){
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    }
   
    res.render("listings/show", {listing});
}

module.exports.create = async (req , res, next)=>{
    
    let response = await geocodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    }).send();
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // user info stored in req.user by passport 
    newListing.image = {url, filename};
    newListing.geometry  = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("listings");
}

module.exports.edit =  async (req, res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
      }
    let oriLink = listing.image.url;
    oriLink = oriLink.replace("/upload", "/upload/w_250");
    res.render("listings/edit", {listing, oriLink});
}

module.exports.update =  async (req, res)=>{
    
    let {id} = req.params;   
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(req.file != undefined){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`); 
}

module.exports.delete = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}

