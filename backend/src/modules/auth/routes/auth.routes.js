// src/modules/auth/routes/auth.routes.js
import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  verifyRegisterOtp,
  resendOtp,
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

import protect from "../../../middleware/auth.middleware.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import { loginLimiter } from "../../../middleware/rateLimit.middleware.js";


const router = express.Router();

/* ================= AUTH ROUTES ================= */

// Registration (Step 1: send OTP)
router.post("/register", registerUser);

// Registration (Step 2: verify OTP)
router.post("/verify-register-otp", verifyRegisterOtp);

// ✅ Login (Direct — NO OTP)
router.post("/login", loginUser);

// Forgot password (Step 1: request OTP)
router.post("/forgot-password", requestPasswordReset);

// Forgot password (Step 2: verify OTP)
router.post("/verify-reset-otp", verifyResetOtp);

// Forgot password (Step 3: reset password)
router.post("/reset-password", resetPassword);

// Resend OTP (Register / Reset)
router.post("/resend-otp", resendOtp);

// Logout
router.post("/logout", logoutUser);

// Get logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json(sanitizeUser(req.user));
});

export default router;
