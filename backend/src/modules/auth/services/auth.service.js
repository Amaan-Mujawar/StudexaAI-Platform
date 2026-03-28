// src/modules/auth/services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import OtpVerification from "../models/OtpVerification.js";
import AuthThrottle from "../models/AuthThrottle.js";

import {
  validateRegisterPayload,
  validateEmailOtpPayload,
  validateLoginPayload,
  validateForgotPasswordPayload,
  validateResetPasswordPayload,
  validateResendOtpPayload,
} from "../validators/auth.validators.js";

import {
  createOtpSession,
  verifyOtpSession,
  resendOtpSession,
} from "./otp.service.js";

import { setAuthCookie, clearAuthCookie } from "../utils/authCookies.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

/* =====================================================
   JWT HELPERS
===================================================== */
const createToken = (userId, role, email) => {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT secret missing");
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* =====================================================
   REGISTER (STEP 1 — SEND OTP)
===================================================== */
export const registerUserService = async ({ name, email, password, meta }) => {
  const validationError = validateRegisterPayload({ name, email, password });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createOtpSession({
    email: normalizedEmail,
    purpose: "register",
    payload: {
      name,
      passwordHash,
    },
    meta,
  });

  return { message: "OTP sent to email" };
};

/* =====================================================
   VERIFY REGISTER OTP
===================================================== */
export const verifyRegisterOtpService = async ({ email, otp }) => {
  const validationError = validateEmailOtpPayload({ email, otp });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const record = await verifyOtpSession({
    email: normalizedEmail,
    purpose: "register",
    otp,
    consume: false,
  });

  const name = record?.payload?.name;
  const passwordHash = record?.payload?.passwordHash;

  if (!name || !passwordHash) {
    await record.deleteOne().catch(() => { });
    const err = new Error("Registration session invalid. Please register again.");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: passwordHash,
  });

  await record.deleteOne();

  return {
    message: "Registration successful",
    user,
  };
};

/* =====================================================
   LOGIN (DIRECT — NO OTP)
===================================================== */
export const loginUserService = async (req, res, { email, password }) => {
  const validationError = validateLoginPayload({ email, password });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  // DB-backed throttle record
  const throttle = await AuthThrottle.getOrCreate(normalizedEmail);

  if (throttle.isLocked()) {
    const remainingSec = throttle.remainingSeconds?.() || 0;

    const err = new Error(
      remainingSec > 0
        ? `Too many attempts. Try again in ${remainingSec}s.`
        : "Too many attempts. Try again later."
    );
    err.statusCode = 429;
    throw err;
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    console.log(`[Auth] Login attempt failed: User not found (${normalizedEmail})`);
    await AuthThrottle.registerFailure(normalizedEmail);
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log(`[Auth] Login attempt failed: Password mismatch (${normalizedEmail})`);
    await AuthThrottle.registerFailure(normalizedEmail);
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // success => clear throttle state
  await AuthThrottle.registerSuccess(normalizedEmail);

  const token = createToken(user._id, user.role, user.email);

  setAuthCookie(res, token);

  return {
    ...sanitizeUser(user),
    token,
  };
};

/* =====================================================
   REQUEST PASSWORD RESET (SEND OTP)
===================================================== */
export const requestPasswordResetService = async ({ email, meta }) => {
  const validationError = validateForgotPasswordPayload({ email });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  await createOtpSession({
    email: normalizedEmail,
    purpose: "reset",
    meta,
  });

  return { message: "OTP sent to email" };
};

/* =====================================================
   VERIFY RESET OTP
===================================================== */
export const verifyResetOtpService = async ({ email, otp }) => {
  const validationError = validateEmailOtpPayload({ email, otp });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const record = await verifyOtpSession({
    email: normalizedEmail,
    purpose: "reset",
    otp,
    consume: false,
  });

  record.verifiedAt = new Date();
  await record.save();

  return { message: "OTP verified" };
};

/* =====================================================
   RESET PASSWORD
===================================================== */
export const resetPasswordService = async ({ email, newPassword }) => {
  const validationError = validateResetPasswordPayload({
    email,
    newPassword,
  });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const record = await OtpVerification.findOne({
    email: normalizedEmail,
    purpose: "reset",
  });

  if (!record || !record.verifiedAt) {
    const err = new Error("OTP not verified");
    err.statusCode = 400;
    throw err;
  }

  if (record.expiresAt && new Date(record.expiresAt).getTime() <= Date.now()) {
    await record.deleteOne().catch(() => { });
    const err = new Error("OTP not found or expired");
    err.statusCode = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { email: normalizedEmail },
    { $set: { password: passwordHash } }
  );

  await record.deleteOne();

  return { message: "Password reset successful" };
};

/* =====================================================
   RESEND OTP
===================================================== */
export const resendOtpService = async ({ email, type, meta }) => {
  const validationError = validateResendOtpPayload({ email, type });
  if (validationError) {
    const err = new Error(validationError);
    err.statusCode = 400;
    throw err;
  }

  await resendOtpSession({
    email: email.toLowerCase(),
    purpose: type,
    meta,
  });

  return { message: "OTP resent" };
};

/* =====================================================
   LOGOUT
===================================================== */
export const logoutUserService = async (req, res) => {
  clearAuthCookie(res);
  return { message: "Logged out successfully" };
};
