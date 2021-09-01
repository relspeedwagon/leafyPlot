require("dotenv").config({ path: "./config/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = async (to) => {
        const msg = {
            to,
            from: `${process.env.FROM_EMAIL}`, // Use the email address or domain you verified above
            subject: 'Welcome to LeafyPlot',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        try {
        await sgMail.send(msg);
        } catch (error) {
        console.error(error);
    
        if (error.response) {
            console.error(error.response.body)
        }
        }
    };

    module.exports = welcomeEmail


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