// src/modules/practices/logicalReasoning/constants/logicalReasoning.prompts.js

import { buildLogicalReasoningPrompt } from "../../../common/constants/ai.prompts.js";

/**
 * Logical Reasoning practice prompts
 * Kept as a thin wrapper so each module stays isolated,
 * while still leveraging the central prompt builder safely.
 */

export const getLogicalReasoningPrompt = ({ count, difficulty }) => {
  return buildLogicalReasoningPrompt({ count, difficulty });
};

export default {
  getLogicalReasoningPrompt,
};
