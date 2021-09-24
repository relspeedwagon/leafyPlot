require("dotenv").config({ path: "./config/.env" });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = async (USER_EMAIL, USER_USERNAME) => {
        const msg = {
            to: `${USER_EMAIL}`,
            from: `${process.env.FROM_EMAIL}`, // Use the email address or domain you verified above
            templateId: 'd-03b7654f11864ad5a386ae1d7c87797c',
            dynamicTemplateData: {
                subject: 'Welcome to LeafyPlot',
                username: `${USER_USERNAME}`
            },
        };

        sgMail
            .send(msg)
            .then(() => console.log('Mail sent successfully'))
            .catch(error => {
                console.error(error);

                if (error.response) {
                console.error(error.response.body)
                }
            });
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