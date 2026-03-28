// src/modules/practices/aptitude/services/aptitude.service.js

import getGroqClient from "../../../../utils/groqClient.js";

import AptitudeAttempt from "../models/AptitudeAttempt.js";
import { getAptitudePrompt } from "../constants/aptitude.prompts.js";

import { ATTEMPT_STATES } from "../../../common/constants/attemptStates.js";
import { expireDraftAttempts } from "../../../common/utils/attemptCleanup.util.js";

import { generateUniqueAIQuestions } from "../../../common/services/aiQuestionGenerator.service.js";
import { AI_MODELS } from "../../../common/constants/ai.prompts.js";

/* =====================================================
   HELPERS
===================================================== */
const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/* =====================================================
   GENERATE APTITUDE PRACTICE
   POST /api/aptitude/generate

   Responsibilities (STRICT):
   - Validation
   - AI generation (via centralized generator)
   - Draft attempt creation
===================================================== */
export const generateAptitudePracticeService = async ({
  userId,
  difficulty,
  count,
}) => {
  if (!userId) throwError("Not authorized", 401);

  /* ---------- VALIDATION (preserve existing rules/messages) ---------- */
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    throwError("Invalid difficulty level", 400);
  }

  if (![5, 10, 15, 20].includes(count)) {
    throwError("Question count must be one of 5, 10, 15, or 20", 400);
  }

  /* ---------- CLEANUP ABANDONED DRAFTS ---------- */
  await expireDraftAttempts({ Model: AptitudeAttempt, userId });

  const groq = getGroqClient();

  /* ---------- AUTO PRACTICE NAME ---------- */
  const practiceCount = await AptitudeAttempt.countDocuments({
    user: userId,
  });

  const practiceName = `Practice ${practiceCount + 1}`;

  /* ---------- AI PROMPT ---------- */
  const prompt = getAptitudePrompt({ count, difficulty });

  const callAI = async () => {
    const completion = await groq.chat.completions.create({
      model: AI_MODELS.DEFAULT,
      temperature: 0.8,
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
      )
        return { ok: false, error: "SCHEMA_INVALID" };
      if (!q.explanation || typeof q.explanation !== "string")
        return { ok: false, error: "SCHEMA_INVALID" };
    }

    return { ok: true };
  };

  /* ---------- AI GENERATION (CENTRALIZED, SAFE) ---------- */
  const questions = await generateUniqueAIQuestions({
    userId,
    module: "aptitude",
    difficulty,
    count,
    callAI,
    validate: validateQuestions,
    maxRetries: 4,
  });

  /* ---------- CREATE ATTEMPT (DRAFT ONLY) ---------- */
  const attempt = await AptitudeAttempt.create({
    user: userId,
    practiceName,
    difficulty,
    totalQuestions: count,
    questions,

    state: ATTEMPT_STATES.DRAFT,
    completed: false,
    completedAt: null,
    startedAt: null,
    cancelledAt: null,
    expiredAt: null,
  });

  return {
    attemptId: attempt._id,
    practiceName: attempt.practiceName,
    totalQuestions: attempt.totalQuestions,
    difficulty: attempt.difficulty,
  };
};

export default {
  generateAptitudePracticeService,
};
