import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface ContactFormValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  found: string;
  foundOtherDesc?: string;
  message: string;
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: `Hi there. 👋`,
  });
});

// TODO: consider sending a csv of the user submitted data, if possible. this could allow easy data transfer from contact form to ordering

app.post('/email', (req, res) => {
  const data: ContactFormValues = req.body;
  const isEmptyObject = (obj) => (Object.keys(obj).length === 0 ? true : false);

  if (isEmptyObject(data)) {
    res.status(400).json({
      error: `Send better data, you're probably missing something`,
    });
  }

  const mailOptions = {
    to: process.env.ADDRESS,
    subject: `${data.company} | contact`,
    text: `
      Name: ${data.name}
      Company: ${data.company}
      Phone: ${data.phone}
      Email: ${data.email}
      found: ${data.found}
      foundOtherDesc: ${data.foundOtherDesc ? data.foundOtherDesc : 'N/A'}
      message: ${data.message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(`Error sending email. :(`);
    } else {
      console.log(`Email sent:`, info.response);
      res.status(200).send(`Email sent successfully! :)`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
