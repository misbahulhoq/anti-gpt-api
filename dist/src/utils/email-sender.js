"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTransporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async (body) => {
    const { to, subject, html } = body;
    try {
        await mailTransporter.sendMail({
            from: `"AntiGPT" <${process.env.EMAIL_USER}>`,
            to: to,
            subject,
            html: html,
        });
    }
    catch (err) {
        console.error('error', err);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email-sender.js.map