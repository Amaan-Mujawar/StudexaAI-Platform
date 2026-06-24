// src/modules/practices/logicalReasoning/controllers/logicalReasoningAttempt.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";

import {
  getCurrentLogicalQuestionService,
  submitLogicalAnswerService,
  getLogicalResultService,
  getLogicalHistoryService,
  getLogicalReviewService,
  deleteLogicalAttemptService,
} from "../services/logicalReasoningAttempt.service.js";

/* =====================================================
   LOGICAL REASONING ATTEMPT CONTROLLER
   Keeps /api/logical-reasoning contract unchanged
===================================================== */

/* =========================
   GET /api/logical-reasoning/:attemptId/current
========================= */
export const getCurrentLogicalQuestion = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await getCurrentLogicalQuestionService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

/* =========================
   POST /api/logical-reasoning/:attemptId/answer
========================= */
export const submitLogicalAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { selectedIndex } = req.body;

  const result = await submitLogicalAnswerService({
    userId: req.user._id,
    attemptId,
    selectedIndex,
  });

  res.status(200).json(result);
});

/* =========================
   GET /api/logical-reasoning/:attemptId/result
========================= */
export const getLogicalResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await getLogicalResultService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

/* =========================
   GET /api/logical-reasoning/history
========================= */
export const getLogicalHistory = asyncHandler(async (req, res) => {
  const result = await getLogicalHistoryService({
    userId: req.user._id,
  });

  res.status(200).json(result);
});

/* =========================
   GET /api/logical-reasoning/:attemptId/review
========================= */
export const getLogicalReview = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await getLogicalReviewService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

/* =========================
   DELETE /api/logical-reasoning/:attemptId
========================= */
export const deleteLogicalAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const result = await deleteLogicalAttemptService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(result);
});

export default {
  getCurrentLogicalQuestion,
  submitLogicalAnswer,
  getLogicalResult,
  getLogicalHistory,
  getLogicalReview,
  deleteLogicalAttempt,
};
