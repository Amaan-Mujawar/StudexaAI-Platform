// src/modules/common/models/QuestionFingerprint.js

import mongoose from "mongoose";

/**
 * QuestionFingerprint
 * -------------------
 * Stores per-user per-module per-difficulty unique question hashes to enforce:
 * ✅ "No repeated questions ever"
 *
 * Design goals:
 * - DB-light (hash only, no full question text)
 * - Scalable
 * - Persistent across restarts
 * - Prevent duplicates across attempts
 *
 * Notes:
 * - We use TTL expiry to avoid DB bloat.
 * - TTL duration can be tuned later.
 */

const QUESTION_HASH_TTL_DAYS = Number(process.env.QUESTION_HASH_TTL_DAYS || 180);

const questionFingerprintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: ["quiz", "logical-reasoning", "aptitude", "verbal-reasoning"],
    },

    difficulty: {
      type: String,
      required: true,
      trim: true,
      enum: ["easy", "medium", "hard"],
      index: true,
    },

    hash: {
      type: String,
      required: true,
      trim: true,
      minlength: 16,
      maxlength: 128,
      index: true,
    },

    // TTL cleanup
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicates at DB level
 * - This guarantees "no duplicates ever" even in race conditions.
 */
questionFingerprintSchema.index(
  { user: 1, module: 1, difficulty: 1, hash: 1 },
  { unique: true }
);

questionFingerprintSchema.pre("validate", function () {
  if (!this.expiresAt) {
    const ms = QUESTION_HASH_TTL_DAYS * 24 * 60 * 60 * 1000;
    this.expiresAt = new Date(Date.now() + ms);
  }
});

export default mongoose.model("QuestionFingerprint", questionFingerprintSchema);
