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
      }).withMessage('The username you selcted is already in use by another account'),
      
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
    // body('userName')
    //   .exists().withMessage('You must select a username'),

    body('editUserName')
      .if(value => {
        value != req.user.userName
      })
      .custom(editUserName => {
          return User.findOne({ userName: editUsername }).then(user => {
            return Promise.reject('Username already in use')
          })
      }).withMessage('The new username you selcted is already in use by another account'),
      
    // body('email')
    //   .exists()
    //   .isEmail()
    //   .withMessage('Please enter a valid email'),

    // body('email')
    // .normalizeEmail(req.body.email, { gmail_remove_dots: false }),

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

    // body('password')
    //   .exists()
    //   .isLength({ min: 8 }),

    // body('confirmPassword').custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error('Password confirmation does not match');
    //   }
    //   return true;
    // }),
  ]
}

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