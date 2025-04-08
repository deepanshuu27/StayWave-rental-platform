const Listing= require("../models/listing.js");
const mongoose = require("mongoose");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPS_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});


module.exports.search =async (req, res, next) => {
  
  try{
  const country = req.query.q; // Get the search query from the URL

  console.log(`${country}, listings display`);
  
  if (!country) {
      // If the query is empty, redirect back to the listings page or handle it appropriately
      return res.redirect('/listings');
  }

        // Fetch listings that match the search query from the database
      const allListings = await Listing.find({ country: new RegExp(country, 'i') }); // Case-insensitive search


      if (allListings.length === 0) {
        // If no listings found, set flash message and redirect to home page
        req.flash("error", "No listings found for your search. Discover more amazing destinations!"
);
        return res.redirect("/listings");
    }

      res.render("./listings/index.ejs",{allListings});            // Render the listings on the index page


  } catch (err) {
      console.error(err.message);
      next(err); // Pass the error to the error-handling middleware
  }
  };


  module.exports.filter=  async (req, res,next) => {
    try{
    
        const category = req.query.category;
         console.log(category);
         
        if (!category) {
            return res.status(400).send("Category query parameter is required");
        }
    
             const allListings = await Listing.find({ category });
            console.log("listings display");
    
    
            if (allListings.length === 0) {
                req.flash("error", " Currently No listings found for the specified category");
                return res.redirect("/listings");
            }
    
            
            res.render("./listings/index.ejs",{allListings});
        } 
           
        catch(err){
            
            console.log(err.message);
            next(err);
           }
    
    };

module.exports.index = async(req,res,next)=>{

    try{
      const allListings= await Listing.find({});
      console.log("listings display");
      res.render("./listings/index.ejs",{allListings})
    }

    catch(err){
      console.log(err.message);
      next(err);
     }

    };    



    module.exports.renderNewForm = (req,res)=>{
  
        //       if(!req.isAuthenticated()){                                ; will write in a middleware
        //   req.flash("error","you must be logged in to create listing!");
        //   return res.redirect("/login");
        //  }
              res.render("./listings/new.ejs")
         };




    module.exports.showListing = async(req,res,next)=>{        // display parrticular listing
    
        try{

          let {id}= req.params;
          
          // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(); // skip to 404 or error handler
    }
          
          // Find the listing by ID and populate the reviews and their authors, and also populate the owner

         const listing= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
         console.log("particular listing display for id",id);
              
       if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");                          // if listing not exist then no need to go to show page
      }
             
      //   console.log(listing);
    
         res.render("./listings/show.ejs",{listing});
        
        }
        
           catch(err){
            console.log(err.message);
            next(err);
           }
        };


module.exports.createListing = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1,
        }).send();

        let url = req.file.path;
        let filename = req.file.filename;

        let { title, description, price, location, country,category } = req.body;

        let newListing = new Listing({
            title:title,
            description:description,
            image: { url, filename },
            location:location,
            country:country,
            category:category,
            price:price,
            owner: req.user._id,
            geometry: response.body.features[0].geometry,
        });

        const savedListing = await newListing.save();

        req.flash("success", "Listing successfully created! Start receiving bookings now.");
        res.redirect("/listings");

    } catch (err) {
        console.log(err);
        next(err);
    }
};



       

           


  module.exports.renderEditForm = async(req,res)=>{
     
    let {id}= req.params;
 const listing= await Listing.findById(id);


 if(!listing){
  req.flash("error", "Listing you requested for does not exist");
  res.redirect("/listings");                          // if listing not exist then no need to go to show page
}


let originalImageUrl = listing.image.url;                                // image preview (transformation) using cloudinary inbuilt APIs
console.log(originalImageUrl);


   // here we will degrade the quality of picture when display in edit page bcs already user know what its image is , he only needs preview
const previewUrl = originalImageUrl.replace(
  "/upload",                                                       
  "/upload/c_fill,h_300,w_250/e_blur:100"
);

console.log(previewUrl);            // This will now log the updated URL with transformations


res.render("./listings/edit.ejs",{listing,previewUrl});


};




module.exports.updateListing = async(req,res,next)=>{        // update  listing of id 
    
    try{


        let {id}= req.params;
   
       let listing = await Listing.findById(id);                

        if(!listing.owner.equals(res.locals.currUser._id)){                         // authorization for editing listing
        req.flash("error","You don't have permission to edit");
        return  res.redirect(`/listings/${id}`);
       }


       let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 3,
      })
        .send();
         
     

        let { title, description, price, location, country,category } = req.body;

        let updateData = {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country,
            category:category,

            geometry:response.body.features[0].geometry,   

           
        };

        console.log(req.file);
        
        if (typeof req.file !== "undefined") {    // necessay to check because undefined will be updated if image is not uploaded & it'll give error
           let  url = req.file.path;
           let filename = req.file.filename;
           updateData.image = { url, filename };

      }

   await Listing.findByIdAndUpdate(id, updateData);


   req.flash("success","Listing updated successfully. Your changes are now live!");


   res.redirect(`/listings/${id}`);

   }

    catch(err){
        console.log(err.message);
        console.error(err);
        next(err);
       }
};





module.exports.destoryListing = async(req,res,next)=>{
        
    try{
    
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    
    console.log("listing deleted");

    req.flash("success","Listing Deleted");     // flash message

    res.redirect("/listings");
     }
    
    
     catch(err){
            console.log(err.message);
            next(err);
           }
    };


