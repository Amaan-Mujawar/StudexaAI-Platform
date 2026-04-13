// src/modules/auth/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
      match: [
        /^[A-Za-z]+(?: [A-Za-z]+)*$/,
        "Name can contain only alphabets and single spaces (no numbers or symbols)",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* ================= AI USAGE TRACKING ================= */
    aiUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    aiLastReset: {
      type: Date,
      default: Date.now,
    },

    /* ================= PROFILE & PREFERENCES ================= */
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      privacy: {
        showProfile: { type: Boolean, default: true },
        showActivity: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },

    /* ================= CONTEST GAMIFICATION ================= */
    totalContestPoints: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    contestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastContestDate: {
      type: Date,
      default: null,
    },

    badges: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          awardedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
