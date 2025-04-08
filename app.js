if(process.env.NODE_ENV  != "production"){
    require("dotenv").config();
}
 

const express= require("express");
const app = express();

const mongoose = require ("mongoose");
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));


const method_override=require("method-override");
app.use(method_override("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);


/// Middleware to parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const ExpressError= require("./utils/ExpressError.js");

const listingRouter =require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter = require("./routes/user.js");



// database created

const dburl = process.env.MONGODB_URI;

async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to MongoDB Atlas");
          
        app.listen(8080, () => {
            console.log("Server is listening on port 8080");
        });

    } 
    catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
    }
}

main();



const flash = require("connect-flash");

const session = require("express-session");

const passport = require("passport");             // passport package installed
const LocalStrategy = require("passport-local");          // passport-local package insatlled
const User= require("./models/user.js");
const MongoStore = require("connect-mongo");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter: 24*3600,                // update info  in session  after 24 hrs interval 
})


store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 *60 *1000,
      httpOnly:true,
    }
};




app.use(session(sessionOptions));
app.use(flash());          // use flash before requiring routes as we are using flash with the help of routes


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currUser =  req.user;               // passport method
    next();

});



  


// app.get("/demoUser", async(req,res)=>{

//     let fakeUser = new User({
//         email: "student @gmail.com",
//         username: "delta-student",
//     });

//     let newUser = await User.register(fakeUser,"helloWorld");
//     res.send(newUser);
// });







app.use("/listings",listingRouter);                // EXPRESS ROUTER
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);  

// app.get("/testListing",async(req,res)=>{
//   let sampleListing = new Listing ({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute, Goa",
//     country:"India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");

//   res.send("successful testing");
// });






// user send request to route that is not above, then we can throw error  

app.all("*",(req,res,next)=>{

    next(new ExpressError(404,"page Not Found"));
});





// common error handling middlewaare
app.use((err,req,res,next)=>{
    
    let {statusCode=500,message="something went wrong"}=err;   // default message &status code is set for expresserror

                                                                                                                                    
  // res.status(statusCode).send(message);
    
   console.log(err.message);   // display message in console
   res.status(statusCode).render("./listings/error.ejs",{err});

});






