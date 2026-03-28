// src/modules/common/utils/questionHash.util.js

import crypto from "crypto";

/**
 * Question Hash Utilities
 * -----------------------
 * Used for enforcing: "No repeated questions ever"
 *
 * Strategy:
 * - Normalize text (lowercase, trim, collapse whitespace)
 * - Hash via SHA-256
 * - Store only hash to avoid DB bloat & privacy concerns
 */

/**
 * Normalize question text into a canonical form
 * @param {string} text
 */
export const normalizeQuestionText = (text) => {
  if (typeof text !== "string") return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');
};

/**
 * Create deterministic hash for question
 * @param {string} question
 * @returns {string} sha256 hex
 */
export const hashQuestion = (question) => {
  const normalized = normalizeQuestionText(question);

  return crypto.createHash("sha256").update(normalized).digest("hex");
};

/**
 * Hash a question object safely
 * @param {{question?:string, options?:string[]}} q
 */
export const hashQuestionObject = (q = {}) => {
  const text = normalizeQuestionText(q?.question || "");
  const options = Array.isArray(q?.options)
    ? q.options.map((o) => normalizeQuestionText(String(o))).join("|")
    : "";

  return crypto
    .createHash("sha256")
    .update(`${text}::${options}`)
    .digest("hex");
};

export default {
  normalizeQuestionText,
  hashQuestion,
  hashQuestionObject,
};
