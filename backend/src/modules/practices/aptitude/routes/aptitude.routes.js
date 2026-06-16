// src/modules/practices/aptitude/routes/aptitude.routes.js

import express from "express";
import protect from "../../../../middleware/auth.middleware.js";
import {
  generateAptitudePractice,
} from "../controllers/aptitude.controller.js";

import {
  getCurrentAptitudeQuestion,
  submitAptitudeAnswer,
  getAptitudeResult,
  getAptitudeHistory,
  getAptitudeReview,
  deleteAptitudeAttempt,
} from "../controllers/aptitudeAttempt.controller.js";

const router = express.Router();

/* =====================================================
   APTITUDE ROUTES (PROTECTED)
   Base mounted at: /api/aptitude
   Contract MUST remain unchanged
===================================================== */

router.use(protect);

/*
  Generate Aptitude Practice
  POST /api/aptitude/generate
*/
router.post("/generate", generateAptitudePractice);

/*
  Practice History (completed only)
  GET /api/aptitude/history
*/
router.get("/history", getAptitudeHistory);

/*
  Get Current Question
  GET /api/aptitude/:attemptId/current
*/
router.get("/:attemptId/current", getCurrentAptitudeQuestion);

/*
  Submit Answer
  POST /api/aptitude/:attemptId/answer
*/
router.post("/:attemptId/answer", submitAptitudeAnswer);

/*
  Practice Result (summary)
  GET /api/aptitude/:attemptId/result
*/
router.get("/:attemptId/result", getAptitudeResult);

/*
  Practice Review (post completion only)
  GET /api/aptitude/:attemptId/review
*/
router.get("/:attemptId/review", getAptitudeReview);

/*
  Delete Practice Attempt (soft delete)
  DELETE /api/aptitude/:attemptId
*/
router.delete("/:attemptId", deleteAptitudeAttempt);

export default router;
