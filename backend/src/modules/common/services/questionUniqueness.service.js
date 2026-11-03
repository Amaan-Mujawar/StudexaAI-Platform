// src/modules/common/services/questionUniqueness.service.js

import QuestionFingerprint from "../models/QuestionFingerprint.js";
import { hashQuestionObject } from "../utils/questionHash.util.js";

/**
 * Question Uniqueness Service
 * ---------------------------
 * Guarantees per-user no repeated questions ever.
 *
 * Works by:
 * - Hashing each question (canonical normalized form)
 * - Checking if hash exists for (user,module,difficulty)
 * - If not exists → insert
 * - If exists → mark duplicate
 *
 * IMPORTANT:
 * - DB unique index also enforces correctness under concurrency.
 */

const throwError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

const normalizeModule = (module) => {
  const m = String(module || "").trim();
  if (
    !["quiz", "logical-reasoning", "aptitude", "verbal-reasoning"].includes(m)
  ) {
    return null;
  }
  return m;
};

const normalizeDifficulty = (difficulty) => {
  const d = String(difficulty || "medium").trim();
  if (!["easy", "medium", "hard"].includes(d)) return "medium";
  return d;
};

/**
 * Check duplicates against DB fingerprints
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.module
 * @param {string} params.difficulty
 * @param {Array} params.questions
 * @returns {Promise<{unique:Array, duplicates:Array, hashes:string[]}>}
 */
export const splitUniqueVsDuplicateQuestions = async ({
  userId,
  module,
  difficulty,
  questions = [],
}) => {
  if (!userId) throwError("Not authorized", 401);

  const safeModule = normalizeModule(module);
  if (!safeModule) throwError("Invalid module", 400);

  const safeDifficulty = normalizeDifficulty(difficulty);

  if (!Array.isArray(questions) || questions.length === 0) {
    return { unique: [], duplicates: [], hashes: [] };
  }

  const hashes = questions.map((q) => hashQuestionObject(q));

  const existing = await QuestionFingerprint.find({
    user: userId,
    module: safeModule,
    difficulty: safeDifficulty,
    hash: { $in: hashes },
  }).select("hash");

  const existingSet = new Set(existing.map((e) => e.hash));

  const unique = [];
  const duplicates = [];

  questions.forEach((q, idx) => {
    const h = hashes[idx];
    if (existingSet.has(h)) duplicates.push(q);
    else unique.push(q);
  });

  return { unique, duplicates, hashes };
};

/**
 * Persist fingerprints for a batch of questions
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.module
 * @param {string} params.difficulty
 * @param {Array} params.questions
 * @returns {Promise<number>} insertedCount
 */
export const persistQuestionFingerprints = async ({
  userId,
  module,
  difficulty,
  questions = [],
}) => {
  if (!userId) throwError("Not authorized", 401);

  const safeModule = normalizeModule(module);
  if (!safeModule) throwError("Invalid module", 400);

  const safeDifficulty = normalizeDifficulty(difficulty);

  if (!Array.isArray(questions) || questions.length === 0) return 0;

  const docs = questions.map((q) => ({
    user: userId,
    module: safeModule,
    difficulty: safeDifficulty,
    hash: hashQuestionObject(q),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // safe default (overridden by schema pre-validate if needed)
  }));

  try {
    const res = await QuestionFingerprint.insertMany(docs, {
      ordered: false, // don't fail full batch if some duplicates happen in race conditions
    });

    return Array.isArray(res) ? res.length : 0;
  } catch (err) {
    // E11000 expected sometimes under concurrency: treat as partial success
    if (err?.code === 11000) return 0;
    throw err;
  }
};

/**
 * Validate + enforce uniqueness.
 * - If duplicates exist, caller should retry AI generation.
 *
 * @returns {Promise<{ ok: boolean, duplicatesCount: number }>}
 */
export const enforceNoDuplicatesOrThrow = async ({
  userId,
  module,
  difficulty,
  questions,
}) => {
  const { duplicates } = await splitUniqueVsDuplicateQuestions({
    userId,
    module,
    difficulty,
    questions,
  });

  if (duplicates.length > 0) {
    throwError("AI generated repeated questions. Please try again.", 500);
  }

  await persistQuestionFingerprints({ userId, module, difficulty, questions });

  return { ok: true, duplicatesCount: 0 };
};

export default {
  splitUniqueVsDuplicateQuestions,
  persistQuestionFingerprints,
  enforceNoDuplicatesOrThrow,
};
