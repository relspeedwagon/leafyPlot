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
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save((err) => {
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
    } catch (err) {
      console.log(err);
    }
  },

  //ACCOUNT EDIT------------------------------------------------
  accountUpdate: async (req, res) => {
    console.log("this is the req body:", req.body)
    try {
      const validationErrors = [];
      const successMessages = [];
      const { editUserName, editEmail, currentPassword, newPassword, confirmNewPassword } = req.body;

      // if (req.user.userName != editUserName){
      //   console.log(req.user.userName, "to", editUserName)

      //   await User.find({ userName: editUserName }, function(err, nameInUse){
      //     if (err) {
      //       return next(err);
      //     }
      //     if (nameInUse.length > 0){
      //       validationErrors.push({ msg: "The username you selected is already in use" });
      //     } 
      //   })
      // };

      // if (req.user.email != editEmail){
      //   console.log(req.user.email, "to", editEmail )

      //   await User.find({ email: editEmail }, function(err, emailInUse){
      //     if (err) {
      //       return next(err);
      //     }
      //     if (emailInUse.length > 0){
      //       validationErrors.push({ msg: "The email you selected is already in use" });
      //     } else {
      //         req.body.editEmail = validator.normalizeEmail(req.body.editEmail, { gmail_remove_dots: false, });
      //     }
      //   });
      // };

      // if (validationErrors.length) {
      //   console.log(validationErrors)
      //   req.flash("errors", validationErrors);
      //   return res.redirect("/my-account");
      // } else {

        await User.findOne({ _id: req.user._id }, function(err, user) {
          if (err) throw err;
        }).
          then( (user) => {
            // verify entered password
            user.comparePassword(currentPassword, function(err, isMatch) {
              if (err) throw err;
              
              if (!isMatch) {
                console.log(currentPassword, "match =", isMatch);
                validationErrors.push("Your account couldn't be updated because the 'Current Password' you entered is incorrect");
                return res.render("my-account.ejs", { user: req.user, message: req.flash("errors", validationErrors) });
                // res.render('yourhbsfile', { message: req.flash('message') });
              } 

              if (isMatch) {
                if (newPassword != currentPassword && newPassword === confirmNewPassword){
                  user.password = newPassword
                  successMessages.push("Your password has been changed")
                }

                if (editUserName != user.userName){
                  user.userName = editUserName
                  successMessages.push("Your username has been changed")
                }

                if (editEmail != user.email){
                  user.email = editEmail
                  successMessages.push("Your email has been updated")
                }
                
                user.save();
                return res.render("my-account.ejs", { user: req.user, message: req.flash("info", successMessages) });
              }
            });
          })
      // }

    } catch (err) {
      console.log(err);
    }
  },
};