import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function send({ email, subject, html }) {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
}

function sendActivationEmail(name, email, token) {
  const href = `${process.env.CLIENT_HOST}/activate/${token}`;
  const html = `
    <h1>Hi ${name}, please activate your account</h1>
    <a href="${href}">${href}</a>
  `;

  return send({
    email,
    html,
    subject: 'Account activation',
  });
}

function sendPasswordResetEmail(name, email, token) {
  const href = `${process.env.CLIENT_HOST}/reset-password?token=${token}`;
  const html = `
    <h1>Hi ${name}, you requested a password reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${href}">${href}</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;

  return send({
    email,
    html,
    subject: 'Password Reset Request',
  });
}

export const emailService = {
  send,
  sendActivationEmail,
  sendPasswordResetEmail,
};
