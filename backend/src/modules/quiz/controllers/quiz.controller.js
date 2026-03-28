// src/modules/quiz/controllers/quiz.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";

import { generateQuizService } from "../services/quiz.service.js";

/* =====================================================
   QUIZ CONTROLLER
   Keeps /api/quiz contract unchanged
===================================================== */

/* =========================
   POST /api/quiz/generate
========================= */
export const generateQuiz = asyncHandler(async (req, res) => {
  const { topic, difficulty, count, todoId, noteId } = req.body;

  const attempt = await generateQuizService({
    userId: req.user._id,
    topic,
    difficulty,
    count,
    todoId,
    noteId,
  });

  /**
   * ✅ IMPORTANT (frontend compatibility):
   * Some frontends expect:
   * - attemptId
   * - _id
   *
   * So we return both safely.
   */
  res.status(201).json({
    message: "Quiz generated successfully",
    attemptId: attempt._id,
    attempt,
  });
});

export default {
  generateQuiz,
};
