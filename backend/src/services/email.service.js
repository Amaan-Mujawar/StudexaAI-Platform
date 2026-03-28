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
      ? "Verify your email address"
      : purpose === "reset"
      ? "Reset your password"
      : "Your login verification code";

  const actionText =
    purpose === "register"
      ? "complete your registration"
      : purpose === "reset"
      ? "reset your password"
      : "complete your login";

  const payload = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME || "StudexaAI",
    },
    to: [{ email: to }],
    subject,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Email Verification</h2>
        <p>Your One-Time Password (OTP) to ${actionText} is:</p>
        <h1 style="letter-spacing: 3px;">${otp}</h1>
        <p>This OTP is valid for a limited time and can be used only once.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>— StudexaAI Team</p>
      </div>
    `,
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
