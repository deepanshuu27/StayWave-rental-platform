const User= require("../models/user.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sendOtpEmail } = require("../utils/sendMail.js");

require("dotenv").config();

// SIGNUP FORM RENDER GET REQUEST
module.exports.renderSignupForm = (req,res)=>{

  res.render("./users/signup.ejs");
};



module.exports.userSignup = async (req, res) => {
  const { username, email, password } = req.body;

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store data in session for OTP verification
  req.session.signupData = { username, email, password, otp };

  try {
    await sendOtpEmail(email, username, otp);
    console.log("✅ OTP email sent to:", email);
    res.redirect("/verify-otp");
  } catch (err) {
    console.error("❌ Error sending OTP email:", err);
    req.flash("error", "Failed to send OTP email. Try again.");
    res.redirect("/signup");
  }
};



module.exports.renderOTPForm = (req, res) => {
  res.render("./users/verifyOtp.ejs"); // you’ll create this view next
};




module.exports.verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  const sessionData = req.session.signupData;

  if (!sessionData) {
    req.flash("error", "Session expired. Please sign up again.");
    return res.redirect("/signup");
  }

  if (otp === sessionData.otp) {
    try {
      const { username, email, password } = sessionData;

      let newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);

      delete req.session.signupData;

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Account verified and created!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", "User creation failed. Try again.");
      res.redirect("/signup");
    }
  } else {
    req.flash("error", "Incorrect OTP. Try again.");
    res.redirect("/verify-otp");
  }
};







// LOGIN FORM RENDER GET REQUEST
module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
  };



  // LOGIN FORM SUBMIT POST REQUEST
module.exports.login = async(req,res)=>{

  req.flash("success","Welcome back! You're now logged in.");
 
   let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
 };


 

 module.exports.userLogout = (req,res)=>{
  req.logout((err)=>{
         if(err){
        next(err);
       }

       req.flash("success","You've been logged out. Come back soon!");
       res.redirect("/listings");
})

};

