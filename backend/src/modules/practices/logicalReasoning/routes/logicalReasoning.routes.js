// src/modules/practices/logicalReasoning/routes/logicalReasoning.routes.js

import express from "express";
import protect from "../../../../middleware/auth.middleware.js";

import { generateLogicalReasoningPractice } from "../controllers/logicalReasoning.controller.js";

import {
  getCurrentLogicalQuestion,
  submitLogicalAnswer,
  getLogicalResult,
  getLogicalHistory,
  getLogicalReview,
  deleteLogicalAttempt,
} from "../controllers/logicalReasoningAttempt.controller.js";

const router = express.Router();

/* =====================================================
   LOGICAL REASONING ROUTES (PROTECTED)
   Prefix: /api/logical-reasoning
===================================================== */

/*
  Generate Logical Reasoning Practice
  POST /api/logical-reasoning/generate
*/
router.post("/generate", protect, generateLogicalReasoningPractice);

/*
  Practice History (completed only)
  GET /api/logical-reasoning/history
*/
router.get("/history", protect, getLogicalHistory);

/*
  Get Current Question
  GET /api/logical-reasoning/:attemptId/current
*/
router.get("/:attemptId/current", protect, getCurrentLogicalQuestion);

/*
  Submit Answer
  POST /api/logical-reasoning/:attemptId/answer
*/
router.post("/:attemptId/answer", protect, submitLogicalAnswer);

/*
  Practice Result (summary)
  GET /api/logical-reasoning/:attemptId/result
*/
router.get("/:attemptId/result", protect, getLogicalResult);

/*
  Practice Review (post completion only)
  GET /api/logical-reasoning/:attemptId/review
*/
router.get("/:attemptId/review", protect, getLogicalReview);

/*
  Delete Practice Attempt (soft delete)
  DELETE /api/logical-reasoning/:attemptId
*/
router.delete("/:attemptId", protect, deleteLogicalAttempt);

export default router;
