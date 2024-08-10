const {listingSchema, reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing")
const Review = require("./models/reviews");
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        //Stroring Original URL to rediret that one page 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must Be Logged in to Create Listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "Only Owner Can Do this ");
        return res.redirect(`/listings/${id}`);
    }
    next();  // alwasy call next after middleware else site is stuck 
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You Are Not The Author of This Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}