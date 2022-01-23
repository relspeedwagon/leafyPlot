const contactEmail = require("../utils/contactEmail");

module.exports = {
    getIndex: (req, res) => {
      res.render("index.ejs");
    },

    getContactForm: (req, res) => {
      res.render("contact.ejs", { user: req.user });
    },

    postContact: (req, res) => {
       // Send contact email
      contactEmail( req.body.subject, req.body.contactName, req.body.email, req.body.message )

      // console.log("Message sent")
      res.redirect("/sent");
    },

    getSent: (req, res) => {
      res.render("sent.ejs", { user: req.user });
    },
  };
  