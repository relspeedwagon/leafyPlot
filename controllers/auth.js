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
      const validationErrors = [];
      if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: "Please enter a valid email address." });
      if (validator.isEmpty(req.body.password))
        validationErrors.push({ msg: "Password cannot be blank." });
    
      if (validationErrors.length) {
        await req.flash("errors", validationErrors);
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

};