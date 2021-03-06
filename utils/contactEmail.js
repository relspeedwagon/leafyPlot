require("dotenv").config({ path: "./config/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const contactEmail = async (subject, contactName, fromEmail, message) => {
  const msg = {
    to: "arielle.morabito@gmail.com",
    from: `${process.env.FROM_EMAIL}`,
    subject: "Contact from LeafyPlot",
    html: `
            <div>
                    <p><strong>Contact From:</strong> ${contactName}</p>
                    <p><strong>Email:</strong> ${fromEmail}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong> ${message}</p>
            </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
  console.log("Email Sent");
};

module.exports = contactEmail;
