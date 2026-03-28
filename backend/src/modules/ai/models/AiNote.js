// src/modules/ai/models/AiNote.js
import mongoose from "mongoose";

const aiNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    answer: {
      type: String,
      required: true,
      minlength: 10,
    },

    mode: {
      type: String,
      enum: ["short", "detailed"],
      required: true,
    },

    /* ================= INTEGRATIONS ================= */
    linkedTodo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      default: null,
    },

    linkedQuiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
      default: null,
    },

    /* ================= HISTORY / SOFT DELETE ================= */
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
aiNoteSchema.index({ user: 1, createdAt: -1 });
aiNoteSchema.index({ user: 1, deletedAt: 1, createdAt: -1 });

export default mongoose.model("AiNote", aiNoteSchema);
