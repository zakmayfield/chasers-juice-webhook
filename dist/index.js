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
// app.use(validateDomain);
app.get('/', (req, res) => {
    res.status(200).json({
        message: `Hi there. 👋`,
    });
});
// TODO: consider sending a csv of the user submitted data, if possible. this could allow easy data transfer from contact form to ordering
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
        const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`);
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
        from: process.env.USERNAME,
        to: process.env.ADDRESS,
        subject: `${data.company} | contact`,
        text: `
    Name: ${name}
    Company: ${company}
    Phone: ${phone}
    Email: ${email}
    Found: ${found}
    ${foundOtherDesc ? `Found other: ${foundOtherDesc}` : ''}
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
app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
});
//# sourceMappingURL=index.js.map