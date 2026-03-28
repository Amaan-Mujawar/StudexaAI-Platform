// src/middleware/rateLimit.middleware.js
//
// Rate limiters use a MongoDB store when MONGO_URI is set; otherwise in-memory.
// Misconfigured stores (missing uri/collectionName) throw at construction and can
// crash the server at boot—so we only create MongoStore when config is valid.

import rateLimit from "express-rate-limit";
import MongoStore from "rate-limit-mongo";

const MONGO_URI = process.env.MONGO_URI;
const RATE_LIMIT_COLLECTION = "rate_limits";

/**
 * Build the store for rate limiters.
 * Only use MongoStore when MONGO_URI is valid; otherwise fallback to in-memory store.
 */
function getStore() {
  if (MONGO_URI && typeof MONGO_URI === "string" && MONGO_URI.trim()) {
    try {
      return new MongoStore({
        uri: MONGO_URI.trim(),
        collectionName: RATE_LIMIT_COLLECTION,
        expireTimeMs: 15 * 60 * 1000,
      });
    } catch (e) {
      console.warn(
        "[rateLimit] MongoStore init failed, using in-memory store:",
        e?.message
      );
      return undefined;
    }
  }

  if (!MONGO_URI && process.env.NODE_ENV !== "test") {
    console.warn(
      "[rateLimit] MONGO_URI not set; rate limits use in-memory store (resets on restart)"
    );
  }

  return undefined;
}

const store = getStore();

/**
 * Shared handler (strict JSON contract)
 */
const handler = (req, res) => {
  res.status(429).json({
    message: "Too many requests. Please try again later.",
  });
};

/* =====================================================
   LOGIN RATE LIMITER (brute-force protection)
   Requires: app.set("trust proxy", 1) when behind proxies
===================================================== */
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
  handler,
});

/* =====================================================
   FORGOT PASSWORD RATE LIMITER (OTP spam prevention)
===================================================== */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
  handler,
});

/* =====================================================
   RESEND OTP RATE LIMITER (extra protection)
===================================================== */
export const resendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  ...(store && { store }),
  handler,
});