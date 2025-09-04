// utils/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp-relay.brevo.com / smtp.gmail.com (use App Password)
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || "Developers Hub";
  return transporter.sendMail({ from, to, subject, html });
}
