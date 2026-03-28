// src/modules/quiz/services/quizAttempt.service.js

import QuizAttempt from "../models/QuizAttempt.js";
import { ATTEMPT_STATES } from "../../common/constants/attemptStates.js";
import { expireDraftAttempts } from "../../common/utils/attemptCleanup.util.js";

const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/* =====================================================
   GET CURRENT QUIZ QUESTION
   GET /api/quiz/:attemptId/current
===================================================== */
export const getCurrentQuizQuestionService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  // ✅ Cleanup abandoned drafts (best-effort)
  await expireDraftAttempts({ Model: QuizAttempt, userId });

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Quiz attempt not found", 404);
  }

  // ✅ Block unusable attempts
  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Quiz attempt not available", 400);
  }

  if (attempt.completed || attempt.state === ATTEMPT_STATES.COMPLETED) {
    throwError("Quiz already completed. Review is available.", 400);
  }

  if (attempt.currentIndex >= attempt.totalQuestions) {
    throwError("No more questions", 400);
  }

  const q = attempt.questions?.[attempt.currentIndex];
  if (!q) throwError("Invalid quiz state", 400);

  return {
    index: attempt.currentIndex,
    total: attempt.totalQuestions,
    question: q.question,
    options: q.options,
  };
};

/* =====================================================
   SUBMIT QUIZ ANSWER
   POST /api/quiz/:attemptId/answer
===================================================== */
export const submitQuizAnswerService = async ({
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

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Quiz attempt not found", 404);
  }

  // ✅ Block unusable attempts
  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Quiz attempt not available", 400);
  }

  if (attempt.completed || attempt.state === ATTEMPT_STATES.COMPLETED) {
    throwError("Quiz already completed", 400);
  }

  const question = attempt.questions?.[attempt.currentIndex];
  if (!question) {
    throwError("Invalid quiz state", 400);
  }

  // ✅ DRAFT → ACTIVE transition on first answer
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

  // ✅ Completion
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
   QUIZ RESULT (SUMMARY)
   GET /api/quiz/:attemptId/result
===================================================== */
export const getQuizResultService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  }).select("-questions.correctIndex -questions.explanation");

  if (!attempt) {
    throwError("Quiz attempt not found", 404);
  }

  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Quiz attempt not available", 400);
  }

  if (!attempt.completed && attempt.state !== ATTEMPT_STATES.COMPLETED) {
    throwError("Quiz not completed yet", 400);
  }

  return {
    topic: attempt.topic,
    difficulty: attempt.difficulty,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    completedAt: attempt.completedAt,
    linkedTodo: attempt.linkedTodo,
    linkedNote: attempt.linkedNote,
  };
};

/* =====================================================
   QUIZ HISTORY
   GET /api/quiz/history
===================================================== */
export const getQuizHistoryService = async ({ userId }) => {
  if (!userId) throwError("Not authorized", 401);

  // ✅ Cleanup drafts first
  await expireDraftAttempts({ Model: QuizAttempt, userId });

  const quizzes = await QuizAttempt.find({
    user: userId,
    completed: true,
    deletedAt: null,
    state: ATTEMPT_STATES.COMPLETED,
  })
    .sort({ completedAt: -1 })
    .select("topic difficulty score totalQuestions completedAt linkedTodo linkedNote");

  return quizzes;
};

/* =====================================================
   ANSWER REVIEW (POST QUIZ ONLY)
   GET /api/quiz/:attemptId/review
===================================================== */
export const getQuizReviewService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Quiz attempt not found", 404);
  }

  if (
    attempt.state === ATTEMPT_STATES.CANCELLED ||
    attempt.state === ATTEMPT_STATES.EXPIRED
  ) {
    throwError("Quiz attempt not available", 400);
  }

  if (!attempt.completed && attempt.state !== ATTEMPT_STATES.COMPLETED) {
    throwError("Review available only after quiz completion", 400);
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
    topic: attempt.topic,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    questions,
  };
};

/* =====================================================
   DELETE QUIZ ATTEMPT (SOFT DELETE)
   DELETE /api/quiz/:attemptId
===================================================== */
export const deleteQuizAttemptService = async ({ userId, attemptId }) => {
  if (!userId) throwError("Not authorized", 401);

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
    deletedAt: null,
  });

  if (!attempt) {
    throwError("Quiz attempt not found", 404);
  }

  attempt.deletedAt = new Date();
  await attempt.save();

  return { message: "Quiz attempt deleted successfully" };
};

export default {
  getCurrentQuizQuestionService,
  submitQuizAnswerService,
  getQuizResultService,
  getQuizHistoryService,
  getQuizReviewService,
  deleteQuizAttemptService,
};
