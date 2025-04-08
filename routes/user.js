const express= require("express");
const router = express.Router();
const passport = require("passport");

const User= require("../models/user.js");

const userController = require("../controllers/user.js");


const{saveRedirectUrl } = require("../middleware.js");

const {UserLoginschema} = require("../schema.js");


const validateUser = (req,res,next)=>{
  console.log(req.body);
  const {username,email,password } = req.body;
  const { error } =UserLoginschema.validate({username,email,password});
  
  if(error){
 
    const msg = error.details.map(el => el.message).join(',');
    req.flash('error', msg);            // custom messages will display from UserLoginschema
    return res.redirect('/signup');

}

else{
  next();
}
};



// SIGNUP GET ROUTE
router.get("/signup",userController.renderSignupForm );

// SIGNUP POST ROUTE
router.post("/signup", userController.userSignup);


//LOGIN GET ROUTE

router.get("/login",userController.renderLoginForm );



//LOGIN POST ROUTE
router.post("/login",saveRedirectUrl ,  passport.authenticate("local", {failureRedirect:"/login", failureFlash: true,}),userController.login );


 //LOGOUT ROUTE
router.get("/logout", userController.userLogout);


module.exports = router;






