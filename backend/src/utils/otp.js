// utils/otp.js
import crypto from "crypto";

/* =====================================================
   OTP CONFIG
===================================================== */
const OTP_LENGTH = 6;

/* =====================================================
   GENERATE OTP
   - Numeric
   - Cryptographically secure
===================================================== */
export const generateOtp = () => {
  const max = 10 ** OTP_LENGTH;
  const otp = crypto.randomInt(0, max).toString().padStart(OTP_LENGTH, "0");
  return otp;
};

/* =====================================================
   HASH OTP
   - One-way hash
   - Constant-time safe
===================================================== */
export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/* =====================================================
   COMPARE OTP
   - Hash incoming OTP
   - Timing-safe comparison
===================================================== */
export const compareOtp = (plainOtp, hashedOtp) => {
  const incomingHash = hashOtp(plainOtp);

  const hashBuffer = Buffer.from(hashedOtp, "hex");
  const incomingBuffer = Buffer.from(incomingHash, "hex");

  if (hashBuffer.length !== incomingBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, incomingBuffer);
};
