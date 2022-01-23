require("dotenv").config({ path: "./config/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = async (USER_EMAIL, USER_USERNAME) => {
  const msg = {
    to: `${USER_EMAIL}`,
    from: `${process.env.FROM_EMAIL}`,
    templateId: "d-03b7654f11864ad5a386ae1d7c87797c",
    dynamicTemplateData: {
      subject: "Welcome to LeafyPlot",
      username: `${USER_USERNAME}`,
    },
  };

  sgMail
    .send(msg)
    .then(() => console.log("Mail sent successfully"))
    .catch((error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    });
};

module.exports = welcomeEmail;
