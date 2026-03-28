// src/modules/practices/aptitude/services/aptitudeAttempt.service.js

import AptitudeAttempt from "../models/AptitudeAttempt.js";
import { ATTEMPT_STATES } from "../../../common/constants/attemptStates.js";
import { expireDraftAttempts } from "../../../common/utils/attemptCleanup.util.js";

const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/* =====================================================
   GET CURRENT QUESTION
   GET /api/aptitude/:attemptId/current
===================================================== */
export const getCurrentAptitudeQuestionService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  // ✅ cleanup abandoned drafts (best-effort, no cron required)
  await expireDraftAttempts({ Model: AptitudeAttempt, userId });

  const attempt = await AptitudeAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Aptitude attempt not found", 404);
  }

  // ✅ block cancelled/expired
  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Practice attempt not available", 400);
  }

  if (attempt.completed || attempt.state === ATTEMPT_STATES.COMPLETED) {
    throwError("Practice already completed. Review is available.", 400);
  }

  if (attempt.currentIndex >= attempt.totalQuestions) {
    throwError("No more questions", 400);
  }

  const q = attempt.questions[attempt.currentIndex];

  return {
    index: attempt.currentIndex,
    total: attempt.totalQuestions,
    question: q.question,
    options: q.options,
  };
};

/* =====================================================
   SUBMIT ANSWER
   POST /api/aptitude/:attemptId/answer
===================================================== */
export const submitAptitudeAnswerService = async ({
  userId,
  attemptId,
  selectedIndex,
}) => {
  if (!userId) throwError("Not authorized", 401);

  if (
    typeof selectedIndex !== "number" ||
    selectedIndex < 0 ||
    selectedIndex > 3
  ) {
    throwError("Invalid option selected", 400);
  }

  const attempt = await AptitudeAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Aptitude attempt not found", 404);
  }

  // ✅ block cancelled/expired
  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Practice attempt not available", 400);
  }

  if (attempt.completed || attempt.state === ATTEMPT_STATES.COMPLETED) {
    throwError("Practice already completed", 400);
  }

  const question = attempt.questions[attempt.currentIndex];
  if (!question) {
    throwError("Invalid practice state", 400);
  }

  // ✅ DRAFT → ACTIVE on first answer
  if (attempt.state === ATTEMPT_STATES.DRAFT) {
    attempt.state = ATTEMPT_STATES.ACTIVE;
    attempt.startedAt = new Date();
  }

  const isCorrect = selectedIndex === question.correctIndex;

  attempt.answers.push({
    selectedIndex,
    isCorrect,
  });

  if (isCorrect) {
    attempt.score += 1;
  }

  attempt.currentIndex += 1;

  if (attempt.currentIndex >= attempt.totalQuestions) {
    attempt.completed = true;
    attempt.state = ATTEMPT_STATES.COMPLETED;
    attempt.completedAt = new Date();
  }

  await attempt.save();

  return {
    correct: isCorrect,
    completed: attempt.completed,
    nextIndex: attempt.currentIndex,
  };
};

/* =====================================================
   PRACTICE RESULT (SUMMARY)
   GET /api/aptitude/:attemptId/result
===================================================== */
export const getAptitudeResultService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await AptitudeAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  }).select("-questions.correctIndex -questions.explanation");

  if (!attempt) {
    throwError("Aptitude attempt not found", 404);
  }

  if (!attempt.completed && attempt.state !== ATTEMPT_STATES.COMPLETED) {
    throwError("Practice not completed yet", 400);
  }

  return {
    practiceName: attempt.practiceName,
    difficulty: attempt.difficulty,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    completedAt: attempt.completedAt,
  };
};

/* =====================================================
   PRACTICE HISTORY
   GET /api/aptitude/history
===================================================== */
export const getAptitudeHistoryService = async ({ userId }) => {
  if (!userId) throwError("Not authorized", 401);

  // ✅ cleanup drafts before returning history
  await expireDraftAttempts({ Model: AptitudeAttempt, userId });

  const practices = await AptitudeAttempt.find({
    user: userId,
    completed: true,
    deletedAt: null,
    state: ATTEMPT_STATES.COMPLETED,
  })
    .sort({ completedAt: -1 })
    .select("practiceName difficulty score totalQuestions completedAt");

  return practices;
};

/* =====================================================
   ANSWER REVIEW (POST COMPLETION ONLY)
   GET /api/aptitude/:attemptId/review
===================================================== */
export const getAptitudeReviewService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await AptitudeAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Aptitude attempt not found", 404);
  }

  if (!attempt.completed && attempt.state !== ATTEMPT_STATES.COMPLETED) {
    throwError("Review available only after practice completion", 400);
  }

  const questions = attempt.questions.map((q, index) => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    selectedIndex: attempt.answers[index]?.selectedIndex ?? null,
    isCorrect: attempt.answers[index]?.isCorrect ?? false,
  }));

  return {
    practiceName: attempt.practiceName,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    questions,
  };
};

/* =====================================================
   DELETE PRACTICE ATTEMPT (SOFT DELETE)
   DELETE /api/aptitude/:attemptId
===================================================== */
export const deleteAptitudeAttemptService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await AptitudeAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Aptitude attempt not found", 404);
  }

  attempt.deletedAt = new Date();
  await attempt.save();

  return {
    message: "Aptitude practice deleted successfully",
  };
};

export default {
  getCurrentAptitudeQuestionService,
  submitAptitudeAnswerService,
  getAptitudeResultService,
  getAptitudeHistoryService,
  getAptitudeReviewService,
  deleteAptitudeAttemptService,
};
