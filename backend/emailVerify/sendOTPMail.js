import 'dotenv/config';
import { createMailTransporter } from './verifyEMail.js';

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = createMailTransporter();

    const mailConfigurations = {
      from: `"FreshRoots" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log('OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    throw error;
  }
};
