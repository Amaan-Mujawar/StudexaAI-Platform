// src/modules/quiz/routes/quiz.routes.js
import express from "express";

import protect from "../../../middleware/auth.middleware.js";
import rateLimitAI from "../../../middleware/aiRateLimit.middleware.js";

import { generateQuiz } from "../controllers/quiz.controller.js";

import {
  getCurrentQuizQuestion,
  submitQuizAnswer,
  getQuizResult,
  getQuizReview,
  getQuizHistory,
  deleteQuizAttempt,
} from "../controllers/quizAttempt.controller.js";

const router = express.Router();

/* =====================================================
   QUIZ ROUTES (PROTECTED)
   Contract preserved:
   - /api/quiz/generate
   - /api/quiz/history
   - /api/quiz/:attemptId/current
   - /api/quiz/:attemptId/answer
   - /api/quiz/:attemptId/result
   - /api/quiz/:attemptId/review
   - /api/quiz/:attemptId (DELETE)
===================================================== */

/* Generate Quiz */
router.post("/generate", protect, rateLimitAI, generateQuiz);

/* History */
router.get("/history", protect, getQuizHistory);

/* Attempt flow */
router.get("/:attemptId/current", protect, getCurrentQuizQuestion);
router.post("/:attemptId/answer", protect, submitQuizAnswer);
router.get("/:attemptId/result", protect, getQuizResult);
router.get("/:attemptId/review", protect, getQuizReview);
router.delete("/:attemptId", protect, deleteQuizAttempt);

export default router;
