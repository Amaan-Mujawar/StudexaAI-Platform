// src/modules/quiz/models/QuizAttempt.js
import mongoose from "mongoose";
import {
  ATTEMPT_STATE_VALUES,
  ATTEMPT_STATES,
} from "../../common/constants/attemptStates.js";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= QUIZ METADATA ================= */
    quizName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
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

    /* ================= ATTEMPT STATE ================= */
    state: {
      type: String,
      enum: ATTEMPT_STATE_VALUES,
      default: ATTEMPT_STATES.DRAFT,
      index: true,
    },

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

    /**
     * Backward compatibility:
     * - keep completed boolean
     * - state becomes source of truth going forward
     */
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    /* ================= LIFECYCLE TRACKERS ================= */
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

    /* ================= INTEGRATIONS ================= */
    linkedTodo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      default: null,
    },

    linkedNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiNote",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* Compound index for frequent queries */
quizAttemptSchema.index({
  user: 1,
  completed: 1,
  deletedAt: 1,
});

/* Extra index for lifecycle queries */
quizAttemptSchema.index({
  user: 1,
  state: 1,
  deletedAt: 1,
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
