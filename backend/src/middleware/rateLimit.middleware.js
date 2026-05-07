// src/middleware/rateLimit.middleware.js
//
// Rate limiters use a MongoDB-backed custom store when MONGO_URI is set;
// otherwise fall back to express-rate-limit's built-in in-memory store.
//
// IMPORTANT: express-rate-limit requires each limiter to have its OWN store
// instance. A factory function (makeStore) is used so each call returns a
// fresh instance with a unique key-prefix, satisfying ERR_ERL_STORE_REUSE.

import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

/* =====================================================
   MONGOOSE STORE (replaces rate-limit-mongo)
   Implements the express-rate-limit Store interface:
   https://express-rate-limit.mintlify.app/reference/stores
===================================================== */

const rateLimitSchema = new mongoose.Schema(
  {
    key:       { type: String, required: true, unique: true, index: true },
    totalHits: { type: Number, default: 0 },
    resetTime: { type: Date,   required: true },
  },
  { collection: "rate_limits" }
);
// MongoDB TTL: auto-delete documents after resetTime has passed
rateLimitSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 });

const RateLimitModel =
  mongoose.models.RateLimit ||
  mongoose.model("RateLimit", rateLimitSchema);

class MongooseStore {
  /**
   * @param {string} prefix - Unique namespace for this limiter's keys.
   *   express-rate-limit enforces that no two limiters share a store instance,
   *   so we create one MongooseStore per limiter and namespace keys with prefix.
   */
  constructor(prefix = "rl") {
    this.prefix    = prefix;
    this.windowMs  = 60_000; // overwritten by init()
  }

  /** Called by express-rate-limit during limiter construction */
  async init(options) {
    this.windowMs = options.windowMs ?? this.windowMs;
  }

  _key(rawKey) {
    return `${this.prefix}:${rawKey}`;
  }

  /** Increment hit count; return totalHits + resetTime */
  async increment(key) {
    const namespacedKey = this._key(key);
    const resetTime     = new Date(Date.now() + this.windowMs);

    const doc = await RateLimitModel.findOneAndUpdate(
      { key: namespacedKey },
      {
        $inc:          { totalHits: 1 },
        $setOnInsert:  { resetTime },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    return { totalHits: doc.totalHits, resetTime: doc.resetTime };
  }

  /** Decrement hit count (used by skipSuccessfulRequests / skipFailedRequests) */
  async decrement(key) {
    await RateLimitModel.findOneAndUpdate(
      { key: this._key(key), totalHits: { $gt: 0 } },
      { $inc: { totalHits: -1 } }
    );
  }

  /** Reset the counter for a specific key */
  async resetKey(key) {
    await RateLimitModel.deleteOne({ key: this._key(key) });
  }
}

const MONGO_URI = process.env.MONGO_URI;

/**
 * Factory — returns a fresh MongooseStore instance for each limiter, or
 * undefined (express-rate-limit in-memory default) when MONGO_URI is absent.
 */
function makeStore(prefix) {
  if (MONGO_URI && typeof MONGO_URI === "string" && MONGO_URI.trim()) {
    return new MongooseStore(prefix);
  }

  if (!MONGO_URI && process.env.NODE_ENV !== "test") {
    // Warn once at module load, not once per call
    if (!makeStore._warned) {
      makeStore._warned = true;
      console.warn(
        "[rateLimit] MONGO_URI not set; rate limits use in-memory store (resets on restart)"
      );
    }
  }

  return undefined;
}

/**
 * Shared 429 handler (strict JSON contract)
 */
const handler = (_req, res) => {
  res.status(429).json({
    message: "Too many requests. Please try again later.",
  });
};

/* =====================================================
   LOGIN RATE LIMITER (brute-force protection)
   Requires: app.set("trust proxy", 1) when behind proxies
===================================================== */
const loginStore = makeStore("login");

export const loginLimiter = rateLimit({
  windowMs:       10 * 60 * 1000, // 10 minutes
  max:            10,              // 10 attempts per IP
  standardHeaders: true,
  legacyHeaders:  false,
  ...(loginStore && { store: loginStore }),
  handler,
});

/* =====================================================
   FORGOT PASSWORD RATE LIMITER (OTP spam prevention)
===================================================== */
const forgotStore = makeStore("forgot");

export const forgotPasswordLimiter = rateLimit({
  windowMs:       10 * 60 * 1000, // 10 minutes
  max:            5,               // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders:  false,
  ...(forgotStore && { store: forgotStore }),
  handler,
});

/* =====================================================
   RESEND OTP RATE LIMITER (extra protection)
===================================================== */
const resendStore = makeStore("resend");

export const resendOtpLimiter = rateLimit({
  windowMs:       5 * 60 * 1000, // 5 minutes
  max:            3,              // 3 attempts per IP
  standardHeaders: true,
  legacyHeaders:  false,
  ...(resendStore && { store: resendStore }),
  handler,
});
