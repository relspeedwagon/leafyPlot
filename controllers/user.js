const passport = require("passport");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcrypt");
const User = require("../models/User");

const welcomeEmail = require("../utils/welcomeEmail");

module.exports = {
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
    //   const validationErrors = [];
    // if (!validator.isEmail(req.body.email))
    //   validationErrors.push({ msg: "Please enter a valid email address." });
    // if (!validator.isLength(req.body.password, { min: 8 }))
    //   validationErrors.push({
    //     msg: "Password must be at least 8 characters long",
    //   });
    // if (req.body.password !== req.body.confirmPassword)
    //   validationErrors.push({ msg: "Passwords do not match" });
  
    // if (validationErrors.length) {
    //   req.flash("errors", validationErrors);
    //   return res.redirect("../signup");
    // }
    // req.body.email = validator.normalizeEmail(req.body.email, {
    //   gmail_remove_dots: false,
    // });
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
  
    await User.findOne(
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
      const validationErrors = [];
      const { editUserName, editEmail, currentPassword } = req.body;

      if (req.user.userName != editUserName){
        console.log(req.user.userName, "to", editUserName)

        await User.find({ userName: editUserName }, function(err, nameInUse){
          if (err) {
            return next(err);
          }
          if (nameInUse.length > 0){
            validationErrors.push({ msg: "The username you selected is already in use" });
          } 
        })
      };

      if (req.user.email != editEmail){
        console.log(req.user.email, "to", editEmail )

        await User.find({ email: editEmail }, function(err, emailInUse){
          if (err) {
            return next(err);
          }
          if (emailInUse.length > 0){
            validationErrors.push({ msg: "The email you selected is already in use" });
          } else {
              req.body.editEmail = validator.normalizeEmail(req.body.editEmail, { gmail_remove_dots: false, });
          }
        });
      };

      if (validationErrors.length) {
        console.log(validationErrors)
        req.flash("errors", validationErrors);
        return res.redirect("/my-account");
      } else {

        await User.findOne({ _id: req.user._id }, function(err, user) {
          if (err) throw err;
        }).
          then( (user) => {
            // verify entered password
            user.comparePassword(currentPassword, function(err, isMatch) {
              if (err) throw err;
              
              if (!isMatch) {
                console.log(currentPassword, "match =", isMatch);
                validationErrors.push({ msg: "The password you entered is incorrect" });
                return res.render("my-account.ejs", { user: req.user }, { message: req.flash("errors", validationErrors) });
                // res.render('yourhbsfile', { message: req.flash('message') });
              } 

              if (isMatch) {
                user.userName = editUserName
                user.email = editEmail
                user.save();
                res.redirect("/my-account");
              }
            });
          })
      }

    } catch (err) {
      console.log(err);
    }
  },
};