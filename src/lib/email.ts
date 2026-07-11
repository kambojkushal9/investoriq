import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(
  email: string,
  code: string,
  type: 'login' | 'reset'
): Promise<void> {
  const subject =
    type === 'login'
      ? 'InvestorIQ — Login Verification Code'
      : 'InvestorIQ — Password Reset Code';

  const heading =
    type === 'login' ? 'Verify Your Login' : 'Reset Your Password';

  const description =
    type === 'login'
      ? 'Use the code below to complete your sign-in to InvestorIQ.'
      : 'Use the code below to reset your InvestorIQ password.';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#050508;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050508;padding:40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0c0c12 0%,#13131f 100%);border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:40px 40px 24px;text-align:center;">
                  <div style="display:inline-block;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);line-height:48px;text-align:center;font-size:20px;font-weight:bold;color:white;margin-bottom:20px;">IQ</div>
                  <h1 style="margin:16px 0 0;font-size:24px;font-weight:700;color:#f4f4f5;letter-spacing:-0.3px;">${heading}</h1>
                  <p style="margin:8px 0 0;font-size:14px;color:#a1a1aa;line-height:1.5;">${description}</p>
                </td>
              </tr>
              <!-- OTP Code -->
              <tr>
                <td style="padding:8px 40px 32px;text-align:center;">
                  <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:24px;margin:0 auto;">
                    <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#818cf8;font-family:'Courier New',monospace;">${code}</span>
                  </div>
                  <p style="margin:16px 0 0;font-size:12px;color:#71717a;">This code expires in <strong style="color:#a1a1aa;">5 minutes</strong></p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                  <p style="margin:0;font-size:11px;color:#52525b;line-height:1.6;">
                    If you didn't request this code, you can safely ignore this email.<br>
                    &copy; ${new Date().getFullYear()} InvestorIQ. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"InvestorIQ" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
}
