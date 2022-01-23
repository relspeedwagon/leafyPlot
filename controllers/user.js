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

  // Save New User -- validateSignup middlware runs before
  postSignup: async (req, res, next) => {
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
          // Send welcome email
          welcomeEmail(`${user.email}`, `${user.userName}`);

          res.redirect("/profile");
        });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // Edit Account Details -- validateEdit middleware runs before
  accountUpdate: async (req, res) => {
    try {
      const validationErrors = [];
      const successMessages = [];
      const {
        editUserName,
        editEmail,
        currentPassword,
        newPassword,
        confirmNewPassword,
      } = req.body;

      await User.findOne({ _id: req.user._id }, function (err) {
        if (err) throw err;
      }).then((user) => {
        // Verify entered password
        user.comparePassword(currentPassword, function (err, isMatch) {
          if (err) throw err;

          if (!isMatch) {
            // console.log(currentPassword, "match =", isMatch);
            validationErrors.push(
              "Your account couldn't be updated because the 'Current Password' you entered is incorrect"
            );
            return res.render("my-account.ejs", {
              user: req.user,
              message: req.flash("errors", validationErrors),
            });
          }

          if (isMatch) {
            if (
              newPassword.length &&
              newPassword != currentPassword &&
              newPassword === confirmNewPassword
            ) {
              user.password = newPassword;
              successMessages.push("Your password has been changed");
            }

            if (editUserName != user.userName) {
              user.userName = editUserName;
              successMessages.push("Your username has been changed");
            }

            if (editEmail != user.email) {
              user.email = editEmail;
              successMessages.push("Your email has been updated");
            }

            let saveChanges = async () => await user.save();
            saveChanges().then(() =>
              res.render("my-account.ejs", {
                user: user,
                message: req.flash("info", successMessages),
              })
            );
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
