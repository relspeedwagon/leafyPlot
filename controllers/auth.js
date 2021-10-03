const passport = require("passport");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const welcomeEmail = require("../utils/welcomeEmail");

module.exports = {
  getLogin: (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("login", {
      title: "Login",
    });
  },
  
  postLogin: async (req, res, next) => {
    try {
      const validationErrors = await [];
      if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: "Please enter a valid email address." });
      if (validator.isEmpty(req.body.password))
        validationErrors.push({ msg: "Password cannot be blank." });
    
      if (validationErrors.length) {
        req.flash("errors", validationErrors);
        return res.redirect("/login");
      }
      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
      });
      
      await passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash("errors", info);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", { msg: "Success! You are logged in." });
          res.redirect("/profile"); //req.session.returnTo ||
        });
      })(req, res, next);
    } catch (error) {
      
    }
  },
  
  logout: (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err)
        console.log("Error : Failed to destroy the session during logout.", err);
      req.user = null;
      res.redirect("/");
    });
  },

  getUserDetails: async (req, res) => {
    try {
      res.render("my-account.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
  getSignup: (req, res) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("signup", {
      title: "Create Account",
    });
  },
  
  postSignup: async (req, res, next) => {
    console.log(req.body)
    try {
      const validationErrors = await [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });
  
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
  
    User.findOne(
      { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
      (err, existingUser) => {
        if (err) {
          return next(err);
        }
        if (existingUser) {
          req.flash("errors", {
            msg: "Account with that email address or username already exists.",
          });
          return res.redirect("../signup");
        }
        user.save((err) => {
          if (err) {
            return next(err);
          }

          req.logIn(user, (err) => {

            if (err) {
              return next(err);
            }
            // send welcome email
            welcomeEmail(`${user.email}`, `${user.userName}`)

            res.redirect("/profile");
          });
        });
      }
    );
    } catch (err) {
      console.log(err);
    }
  },

  //ACCOUNT EDIT------------------------------------------------
  accountUpdate: async (req, res) => {
    console.log("this is the req body:", req.body)
    try {
      const validationErrors = await [];
      const { userName, email, currentPassword } = req.body;

      if (validationErrors.length) {
        req.flash("errors", validationErrors);
        return res.redirect("/my-account");
        
      } else {
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false, });
        User.findOne({ _id: req.user._id }, function(err, user) {
          if (err) throw err;
          
          // test a matching password
          user.comparePassword(currentPassword, function(err, isMatch) {
              if (err) throw err;
              console.log(currentPassword, isMatch);
          });
          
      });
        
              }
      } catch (err) {
      console.log(err);
    }
  },
};