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
  const logoUrl = "https://ik.imagekit.io/v6xwevpjp/Profilix/profilix.png?updatedAt=1776982992641";
  const currentYear = new Date().getFullYear();

  await transporter.sendMail({
    from: `"Profilix" <${env.EMAIL_USER}>`,
    to: userEmail,
    subject: "✅ Verify your Profilix account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your Profilix account</title>
        </head>
        <body style="margin:0;padding:0;background-color:#0a0c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0c14;padding:40px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

                  <!-- HEADER: Logo -->
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <img src="${logoUrl}" alt="Profilix Logo" width="44" height="44" style="display:block;border-radius:10px;" />
                          </td>
                          <td style="padding-left:10px;vertical-align:middle;">
                            <span style="font-size:22px;font-weight:700;color:#f2f2f7;letter-spacing:-0.5px;">Profilix</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CARD -->
                  <tr>
                    <td style="background:linear-gradient(160deg,#1c1f2b 0%,#141622 100%);border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

                      <!-- HERO BANNER -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:linear-gradient(135deg,#1e1540 0%,#12141d 60%,#1a1025 100%);padding:48px 40px 40px;text-align:center;border-bottom:1px solid rgba(195,160,105,0.15);">
                            <!-- Badge -->
                            <div style="display:inline-block;background:rgba(195,160,105,0.12);border:1px solid rgba(195,160,105,0.3);border-radius:100px;padding:5px 14px;margin-bottom:20px;">
                              <span style="font-size:12px;font-weight:600;color:#c3a069;letter-spacing:0.08em;text-transform:uppercase;">Account Verification</span>
                            </div>
                            <h1 style="margin:0 0 10px;font-size:28px;font-weight:800;color:#f2f2f7;letter-spacing:-0.5px;line-height:1.2;">Confirm your email address</h1>
                            <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.5;">You're one step away from your professional identity.</p>
                          </td>
                        </tr>
                      </table>

                      <!-- BODY -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:36px 40px;">
                            <p style="margin:0 0 8px;font-size:16px;color:#a1a1aa;">Hi <strong style="color:#f2f2f7;">${userName}</strong>,</p>
                            <p style="margin:0 0 28px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                              Thanks for signing up! To activate your account and start building your professional profile card and ATS-ready resume, please verify your email address.
                            </p>

                            <!-- CTA BUTTON -->
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td align="center" style="padding-bottom:28px;">
                                  <a href="${verifyUrl}"
                                     style="display:inline-block;background:linear-gradient(135deg,#c3a069,#b08d74);color:#12141d;padding:15px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.01em;box-shadow:0 4px 24px rgba(195,160,105,0.35);">
                                    ✓ &nbsp; Verify My Email
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <!-- FALLBACK LINK -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;">
                                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;">Or copy this link into your browser</p>
                                  <p style="margin:0;font-size:12px;color:#c3a069;word-break:break-all;">${verifyUrl}</p>
                                </td>
                              </tr>
                            </table>

                            <!-- DIVIDER -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                              <tr>
                                <td style="border-top:1px solid rgba(255,255,255,0.07);"></td>
                              </tr>
                            </table>

                            <!-- SECURITY NOTICE -->
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td valign="top" width="28" style="padding-top:2px;">
                                  <div style="width:24px;height:24px;background:rgba(195,160,105,0.12);border-radius:6px;text-align:center;line-height:24px;font-size:13px;">🔒</div>
                                </td>
                                <td style="padding-left:12px;">
                                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#f2f2f7;">Security notice</p>
                                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">This link expires in <strong style="color:#a1a1aa;">48 hours</strong>. If you didn't create a Profilix account, you can safely ignore this email — no action is needed.</p>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding:28px 0 0;text-align:center;">
                      <p style="margin:0 0 8px;font-size:12px;color:#52525b;">
                        Sent by <strong style="color:#71717a;">Profilix</strong> · Professional identity for developers
                      </p>
                      <p style="margin:0;font-size:12px;color:#3f3f46;">
                        © ${currentYear} Profilix. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
