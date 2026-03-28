// src/modules/practices/aptitude/constants/aptitude.prompts.js

import { buildAptitudePrompt } from "../../../common/constants/ai.prompts.js";

/**
 * Aptitude practice prompt wrapper
 * - Delegates to central AI prompt builder
 * - Keeps module isolation without duplicating prompt logic
 */

export const getAptitudePrompt = ({ count, difficulty }) => {
  return buildAptitudePrompt({ count, difficulty });
};

export default {
  getAptitudePrompt,
};
