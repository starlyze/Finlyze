"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const secrets_1 = require("../config/secrets");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "finlyze@gmail.com",
            pass: secrets_1.mailerPassword
        }
    });
    const mailOptions = {
        to: to,
        subject: body.subject,
        html: body.html,
    };
    try {
        const result = yield transporter.sendMail(mailOptions);
        console.log(result.response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMail = sendMail;
