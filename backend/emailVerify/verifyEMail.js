import nodemailer from 'nodemailer';
import 'dotenv/config';

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  console.log(process.env.MAIL_USER);
  console.log(process.env.MAIL_PASS ? 'PASS EXISTS' : 'NO PASS');
  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.MAIL_USER,
    to: email,
    // Subject of Email
    subject: 'Email Verification',

    // This would be the text of email body
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           ${process.env.PAYMENT_RETURN_URL}/verify/${token} 
           Thanks`,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error('MAIL ERROR:', error);
      return;
    }

    console.log('Email Sent Successfully');
    console.log(info);
  });
};
