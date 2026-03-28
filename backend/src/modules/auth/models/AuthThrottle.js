// src/modules/auth/models/AuthThrottle.js
import mongoose from "mongoose";

/**
 * AuthThrottle Model
 * -------------------
 * Purpose:
 * - DB-backed brute-force protection for login
 * - No external library needed
 *
 * Features:
 * - Per-email throttling
 * - Progressive lock after repeated failures
 * - TTL auto-cleanup
 * - Race-condition safe (upsert)
 * - No null throttle keys (prevents E11000 crashes)
 */

/* ==========================
   SCHEMA
========================== */

const authThrottleSchema = new mongoose.Schema(
  {
    // Throttle key: email only. Required + unique so we never allow null/empty.
    email: {
      type: String,
      required: [true, "Throttle key (email) is required"],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: (v) => typeof v === "string" && v.length > 0,
        message: "Throttle key (email) cannot be empty",
      },
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    lastAttemptAt: {
      type: Date,
      default: null,
    },

    // TTL cleanup (keeps DB clean automatically)
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

/* =====================================================
   CONFIG (tweakable)
===================================================== */
const THROTTLE_TTL_MINUTES = 60; // remove record if no activity
const MAX_ATTEMPTS = 7;
const LOCK_MINUTES = 10;

/* =====================================================
   HELPERS
===================================================== */
const computeExpiry = () =>
  new Date(Date.now() + THROTTLE_TTL_MINUTES * 60 * 1000);

const computeLockUntil = () =>
  new Date(Date.now() + LOCK_MINUTES * 60 * 1000);

/* =====================================================
   INSTANCE METHODS
===================================================== */
authThrottleSchema.methods.isLocked = function () {
  if (!this.lockedUntil) return false;
  return new Date(this.lockedUntil).getTime() > Date.now();
};

authThrottleSchema.methods.remainingSeconds = function () {
  if (!this.lockedUntil) return 0;

  const ms = new Date(this.lockedUntil).getTime() - Date.now();
  if (ms <= 0) return 0;

  return Math.ceil(ms / 1000);
};

/* =====================================================
   STATIC METHODS (RACE-SAFE)
===================================================== */

authThrottleSchema.statics.getOrCreate = async function (email) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  if (!normalizedEmail) {
    const err = new Error("Throttle key (email) is required");
    err.statusCode = 400;
    throw err;
  }

  const expiresAt = computeExpiry();

  // Upsert prevents duplicate-key race conditions
  const doc = await this.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: { expiresAt },
      $setOnInsert: {
        attempts: 0,
        lockedUntil: null,
        lastAttemptAt: null,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  return doc;
};

authThrottleSchema.statics.registerFailure = async function (email) {
  const record = await this.getOrCreate(email);

  if (record.isLocked()) {
    record.expiresAt = computeExpiry();
    record.lastAttemptAt = new Date();
    await record.save();
    return record;
  }

  record.attempts += 1;
  record.lastAttemptAt = new Date();
  record.expiresAt = computeExpiry();

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = computeLockUntil();
  }

  await record.save();
  return record;
};

authThrottleSchema.statics.registerSuccess = async function (email) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  if (!normalizedEmail) {
    const err = new Error("Throttle key (email) is required");
    err.statusCode = 400;
    throw err;
  }

  await this.updateOne(
    { email: normalizedEmail },
    {
      $set: {
        attempts: 0,
        lockedUntil: null,
        lastAttemptAt: null,
        expiresAt: computeExpiry(),
      },
    },
    { upsert: true }
  );
};

/**
 * Optional one-time cleanup for legacy DB state.
 * Safe to call on startup.
 */
authThrottleSchema.statics.cleanupStaleIndex = async function () {
  const coll = this.collection;

  try {
    await coll.dropIndex("key_1");
  } catch (e) {
    if (e.code !== 27 && e.codeName !== "IndexNotFound") throw e;
  }

  const result = await coll.deleteMany({
    $or: [
      { key: null },
      { key: "" },
      { email: { $exists: false } },
      { email: null },
      { email: "" },
    ],
  });

  if (result.deletedCount > 0) {
    console.log(
      `[AuthThrottle] Cleaned ${result.deletedCount} invalid throttle record(s)`
    );
  }
};

export default mongoose.model("AuthThrottle", authThrottleSchema);