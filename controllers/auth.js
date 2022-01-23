const passport = require("passport");

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
      await passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash("errors", info);
          return res.render("login.ejs");
        }
        // this conditional seems unnec, but seems to prevent redirect before req.login
        if (user) {
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
          });

          res.redirect("/profile");
        }
      })(req, res, next);
    } catch (error) {
      console.log(error);
    }
  },

  logout: (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err)
        console.log(
          "Error : Failed to destroy the session during logout.",
          err
        );
      req.user = null;
      res.redirect("/");
    });
  },
};
