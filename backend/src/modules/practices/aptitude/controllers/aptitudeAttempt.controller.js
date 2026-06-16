// src/modules/practices/aptitude/controllers/aptitudeAttempt.controller.js

import asyncHandler from "../../../../utils/asyncHandler.js";

import {
  getCurrentAptitudeQuestionService,
  submitAptitudeAnswerService,
  getAptitudeResultService,
  getAptitudeHistoryService,
  getAptitudeReviewService,
  deleteAptitudeAttemptService,
} from "../services/aptitudeAttempt.service.js";

/* =====================================================
   APTITUDE ATTEMPT CONTROLLER
   Keeps /api/aptitude contract unchanged
===================================================== */

/* =========================
   GET /api/aptitude/:attemptId/current
========================= */
export const getCurrentAptitudeQuestion = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getCurrentAptitudeQuestionService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/* =========================
   POST /api/aptitude/:attemptId/answer
========================= */
export const submitAptitudeAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { selectedIndex } = req.body;

  const payload = await submitAptitudeAnswerService({
    userId: req.user._id,
    attemptId,
    selectedIndex,
  });

  res.status(200).json(payload);
});

/* =========================
   GET /api/aptitude/:attemptId/result
========================= */
export const getAptitudeResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getAptitudeResultService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/* =========================
   GET /api/aptitude/history
========================= */
export const getAptitudeHistory = asyncHandler(async (req, res) => {
  const payload = await getAptitudeHistoryService({
    userId: req.user._id,
  });

  res.status(200).json(payload);
});

/* =========================
   GET /api/aptitude/:attemptId/review
========================= */
export const getAptitudeReview = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await getAptitudeReviewService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});

/* =========================
   DELETE /api/aptitude/:attemptId
========================= */
export const deleteAptitudeAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const payload = await deleteAptitudeAttemptService({
    userId: req.user._id,
    attemptId,
  });

  res.status(200).json(payload);
});
