"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailHelper = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config_1.default.email.support_email,
            pass: config_1.default.email.app_password,
        },
    });
    await transporter.sendMail({
        from: `"Support System" <${config_1.default.email.support_email}>`,
        to,
        subject,
        html,
    });
};
exports.sendEmailHelper = {
    sendEmail,
};
//# sourceMappingURL=sendEmailHelper.js.map