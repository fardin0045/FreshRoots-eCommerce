// import nodemailer from 'nodemailer';
// import 'dotenv/config';

// export const verifyEmail = (token, email) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     family: 4,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   console.log(process.env.MAIL_USER);
//   console.log(process.env.MAIL_PASS ? 'PASS EXISTS' : 'NO PASS');
//   const mailConfigurations = {
//     // It should be a string of sender/server email
//     from: process.env.MAIL_USER,
//     to: email,
//     // Subject of Email
//     subject: 'Email Verification',

//     // This would be the text of email body
//     text: `Hi,

// You recently registered on our website.

// Please verify your email using this link:

// ${process.env.PAYMENT_RETURN_URL}/verify/${token}

// Thanks`,
//   };
//   transporter.sendMail(mailConfigurations, function (error, info) {
//     if (error) {
//       console.error('MAIL ERROR:', error);
//       return;
//     }

//     console.log('Email Sent Successfully');
//     console.log(info);
//   });
// };
import nodemailer from 'nodemailer';
import 'dotenv/config';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const verifyEmail = async (token, email) => {
  try {
    const transporter = createTransporter();

    // Verify transporter connection first
    await transporter.verify();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

    const mailOptions = {
      from: `"FreshRoots 🌱" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Verify Your FreshRoots Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:36px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🌱 FreshRoots</h1>
                      <p style="margin:8px 0 0;color:#bbf7d0;font-size:14px;">Farm Fresh, Delivered to You</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 12px;color:#14532d;font-size:22px;font-weight:600;">Verify your email address</h2>
                      <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                        Thanks for signing up! Click the button below to confirm your email and activate your account.
                        This link expires in <strong>10 minutes</strong>.
                      </p>
                      <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                        <tr>
                          <td style="border-radius:8px;background:#16a34a;">
                            <a href="${verifyUrl}" 
                               style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">
                              ✅ Verify My Email
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">If the button doesn't work, copy and paste this link:</p>
                      <p style="margin:0;word-break:break-all;">
                        <a href="${verifyUrl}" style="color:#16a34a;font-size:13px;">${verifyUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                        If you didn't create an account, you can safely ignore this email.<br>
                        © 2025 FreshRoots. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    throw error; // re-throw so the caller can handle it
  }
};
