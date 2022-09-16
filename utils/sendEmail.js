const nodemailer = require("nodemailer");

const sendEmail = async options => {
  const  transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});
const message = {
  from: `${process.env.SMTP_FROM_NAME}  <${process.env.USER}>`,
  to: options.email,
  subject: options.subject,
  text: options.message
}

await transporter.sendMail(message)
}


module.exports = sendEmail;