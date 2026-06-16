// src/modules/practices/aptitude/models/AptitudeAttempt.js

import mongoose from "mongoose";
import { ATTEMPT_STATE_VALUES, ATTEMPT_STATES } from "../../../common/constants/attemptStates.js";

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= PRACTICE METADATA ================= */
    practiceName: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      default: "medium",
    },

    totalQuestions: {
      type: Number,
      required: true,
      enum: [5, 10, 15, 20],
    },

    /* ================= QUESTIONS (IMMUTABLE SNAPSHOT) ================= */
    questions: [
      {
        question: {
          type: String,
          required: true,
          minlength: 5,
        },

        options: {
          type: [String],
          required: true,
          validate: {
            validator: (v) => Array.isArray(v) && v.length === 4,
            message: "Exactly 4 options are required",
          },
        },

        correctIndex: {
          type: Number,
          required: true,
          min: 0,
          max: 3,
        },

        explanation: {
          type: String,
          required: true,
          minlength: 5,
        },
      },
    ],

    /* ================= ATTEMPT LIFECYCLE ================= */
    state: {
      type: String,
      enum: ATTEMPT_STATE_VALUES,
      default: ATTEMPT_STATES.DRAFT,
      index: true,
    },

    /* ================= ATTEMPT STATE ================= */
    currentIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    answers: [
      {
        selectedIndex: {
          type: Number,
          min: 0,
          max: 3,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    completed: {
      type: Boolean,
      default: false,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    expiredAt: {
      type: Date,
      default: null,
    },

    /* ================= SOFT DELETE ================= */
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXES ================= */
aptitudeAttemptSchema.index({
  user: 1,
  completed: 1,
  deletedAt: 1,
});

aptitudeAttemptSchema.index({
  user: 1,
  state: 1,
  deletedAt: 1,
});

export default mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);
