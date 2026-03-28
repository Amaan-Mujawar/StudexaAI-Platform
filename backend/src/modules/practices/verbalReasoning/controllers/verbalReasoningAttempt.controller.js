// src/modules/practices/verbalReasoning/controllers/verbalReasoningAttempt.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";

import {
  getCurrentVerbalReasoningQuestionService,
  submitVerbalReasoningAnswerService,
  getVerbalReasoningResultService,
  getVerbalReasoningHistoryService,
  getVerbalReasoningReviewService,
  deleteVerbalReasoningAttemptService,
} from "../services/verbalReasoningAttempt.service.js";

/* =====================================================
   VERBAL REASONING ATTEMPT CONTROLLER
   Keeps /api/verbal-reasoning contract unchanged
===================================================== */

/*
  GET /api/verbal-reasoning/:attemptId/current
*/
export const getCurrentVerbalReasoningQuestion = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getCurrentVerbalReasoningQuestionService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/*
  POST /api/verbal-reasoning/:attemptId/answer
*/
export const submitVerbalReasoningAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { selectedIndex } = req.body;

  const payload = await submitVerbalReasoningAnswerService({
    userId: req.user._id,
    attemptId,
    selectedIndex,
  });

  res.status(200).json(payload);
});

/*
  GET /api/verbal-reasoning/:attemptId/result
*/
export const getVerbalReasoningResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getVerbalReasoningResultService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/*
  GET /api/verbal-reasoning/history
*/
export const getVerbalReasoningHistory = asyncHandler(async (req, res) => {
  const payload = await getVerbalReasoningHistoryService({
    userId: req.user._id,
  });

  res.status(200).json(payload);
});

/*
  GET /api/verbal-reasoning/:attemptId/review
*/
export const getVerbalReasoningReview = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getVerbalReasoningReviewService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/*
  DELETE /api/verbal-reasoning/:attemptId
*/
export const deleteVerbalReasoningAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await deleteVerbalReasoningAttemptService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

export default {
  getCurrentVerbalReasoningQuestion,
  submitVerbalReasoningAnswer,
  getVerbalReasoningResult,
  getVerbalReasoningHistory,
  getVerbalReasoningReview,
  deleteVerbalReasoningAttempt,
};
