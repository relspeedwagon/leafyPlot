const contactEmail = require("../utils/contactEmail");

module.exports = {
    getIndex: (req, res) => {
      res.render("index.ejs");
    },

    getContactForm: (req, res) => {
      console.log(req.user)
      user = req.user
      res.render("contact.ejs");
    },

    postContact: (req, res) => {
       // send contact email
      contactEmail( req.body.subject, req.body.contactName, req.body.email, req.body.message )

      console.log("when does this print")
      res.redirect("/");
    },
  };
  