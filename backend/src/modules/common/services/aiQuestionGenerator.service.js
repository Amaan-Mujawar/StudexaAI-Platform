// src/modules/common/services/aiQuestionGenerator.service.js

import shuffleQuiz from "../../../utils/shuffleQuiz.js";
import { aiRetryGuard } from "../utils/aiRetry.util.js";
import {
  splitUniqueVsDuplicateQuestions,
  persistQuestionFingerprints,
} from "./questionUniqueness.service.js";

/**
 * Central AI Question Generator
 * -----------------------------
 * Industry-grade unified generator used by:
 * - Quiz
 * - Logical Reasoning
 * - Aptitude
 * - Verbal Reasoning
 *
 * Responsibilities:
 * - AI call
 * - JSON + schema validation
 * - Duplicate detection against persistent memory
 * - Retry on duplicates (NOT user-facing failure)
 * - Persist fingerprints only after final success
 *
 * This guarantees:
 * ✅ No repeated questions ever
 * ✅ No user-facing failures due to duplicates
 * ✅ Bounded retries
 */

const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

/**
 * Generate unique AI questions with retries
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.module
 * @param {string} params.difficulty
 * @param {number} params.count
 * @param {() => Promise<string>} params.callAI
 * @param {(parsed:any)=>{ok:boolean,error?:string}} params.validate
 * @param {number} [params.maxRetries]
 *
 * @returns {Promise<Array>}
 */
export const generateUniqueAIQuestions = async ({
  userId,
  module,
  difficulty,
  count,
  callAI,
  validate,
  maxRetries = 4,
}) => {
  if (!userId) throwError("Not authorized", 401);
  if (!module) throwError("Invalid module", 400);
  if (!count || typeof count !== "number") throwError("Invalid question count", 400);

  let finalQuestions = null;

  await aiRetryGuard({
    maxRetries,
    callAI,
    validate,
    afterSuccess: async (parsed) => {
      // shuffle before uniqueness check (options + order)
      const shuffled = shuffleQuiz(parsed);

      const { unique, duplicates } =
        await splitUniqueVsDuplicateQuestions({
          userId,
          module,
          difficulty,
          questions: shuffled,
        });

      // If duplicates exist, force retry (do NOT persist)
      if (duplicates.length > 0 || unique.length !== count) {
        throwError("DUPLICATE_QUESTIONS", 500);
      }

      // Persist fingerprints ONLY after full success
      await persistQuestionFingerprints({
        userId,
        module,
        difficulty,
        questions: shuffled,
      });

      finalQuestions = shuffled;
    },
  });

  if (!finalQuestions || finalQuestions.length !== count) {
    throwError("AI question generation failed. Please try again.", 500);
  }

  return finalQuestions;
};

export default {
  generateUniqueAIQuestions,
};
