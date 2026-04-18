import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  userEmail: string,
  userName: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${env.FRONTEND_URL}/verify/${token}`;

  await transporter.sendMail({
    from: `"Profilix" <${env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify your Profilix account",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; background: #0f0f0f; color: #fff; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 32px;">
            <h1 style="color: #a78bfa; margin-top: 0;">Welcome to Profilix 🃏</h1>
            <p>Hey <strong>${userName}</strong>,</p>
            <p>Almost there! Click the button below to verify your email and activate your account.</p>
            <a href="${verifyUrl}"
               style="display: inline-block; background: #7c3aed; color: #fff;
                      padding: 12px 24px; border-radius: 8px; text-decoration: none;
                      font-weight: bold; margin: 16px 0;">
              Verify Email
            </a>
            <p style="color: #888; font-size: 14px;">This link expires in 48 hours. If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
};
