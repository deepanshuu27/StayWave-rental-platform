const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const ListingController = require("../controllers/listing.js");
const ExpressError = require("../utils/ExpressError.js");



const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });






// Function for Joi validation
const validateListing = (req, res, next) => {
    const { title, description, price, location, country,category } = req.body;
    const { error } = listingSchema.validate({ title, description, price, location, country,category });
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    if (req.file) {
        const mimeType = req.file.mimetype;
        console.log(req);
        if (!mimeType.startsWith('image/')) {
            throw new ExpressError(400, 'Only image files are allowed to update');
        }
    }

    next();
};


router.get("/search", ListingController.search);


// Define specific routes before dynamic routes
router.get("/filter",ListingController.filter);

    // INDEX ROUTE
router.get("/", ListingController.index);

    

// NEW ROUTE
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// SHOW ROUTE
router.get("/:id", ListingController.showListing);

// CREATE ROUTE
router.post("/", isLoggedIn,upload.single('image'), validateListing, ListingController.createListing);



// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.renderEditForm);

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner ,upload.single('image'), validateListing,ListingController.updateListing);

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, ListingController.destoryListing);

// Export the router
module.exports = router;
