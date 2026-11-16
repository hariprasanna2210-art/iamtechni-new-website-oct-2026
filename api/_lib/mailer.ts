import nodemailer, { type Transporter } from 'nodemailer';
import { MissingEnvVariableError } from './firebaseAdmin.js';

let cachedTransporter: Transporter | null = null;

function getTransporter(): { transporter: Transporter; gmailUser: string } {
  const gmailUser = process.env.GMAIL_USER?.trim();
  if (!gmailUser) {
    console.error('[mailer] Missing environment variable: GMAIL_USER');
    throw new MissingEnvVariableError('GMAIL_USER');
  }

  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!gmailAppPassword) {
    console.error('[mailer] Missing environment variable: GMAIL_APP_PASSWORD');
    throw new MissingEnvVariableError('GMAIL_APP_PASSWORD');
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });
  }

  return { transporter: cachedTransporter, gmailUser };
}

export interface SendCertificateOtpEmailParams {
  to: string;
  certificateId: string;
  otp: string;
}

export async function sendCertificateOtpEmail({
  to,
  certificateId,
  otp,
}: SendCertificateOtpEmailParams): Promise<void> {
  const { transporter, gmailUser } = getTransporter();

  const spacedOtp = otp.split('').join(' ');
  const subject = `Your IAMTECHNI certificate verification code: ${otp}`;

  const text = [
    `Use this code to view certificate ${certificateId}:`,
    '',
    otp,
    '',
    'This code expires in 10 minutes. If you did not request it, you can ignore this email.',
    '',
    'IAMTECHNI · Puducherry · www.iamtechni.in',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F7FC;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#14205A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F4F7FC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 8px 24px rgba(20,32,90,0.06);">
          <tr>
            <td style="height:6px;background:linear-gradient(90deg,#00B0F0 0%,#1C35EA 50%,#4D19EA 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 28px 16px 28px;">
              <img src="https://www.iamtechni.in/logo-on-white.png" alt="IAMTECHNI" style="height:40px;width:auto;display:block;border:0;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 28px 20px 28px;">
              <p style="margin:0;font-size:16px;line-height:1.5;font-weight:600;color:#14205A;">
                Use this code to view certificate <span style="font-family:monospace;color:#1C35EA;">${certificateId}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 28px 24px 28px;">
              <div style="display:inline-block;padding:18px 28px;border-radius:12px;background-color:#F0F5FF;border:1px solid #DBEAFE;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:700;letter-spacing:10px;color:#1C35EA;text-align:center;">
                ${spacedOtp}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 28px 28px 28px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
                This code expires in 10 minutes. If you did not request it, you can ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 28px;background-color:#F8FAFF;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;font-weight:600;color:#64748B;">
                IAMTECHNI &middot; Puducherry &middot; <a href="https://www.iamtechni.in" style="color:#1C35EA;text-decoration:none;">www.iamtechni.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"IAMTECHNI" <${gmailUser}>`,
    to,
    subject,
    text,
    html,
  });
}
