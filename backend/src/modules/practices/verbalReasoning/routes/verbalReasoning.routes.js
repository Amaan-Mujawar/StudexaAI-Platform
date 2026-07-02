// src/modules/practices/verbalReasoning/routes/verbalReasoning.routes.js

import express from "express";
import protect from "../../../../middleware/auth.middleware.js";

import { generateVerbalReasoningPractice } from "../controllers/verbalReasoning.controller.js";

import {
  getCurrentVerbalReasoningQuestion,
  submitVerbalReasoningAnswer,
  getVerbalReasoningResult,
  getVerbalReasoningHistory,
  getVerbalReasoningReview,
  deleteVerbalReasoningAttempt,
} from "../controllers/verbalReasoningAttempt.controller.js";

const router = express.Router();

/* =====================================================
   VERBAL REASONING ROUTES (PROTECTED)
   Base mount: /api/verbal-reasoning

   ✅ FIXED BUG:
   rateLimitAI was being applied twice:
   - here in routes
   - and inside controller middleware array

   Now rateLimitAI is applied ONLY inside controller.
===================================================== */

/*
  Generate Verbal Reasoning Practice
  POST /api/verbal-reasoning/generate
*/
router.post("/generate", protect, generateVerbalReasoningPractice);

/*
  Practice History (completed only)
  GET /api/verbal-reasoning/history
*/
router.get("/history", protect, getVerbalReasoningHistory);

/*
  Get Current Question
  GET /api/verbal-reasoning/:attemptId/current
*/
router.get("/:attemptId/current", protect, getCurrentVerbalReasoningQuestion);

/*
  Submit Answer
  POST /api/verbal-reasoning/:attemptId/answer
*/
router.post("/:attemptId/answer", protect, submitVerbalReasoningAnswer);

/*
  Practice Result (summary)
  GET /api/verbal-reasoning/:attemptId/result
*/
router.get("/:attemptId/result", protect, getVerbalReasoningResult);

/*
  Practice Review (post completion only)
  GET /api/verbal-reasoning/:attemptId/review
*/
router.get("/:attemptId/review", protect, getVerbalReasoningReview);

/*
  Delete Practice Attempt (soft delete)
  DELETE /api/verbal-reasoning/:attemptId
*/
router.delete("/:attemptId", protect, deleteVerbalReasoningAttempt);

export default router;
