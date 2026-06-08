// src/modules/quiz/controllers/quizAttempt.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";

import {
  getCurrentQuizQuestionService,
  submitQuizAnswerService,
  getQuizResultService,
  getQuizHistoryService,
  getQuizReviewService,
  deleteQuizAttemptService,
} from "../services/quizAttempt.service.js";

/* =====================================================
   QUIZ ATTEMPT CONTROLLER
   Handles attempt lifecycle AFTER quiz creation
===================================================== */

/* =========================
   GET /api/quiz/:attemptId/current
========================= */
export const getCurrentQuizQuestion = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const question = await getCurrentQuizQuestionService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(question);
});

/* =========================
   POST /api/quiz/:attemptId/answer
========================= */
export const submitQuizAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { selectedIndex } = req.body;

  const result = await submitQuizAnswerService({
    userId: req.user._id,
    attemptId,
    selectedIndex,
  });

  res.status(200).json(result);
});

/* =========================
   GET /api/quiz/:attemptId/result
========================= */
export const getQuizResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await getQuizResultService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

/* =========================
   GET /api/quiz/:attemptId/review
========================= */
export const getQuizReview = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const review = await getQuizReviewService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(review);
});

/* =========================
   GET /api/quiz/history
========================= */
export const getQuizHistory = asyncHandler(async (req, res) => {
  const history = await getQuizHistoryService({
    userId: req.user._id,
  });

  res.status(200).json(history);
});

/* =========================
   DELETE /api/quiz/:attemptId
========================= */
export const deleteQuizAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await deleteQuizAttemptService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

export default {
  getCurrentQuizQuestion,
  submitQuizAnswer,
  getQuizResult,
  getQuizReview,
  getQuizHistory,
  deleteQuizAttempt,
};
