// src/modules/practices/verbalReasoning/constants/verbalReasoning.prompts.js

import { buildVerbalReasoningPrompt } from "../../../common/constants/ai.prompts.js";

/**
 * Verbal Reasoning practice prompt wrapper
 * - Uses CENTRAL AI PROMPTS as the single source of truth
 * - Keeps this module thin and isolated
 * - No prompt duplication, no hardcoding
 */

export const getVerbalReasoningPrompt = ({ count, difficulty }) => {
  return buildVerbalReasoningPrompt({ count, difficulty });
};

export default {
  getVerbalReasoningPrompt,
};
