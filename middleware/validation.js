const User = require("../models/User");
const { body, validationResult } = require('express-validator')


const newUserValidationRules = () => {
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

const validate = (req, res, next) => {
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

module.exports = {
  newUserValidationRules,
  validate,
}