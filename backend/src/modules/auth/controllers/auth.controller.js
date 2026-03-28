// src/modules/auth/controllers/auth.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";

import {
  registerUserService,
  verifyRegisterOtpService,
  loginUserService,
  requestPasswordResetService,
  verifyResetOtpService,
  resetPasswordService,
  resendOtpService,
  logoutUserService,
} from "../services/auth.service.js";

/* =====================================================
   Helpers
===================================================== */
const buildMeta = (req) => ({
  ip:
    req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    null,
  userAgent: req.headers["user-agent"] || null,
});

/* =====================================================
   REGISTER (STEP 1 — SEND OTP)
   POST /api/auth/register
===================================================== */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await registerUserService({
    name,
    email,
    password,
    meta: buildMeta(req),
  });

  res.status(200).json({
    message: result.message || "OTP sent to email for verification",
  });
});

/* =====================================================
   VERIFY REGISTER OTP
   POST /api/auth/verify-register-otp
===================================================== */
export const verifyRegisterOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyRegisterOtpService({ email, otp });

  // preserve existing frontend expectation
  res.status(201).json({
    message: "Registration successful. Please login.",
    _id: result?.user?._id,
    email: result?.user?.email,
  });
});

/* =====================================================
   LOGIN (DIRECT — NO OTP)
   POST /api/auth/login
===================================================== */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUserService(req, res, { email, password });

  // Must match frontend expectation exactly
  res.status(200).json(user);
});

/* =====================================================
   REQUEST PASSWORD RESET (SEND OTP)
   POST /api/auth/forgot-password
===================================================== */
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await requestPasswordResetService({
    email,
    meta: buildMeta(req),
  });

  res.status(200).json({
    message: result.message || "OTP sent to email for password reset",
  });
});

/* =====================================================
   VERIFY RESET OTP
   POST /api/auth/verify-reset-otp
===================================================== */
export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyResetOtpService({ email, otp });

  res.status(200).json({
    message: result.message || "OTP verified successfully",
  });
});

/* =====================================================
   RESET PASSWORD
   POST /api/auth/reset-password
===================================================== */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const result = await resetPasswordService({ email, newPassword });

  res.status(200).json({
    message: result.message || "Password reset successful. Please login.",
  });
});

/* =====================================================
   RESEND OTP
   POST /api/auth/resend-otp
===================================================== */
export const resendOtp = asyncHandler(async (req, res) => {
  const { email, type } = req.body;

  const result = await resendOtpService({
    email,
    type,
    meta: buildMeta(req),
  });

  res.status(200).json({
    message: result.message || "OTP resent successfully",
  });
});

/* =====================================================
   LOGOUT
   POST /api/auth/logout
===================================================== */
export const logoutUser = asyncHandler(async (req, res) => {
  const result = await logoutUserService(req, res);

  res.status(200).json({
    message: result.message || "Logged out successfully",
  });
});
