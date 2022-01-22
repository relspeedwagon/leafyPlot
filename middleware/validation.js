const User = require("../models/User");
const { body, validationResult } = require('express-validator')


const newUserRules = () => {
  return [
    body('userName')
      .exists().withMessage('You must select a username'),

    body('userName')
      .custom(userName => {
        return User.findOne({ userName: userName }).then(user => {
          if (user) {
            return Promise.reject('Username already in use');
          }
        });
      }).withMessage('That username is already in use'),
      
    body('email')
      .exists()
      .isEmail()
      .withMessage('Please enter a valid email'),

    body('email')
    .custom(email => {
      return User.findOne({ email: email }).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }).withMessage('The email you entered is already in use by another account'),

    body('password')
      .exists()
      .isLength({ min: 8 }),

    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  ]
}

const editUserRules = () => {
  return [
    body('editUserName')
      .if(value => {
        value != req.user.userName
      })
      .custom(_editUserName => {
          return User.findOne({ userName: editUsername }).then(_user => {
            return Promise.reject('Username already in use')
          })
      }).withMessage('That username is already in use'),

    body('editEmail')
      .if(value => {
        value != req.user.email
      })
      .custom(editEmail => {
        return User.findOne({ email: editEmail }).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }).withMessage('The new email you entered is already in use by another account'),

      body('currentPassword')
        // If newPassword is provided
        .if(body('newPassword').notEmpty())
          // currentPassword must not be empty...
          .notEmpty()
            .withMessage('Current password is required for password change')
          // ...and currentPassword cannot === newPassword
          .custom((value, { req }) => value !== req.body.newPassword)
            .withMessage('New password cannot be the same as current password'),

      body('newPassword')
        // If confirmNewPassword is provided, 
        .if(body('confirmNewPassword').notEmpty())
          // newPassword cannot be empty...
          .notEmpty()
            .withMessage('New password must be entered to confirm password')
          // and newPassword must === confirmNewPassword
          .custom((value, { req }) => value === req.body.confirmNewPassword)
            .withMessage("Password couldn't be changed because the new password did not match confirmation"),

      body('confirmNewPassword')
        // If newPassword is provided,
        .if(body('newPassword').notEmpty())
          // confirmNewPassword cannot be empty
          .notEmpty()
          .withMessage("Password couldn't be changed because a new password was entered but not confirmed"),

  ]
}

// ** BUG - some issue with the login rules, "password" errs not showing up **
const loginRules = () => {
  return [
    body('email')
      .exists()
      .isEmail()
      .withMessage('Please enter a valid email'),

    body('email')
      .normalizeEmail({ gmail_remove_dots: false }),

    body('password')
      .exists()
      .withMessage('Password cannot be blank'),
  ]
}

const validateSignup = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push( err.msg ))

  console.log(extractedErrors)
  req.flash("errors", extractedErrors);
  return res.render("signup.ejs");
}

const validateLogin = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push( err.msg ))

  console.log(extractedErrors)
  req.flash("errors", extractedErrors);
  return res.render("login.ejs");
}

const validateEdit = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push( err.msg ))

  console.log(extractedErrors)
  req.flash("errors", extractedErrors);
  return res.render("my-account.ejs", {user: req.user});
}

module.exports = {
  newUserRules,
  editUserRules,
  loginRules,
  validateSignup,
  validateLogin,
  validateEdit,
}