import nodemailer from 'nodemailer';
import 'dotenv/config';

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
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
    text: `Hi,

You recently registered on our website.

Please verify your email using this link:

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
