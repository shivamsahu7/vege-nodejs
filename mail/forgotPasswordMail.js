const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const mail = require('./../config/mail.js')

async function forgotPasswordMail(recipient, templateData) {
    // mail send
    const transporter = mail.createTransporter();

    const templatePath = path.resolve(process.cwd(),'resources','email', 'forgot-password.ejs');

    const template = await ejs.renderFile(templatePath, templateData);
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: "Forgot Password",
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
    // End mail send
}
  
module.exports = forgotPasswordMail;