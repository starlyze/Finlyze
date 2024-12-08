import {mailerPassword} from "../config/secrets";
import nodemailer from "nodemailer";

export interface MailData {
  subject: string;
  html: string;
}

export const sendMail = async (to: string, body: MailData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "finlyze@gmail.com",
      pass: mailerPassword
    }
  });
  const mailOptions = {
    to: to,
    subject: body.subject,
    html: body.html,
  }
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(result.response);
  } catch (error) {
    console.log(error);
  }
}
