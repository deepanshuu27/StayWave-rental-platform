const express= require("express");
const router = express.Router({mergeParams:true});

const Listing= require("../models/listing.js");
const Review = require("../models/review.js");

const {listingSchema,reviewSchema} = require("../schema.js");

const ExpressError= require("../utils/ExpressError.js");

const {isLoggedIn,isReviewAuthor, saveRedirectUrl} = require ("../middleware.js");



const ReviewController = require("../controllers/review.js");


// function for joy validation
const validateReview = (req,res,next)=>{
    const {rating,comment } = req.body;
    const { error } =reviewSchema.validate({rating,comment});
    
    if(error){
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new  ExpressError(400, errMsg);
  }
  
  else{
    next();
  }
  };
  


// REVIEW POST ROUTE
  
router.post("/", isLoggedIn,validateReview,ReviewController.createReview);

  
  // REVIEW DELETE ROUTE
  
  router.delete("/:reviewId",saveRedirectUrl ,isLoggedIn,isReviewAuthor,ReviewController.destroyReview );



  // Export the router
module.exports = router;