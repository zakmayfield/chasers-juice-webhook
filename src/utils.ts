import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
