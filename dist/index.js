"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).json({
        message: `Hi there. 👋`,
    });
});
app.post('/email', async (req, res) => {
    const data = req.body;
    const isEmptyObject = (obj) => (Object.keys(obj).length === 0 ? true : false);
    if (isEmptyObject(data)) {
        return res.status(400).json({
            error: `Try sending some data`,
        });
    }
    const { name, company, phone, email, found, foundOtherDesc, message, token } = data;
    if (!token) {
        return res.status(400).json({
            error: 'reCAPTCHA token required',
        });
    }
    try {
        const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_CONTACT_SECRET_KEY}&response=${token}`);
        if (response.data.success) {
            res.json({
                message: 'Human 👨 👩',
            });
        }
        else {
            // Check for specific error codes or error reasons
            if (response.data['error-codes']) {
                // Handle specific error codes
                const errorCodes = response.data['error-codes'];
                switch (true) {
                    case errorCodes.includes('missing-input-secret'):
                        return res.status(400).json({
                            message: 'The secret parameter is missing',
                        });
                    case errorCodes.includes('invalid-input-secret'):
                        return res.status(400).json({
                            message: 'The secret parameter is invalid or malformed',
                        });
                    case errorCodes.includes('missing-input-response'):
                        return res.status(400).json({
                            message: 'The response parameter is missing',
                        });
                    case errorCodes.includes('invalid-input-response'):
                        return res.status(400).json({
                            message: 'The response parameter is invalid or malformed',
                        });
                    default:
                        return res.status(400).json({
                            message: 'Failed reCAPTCHA check',
                        });
                }
            }
            else if (response.data['error']) {
                // Handle general errors
                return res.status(400).json({
                    message: response.data['error'],
                });
            }
            else {
                return res.status(400).json({
                    message: 'Failed reCAPTCHA check',
                });
            }
        }
    }
    catch (error) {
        // Handle network or other errors
        return res.status(500).json({
            message: 'An error occurred while verifying reCAPTCHA',
        });
    }
    const mailOptions = {
        to: process.env.NODEMAILER_SEND_TO_ADDRESS,
        from: process.env.NODEMAILER_SEND_FROM_ADDRESS,
        subject: `${data.company} | contact`,
        text: foundOtherDesc
            ? `
    Name: ${name}
    Company: ${company}
    Phone: ${phone}
    Email: ${email}
    Found: ${found}
    Found other: ${foundOtherDesc}
    Message: ${message}
  `
            : `
    Name: ${name}
    Company: ${company}
    Phone: ${phone}
    Email: ${email}
    Found: ${found}
    Message: ${message}
  `,
    };
    utils_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send(`Error sending email :(`);
        }
        else {
            res.status(200).send(`Email sent successfully! :)`);
        }
    });
});
app.post('/request-account', async (req, res) => {
    const data = req.body;
    console.log('request-account:log', data);
    const isEmptyObject = (obj) => (Object.keys(obj).length === 0 ? true : false);
    if (isEmptyObject(data)) {
        return res.status(400).json({
            error: `No data received`,
        });
    }
    const { companyName, contact, email, phone, billingAddress, shippingAddress, apEmail, paymentMethod, token, } = data;
    if (!token) {
        return res.status(400).json({
            error: 'reCAPTCHA token required',
        });
    }
    try {
        const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_REQUEST_ACCOUNT_SECRET_KEY}&response=${token}`);
        if (response.data.success) {
            res.json({
                message: 'Human 👨 👩',
            });
        }
        else {
            // Check for specific error codes or error reasons
            if (response.data['error-codes']) {
                // Handle specific error codes
                const errorCodes = response.data['error-codes'];
                switch (true) {
                    case errorCodes.includes('missing-input-secret'):
                        return res.status(400).json({
                            message: 'The secret parameter is missing',
                        });
                    case errorCodes.includes('invalid-input-secret'):
                        return res.status(400).json({
                            message: 'The secret parameter is invalid or malformed',
                        });
                    case errorCodes.includes('missing-input-response'):
                        return res.status(400).json({
                            message: 'The response parameter is missing',
                        });
                    case errorCodes.includes('invalid-input-response'):
                        return res.status(400).json({
                            message: 'The response parameter is invalid or malformed',
                        });
                    default:
                        return res.status(400).json({
                            message: 'Failed reCAPTCHA check',
                        });
                }
            }
            else if (response.data['error']) {
                // Handle general errors
                return res.status(400).json({
                    message: response.data['error'],
                });
            }
            else {
                return res.status(400).json({
                    message: 'Failed reCAPTCHA check',
                });
            }
        }
    }
    catch (error) {
        // Handle network or other errors
        return res.status(500).json({
            message: 'An error occurred while verifying reCAPTCHA',
        });
    }
    const mailOptions = {
        to: process.env.NODEMAILER_SEND_TO_ADDRESS,
        from: process.env.NODEMAILER_SEND_FROM_ADDRESS,
        subject: `${data.companyName} | Request Account`,
        text: `
      Company Name: ${companyName}
      Contact: ${contact}
      Billing Address: ${billingAddress}
      Shipping Address: ${shippingAddress}
      Phone: ${phone}
      Email: ${email}
      A/P Email: ${apEmail}
      Payment Method: ${paymentMethod}
  `,
    };
    utils_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send(`Error sending email :(`);
        }
        else {
            res.status(200).send(`Email sent successfully! :)`);
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
});
//# sourceMappingURL=index.js.map