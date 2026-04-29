// src/modules/auth/services/otp.service.js
import bcrypt from "bcryptjs";

import OtpVerification from "../models/OtpVerification.js";
import { generateOtp } from "../../../utils/otp.js";
import { sendOtpEmail } from "../../../services/email.service.js";

/* =====================================================
   CONFIG
===================================================== */
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const OTP_MAX_ATTEMPTS = 5;

// industry: cooldown to prevent spam + enumeration
const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

/* =====================================================
   HELPERS
===================================================== */
const computeExpiry = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

const compareOtp = async (plainOtp, otpHash) => {
  return bcrypt.compare(plainOtp, otpHash);
};

const safePurposeLabel = (purpose) => {
  if (!["register", "login", "reset"].includes(purpose)) return "login";
  return purpose;
};

/* =====================================================
   CREATE OTP SESSION
===================================================== */
export const createOtpSession = async ({
  email,
  purpose,
  payload = null,
  meta = null, // { ip, userAgent }
}) => {
  const safePurpose = safePurposeLabel(purpose);
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  // Ensure only one active record per email+purpose
  await OtpVerification.deleteOne({
    email: normalizedEmail,
    purpose: safePurpose,
  });

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  const record = await OtpVerification.create({
    email: normalizedEmail,
    otpHash,
    purpose: safePurpose,
    payload: payload || undefined,
    verifiedAt: null,
    attempts: 0,
    lastSentAt: new Date(),
    expiresAt: computeExpiry(),
    meta: meta || undefined,
  });

  try {
    await sendOtpEmail({
      to: normalizedEmail,
      otp,
      purpose: safePurpose,
    });
  } catch {
    // cleanup record if email fails (very important)
    await record.deleteOne();

    const err = new Error("Email service unavailable. Please try again later.");
    err.statusCode = 500;
    throw err;
  }

  return record;
};

/* =====================================================
   VERIFY OTP SESSION
   - register/login: OTP can be used once
   - reset: OTP can be verified once, then record stays for reset-password
===================================================== */
export const verifyOtpSession = async ({
  email,
  purpose,
  otp,
  consume = false, // if true => delete record after success
}) => {
  const safePurpose = safePurposeLabel(purpose);
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const cleanedOtp = String(otp || "").trim();

  if (!normalizedEmail) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  if (!/^\d{6}$/.test(cleanedOtp)) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  const record = await OtpVerification.findOne({
    email: normalizedEmail,
    purpose: safePurpose,
  });

  if (!record) {
    const err = new Error("OTP not found or expired");
    err.statusCode = 400;
    throw err;
  }

  // OTP session expired guard (TTL deletion might not occur instantly)
  if (record.expiresAt && new Date(record.expiresAt).getTime() <= Date.now()) {
    await record.deleteOne();
    const err = new Error("OTP not found or expired");
    err.statusCode = 400;
    throw err;
  }

  // reset flow: once verified, do not allow reuse for "verify-reset-otp"
  if (safePurpose === "reset" && record.verifiedAt) {
    const err = new Error("OTP already verified");
    err.statusCode = 400;
    throw err;
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await record.deleteOne();
    const err = new Error("Too many invalid attempts");
    err.statusCode = 400;
    throw err;
  }

  const isValid = await compareOtp(cleanedOtp, record.otpHash);

  if (!isValid) {
    record.attempts += 1;
    await record.save();

    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  // success: optionally consume (login/register flows)
  if (consume) {
    await record.deleteOne();
    return null;
  }

  return record;
};

/* =====================================================
   RESEND OTP SESSION
===================================================== */
export const resendOtpSession = async ({ email, purpose, meta = null }) => {
  const safePurpose = safePurposeLabel(purpose);
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const record = await OtpVerification.findOne({
    email: normalizedEmail,
    purpose: safePurpose,
  });

  if (!record) {
    const err = new Error("OTP session not found");
    err.statusCode = 400;
    throw err;
  }

  // if reset already verified -> resend is not allowed (prevents bypassing reset verify step)
  if (safePurpose === "reset" && record.verifiedAt) {
    const err = new Error("OTP already verified");
    err.statusCode = 400;
    throw err;
  }

  const now = Date.now();
  const lastSent = record.lastSentAt ? new Date(record.lastSentAt).getTime() : 0;

  if (now - lastSent < RESEND_COOLDOWN_MS) {
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
    const err = new Error(`Please wait ${remaining}s before resending OTP`);
    err.statusCode = 429;
    throw err;
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  record.otpHash = otpHash;
  record.attempts = 0;
  record.lastSentAt = new Date();
  record.expiresAt = computeExpiry();

  // reset flow: ensure verifiedAt is always cleared on resend
  record.verifiedAt = null;

  if (meta) record.meta = meta;

  await record.save();

  try {
    await sendOtpEmail({
      to: normalizedEmail,
      otp,
      purpose: safePurpose,
    });
  } catch {
    const err = new Error("Email service unavailable. Please try again later.");
    err.statusCode = 500;
    throw err;
  }

  return record;
};
