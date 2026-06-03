
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const reviewSchema = require("./reviewschema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};
// this do bcz when user loggin than session restart and delete existing vriable data that why before
// before redirect login page we need to store redirecturl into locals
module.exports.redirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
  }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
     let listing = await Listing.findById(id);
        if(! listing.owner[0]._id.equals(res.locals.currUser._id)){
            req.flash("error","you are not owner of this listing!");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.isAuther = async (req,res,next)=>{
    let {id , reviewId} = req.params;
     let review = await Review.findById(reviewId);
        if(! review.author._id.equals(res.locals.currUser._id)){
            req.flash("error","you are not author of this review!");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

module.exports.validateListings = (req,res,next) =>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

module.exports.validateReviews = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}
