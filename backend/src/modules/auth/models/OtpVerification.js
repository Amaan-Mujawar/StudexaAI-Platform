// src/modules/auth/models/OtpVerification.js
import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["register", "login", "reset"],
      required: true,
      index: true,
    },

    /* ================= REGISTRATION PAYLOAD SNAPSHOT =================
       Used ONLY for registration flow.
    */
    payload: {
      name: {
        type: String,
        default: null,
      },
      passwordHash: {
        type: String,
        default: null,
      },
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= RESET FLOW STATE =================
       Marks OTP as successfully verified
       Required for secure password reset
    */
    verifiedAt: {
      type: Date,
      default: null,
      index: true,
    },

    /* ================= RESEND COOLDOWN TRACKER ================= */
    lastSentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  }
);

/* ================= COMPOUND INDEX =================
   Prevents multiple active OTPs per email + purpose
*/
otpVerificationSchema.index({ email: 1, purpose: 1 }, { unique: true });

export default mongoose.model("OtpVerification", otpVerificationSchema);
