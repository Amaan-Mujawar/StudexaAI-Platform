// src/modules/todos/models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueAt: {
      type: Date,
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* ================= INTEGRATIONS ================= */
    linkedQuiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
      default: null,
    },
  },
  { timestamps: true }
);

todoSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Todo", todoSchema);
