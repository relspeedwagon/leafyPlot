require("dotenv").config({ path: "./config/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const contactEmail = async ( subject, contactName, fromEmail, message ) => {
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
        console.log(msg)
        } catch (error) {
        console.error(error);
    
        if (error.response) {
            console.error(error.response.body)
        }
        res.redirect("/");
        }
        console.log("Email Sent")
    };

    module.exports = contactEmail


// const welcomeEmail = (to) => {
//     const msg = {
//         to,
//         from: `${process.env.FROM_EMAIL}`, // Use the email address or domain you verified above
//         subject: 'Sending with Twilio SendGrid is Fun',
//         text: 'and easy to do anywhere, even with Node.js',
//         html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     };
    
//       //ES8
//     (async () => {
//         try {
//         await sgMail.send(msg);
//         } catch (error) {
//         console.error(error);
    
//         if (error.response) {
//             console.error(error.response.body)
//         }
//         }
//     })();

//     module.exports = welcomeEmail
// };