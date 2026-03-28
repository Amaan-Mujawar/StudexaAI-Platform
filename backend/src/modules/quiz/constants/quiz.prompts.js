// src/modules/quiz/constants/quiz.prompts.js
import { buildQuizPrompt } from "../../common/constants/ai.prompts.js";

/**
 * Quiz Prompts
 * - Single source of truth for quiz prompt generation
 * - Delegates to central ai.prompts.js builder to avoid duplication
 *
 * IMPORTANT:
 * - keep pure prompt/constants only
 * - no Groq calls, no DB logic, no validation
 */

export const getQuizPrompt = ({ topic, count, difficulty }) => {
  return buildQuizPrompt({ topic, count, difficulty });
};

export default {
  getQuizPrompt,
};
