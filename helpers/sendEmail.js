const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "max.exc7@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;

// ----------------------


// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const { TENET_PASSWORD } = process.env;

// const nodemailerConfig = {
//     host: "mail.te.net.ua",
//     port: 465, //25, 465, 2525
//     secure: true,
//     auth: {
//         user: "exc",
//         pass: TENET_PASSWORD
//     }
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = async (data) => {
//     const email = {...data, from: "exc@te.net.ua"};
//     await transport.sendMail(email);
//     return true;
// }

// module.exports = sendEmail;
