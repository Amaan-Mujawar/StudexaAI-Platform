import axios from "axios";

/* =====================================================
   CUSTOM SAFE ERROR
===================================================== */
class EmailServiceError extends Error {
  constructor(message = "Email service unavailable") {
    super(message);
    this.name = "EmailServiceError";
    this.statusCode = 500;
  }
}

/* =====================================================
   BREVO CONFIG
===================================================== */
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/* =====================================================
   SEND OTP EMAIL
===================================================== */
export const sendOtpEmail = async ({ to, otp, purpose }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new EmailServiceError("Email service not configured");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new EmailServiceError("Email sender not configured");
  }

  const subject =
    purpose === "register"
      ? "Verify your StudexaAI account"
      : purpose === "reset"
      ? "Reset your StudexaAI password"
      : "Your StudexaAI login code";

  const headingText =
    purpose === "register"
      ? "Verify your email"
      : purpose === "reset"
      ? "Reset your password"
      : "Your login code";

  const actionText =
    purpose === "register"
      ? "complete your registration"
      : purpose === "reset"
      ? "reset your password"
      : "complete your login";

  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10;

  const htmlContent = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    .otp-digit { font-size: 44px !important; }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 24px 12px !important; }
      .email-card { border-radius: 16px !important; }
      .card-header { padding: 32px 24px 28px !important; }
      .card-body { padding: 28px 24px !important; }
      .card-footer-inner { padding: 20px 24px !important; }
      .otp-digit { font-size: 34px !important; letter-spacing: 8px !important; }
      .otp-box { padding: 16px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:'Inter',Arial,sans-serif;">

  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Your ${headingText.toLowerCase()} code is ${otp} — valid for ${expiryMinutes} minutes.&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-wrapper" style="background-color:#eef2f7;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- ── Brand Header ───────────────────────────────── -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%);border-radius:12px;padding:11px 22px;">
                    <span style="font-family:'Inter',Arial,sans-serif;font-size:19px;font-weight:900;color:#ffffff;letter-spacing:-0.4px;mso-line-height-rule:exactly;">StudexaAI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Main Card ──────────────────────────────────── -->
          <tr>
            <td class="email-card" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(37,99,235,0.10),0 2px 8px rgba(0,0,0,0.04);">

              <!-- Card gradient header -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-header" style="background:linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%);padding:44px 48px 40px;text-align:center;">
                    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"><tr><td style="width:60px;height:60px;background:rgba(255,255,255,0.18);border-radius:50%;text-align:center;vertical-align:middle;"><![endif]-->
                    <div style="display:inline-block;width:60px;height:60px;background:rgba(255,255,255,0.18);border-radius:50%;text-align:center;line-height:60px;margin-bottom:18px;vertical-align:middle;">
                      <span style="font-size:28px;line-height:60px;">🔐</span>
                    </div>
                    <!--[if mso]></td></tr></table><![endif]-->
                    <h1 style="margin:0 0 10px;font-family:'Inter',Arial,sans-serif;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.6px;mso-line-height-rule:exactly;line-height:1.2;">${headingText}</h1>
                    <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;">
                      Use the code below to ${actionText}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- OTP section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-body" style="padding:44px 48px 36px;text-align:center;">
                    <p style="margin:0 0 18px;font-family:'Inter',Arial,sans-serif;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;mso-line-height-rule:exactly;">Your one-time passcode</p>

                    <!-- OTP box -->
                    <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="otp-box" style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:14px;padding:20px 44px;">
                          <span class="otp-digit" style="font-family:'Inter',Arial,sans-serif;font-size:44px;font-weight:900;color:#1e293b;letter-spacing:14px;mso-line-height-rule:exactly;display:block;">${otp}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Timer badge -->
                    <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                      <tr>
                        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50px;padding:6px 18px;">
                          <span style="font-family:'Inter',Arial,sans-serif;font-size:12px;font-weight:700;color:#15803d;">⏱ Expires in ${expiryMinutes} minutes</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:16px 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#94a3b8;line-height:1.6;">
                      Single use only. Do not share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 48px;"><div style="height:1px;background:#f1f5f9;"></div></td>
                </tr>
              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="card-footer-inner" style="padding:24px 48px 36px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-left:4px solid #f97316;border-radius:0 12px 12px 0;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align:top;padding-right:12px;font-size:18px;line-height:1;">⚠️</td>
                              <td>
                                <p style="margin:0 0 4px;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:700;color:#9a3412;">Didn't request this?</p>
                                <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#c2410c;line-height:1.6;">
                                  If you didn't initiate this request, please ignore this email — your account is safe. Consider changing your password if concerned.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── Footer ─────────────────────────────────────── -->
          <tr>
            <td style="padding:28px 0 4px;text-align:center;">
              <p style="margin:0 0 4px;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:700;color:#64748b;">StudexaAI</p>
              <p style="margin:0 0 8px;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#94a3b8;line-height:1.6;">
                This is an automated security email — please do not reply directly.
              </p>
              <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:11px;color:#cbd5e1;">
                © 2026 Amaan Mujawar · All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const payload = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "StudexaAI",
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  try {
    await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });
  } catch (err) {
    console.error("Brevo Email Error:", {
      status: err?.response?.status,
      data: err?.response?.data,
    });

    throw new EmailServiceError();
  }
};

export default sendOtpEmail;
