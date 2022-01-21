const contactEmail = require("../utils/contactEmail");

module.exports = {
    getIndex: (req, res) => {
      res.render("index.ejs");
    },

    getContactForm: (req, res) => {
      user = req.user
      res.render("contact.ejs");
    },

    postContact: (req, res) => {
      user = req.user
       // Send contact email
      contactEmail( req.body.subject, req.body.contactName, req.body.email, req.body.message )

      // console.log("Message sent")
      res.redirect("/sent");
    },

    getSent: (req, res) => {
      user = req.user
      res.render("sent.ejs");
    },
  };
  