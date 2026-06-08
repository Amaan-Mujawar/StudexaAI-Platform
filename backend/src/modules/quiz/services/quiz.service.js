// src/modules/quiz/services/quiz.service.js
import getGroqClient from "../../../utils/groqClient.js";

import QuizAttempt from "../models/QuizAttempt.js";

import { getQuizPrompt } from "../constants/quiz.prompts.js";
import { linkQuizAttemptToEntities } from "../utils/quiz.integration.utils.js";

import { ATTEMPT_STATES } from "../../common/constants/attemptStates.js";
import { expireDraftAttempts } from "../../common/utils/attemptCleanup.util.js";

import { generateUniqueAIQuestions } from "../../common/services/aiQuestionGenerator.service.js";
import { AI_MODELS } from "../../common/constants/ai.prompts.js";

/* =====================================================
   HELPERS
===================================================== */
const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/* =====================================================
   GENERATE QUIZ (GENERATION ONLY)
   POST /api/quiz/generate

   Responsibilities (STRICT):
   - Validation
   - Draft cleanup
   - AI generation (central generator with uniqueness retry)
   - Attempt creation (DRAFT)
   - Optional linking: Todo / AiNote
===================================================== */
export const generateQuizService = async ({
  userId,
  topic,
  difficulty = "medium",
  count = 10,
  todoId = null,
  noteId = null,
}) => {
  if (!userId) throwError("Not authorized", 401);

  /* ---------- VALIDATION (preserve old contract) ---------- */
  if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
    throwError("Invalid quiz topic", 400);
  }

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    throwError("Invalid difficulty level", 400);
  }

  if (![5, 10, 15, 20].includes(count)) {
    throwError("Question count must be one of 5, 10, 15, or 20", 400);
  }

  /* ---------- CLEANUP ABANDONED DRAFTS ---------- */
  await expireDraftAttempts({ Model: QuizAttempt, userId });

  const groq = getGroqClient();

  /* ---------- AUTO QUIZ NAME ---------- */
  const quizCount = await QuizAttempt.countDocuments({
    user: userId,
    deletedAt: null,
  });

  const quizName = `Quiz ${quizCount + 1}`;

  /* ---------- AI PROMPT ---------- */
  const prompt = getQuizPrompt({
    topic: topic.trim(),
    difficulty,
    count,
  });

  const callAI = async () => {
    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    return completion?.choices?.[0]?.message?.content || "";
  };

  const validateQuestions = (parsed) => {
    if (!Array.isArray(parsed)) return { ok: false, error: "SCHEMA_INVALID" };
    if (parsed.length !== count) return { ok: false, error: "SCHEMA_INVALID" };

    for (const q of parsed) {
      if (!q || typeof q !== "object")
        return { ok: false, error: "SCHEMA_INVALID" };
      if (!q.question || typeof q.question !== "string")
        return { ok: false, error: "SCHEMA_INVALID" };
      if (!Array.isArray(q.options) || q.options.length !== 4)
        return { ok: false, error: "SCHEMA_INVALID" };

      if (
        typeof q.correctIndex !== "number" ||
        q.correctIndex < 0 ||
        q.correctIndex > 3
      ) {
        return { ok: false, error: "SCHEMA_INVALID" };
      }

      if (!q.explanation || typeof q.explanation !== "string") {
        return { ok: false, error: "SCHEMA_INVALID" };
      }
    }

    return { ok: true };
  };

  /* ---------- AI GENERATION (CENTRALIZED, SAFE) ---------- */
  const questions = await generateUniqueAIQuestions({
    userId,
    module: "quiz",
    difficulty,
    count,
    callAI,
    validate: validateQuestions,
    maxRetries: 4,
  });

  /* ---------- CREATE QUIZ ATTEMPT (DRAFT ONLY) ---------- */
  const quizAttempt = await QuizAttempt.create({
    user: userId,
    quizName,
    topic: topic.trim(),
    difficulty,
    totalQuestions: count,
    questions,

    state: ATTEMPT_STATES.DRAFT,
    currentIndex: 0,
    answers: [],
    score: 0,

    completed: false,
    completedAt: null,
    startedAt: null,
    cancelledAt: null,
    expiredAt: null,

    deletedAt: null,
    linkedTodo: todoId || null,
    linkedNote: noteId || null,
  });

  /* ---------- OPTIONAL ENTITY LINKING ---------- */
  await linkQuizAttemptToEntities({
    userId,
    attemptId: quizAttempt._id,
    todoId,
    noteId,
  });

  return quizAttempt;
};

export default {
  generateQuizService,
};
