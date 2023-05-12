import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ContactFormValues } from './types';
import { validateDomain } from './middleware';
import { transporter } from './utils';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(validateDomain);

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
      error: `Try sending some data.`,
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
