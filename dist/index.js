"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
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
app.post('/email', (req, res) => {
    const data = req.body;
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
    utils_1.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send(`Error sending email. :(`);
        }
        else {
            console.log(`Email sent:`, info.response);
            res.status(200).send(`Email sent successfully! :)`);
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
});
//# sourceMappingURL=index.js.map