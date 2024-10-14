import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendConfirmationEmail = async (email: string, name: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Patient Registration" <no-reply@yourapp.com>',
    to: email,
    subject: "Registration Confirmation",
    text: `Hi ${name}, your registration was successful!`,
  });
};
