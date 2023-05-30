import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
