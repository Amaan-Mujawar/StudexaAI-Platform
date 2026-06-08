// src/modules/common/constants/attemptStates.js

/**
 * Attempt Lifecycle States (Shared)
 * ---------------------------------
 * Used by:
 * - QuizAttempt
 * - LogicalReasoningAttempt
 * - AptitudeAttempt
 * - VerbalReasoningAttempt
 *
 * Goals:
 * - Prevent "dirty history" from instant exits
 * - Enable cleanup / expiry of abandoned attempts
 * - Keep implementation consistent across modules
 *
 * NOTE:
 * We keep states as string enums for MongoDB readability + query convenience.
 */

export const ATTEMPT_STATES = Object.freeze({
  DRAFT: "DRAFT", // generated but not started yet (no answers)
  ACTIVE: "ACTIVE", // started (at least one answer)
  COMPLETED: "COMPLETED", // finished
  CANCELLED: "CANCELLED", // explicitly ended / abandoned
  EXPIRED: "EXPIRED", // auto-expired by cleanup
});

export const ATTEMPT_STATE_VALUES = Object.freeze(
  Object.values(ATTEMPT_STATES)
);

/**
 * Default draft expiry
 * - DRAFT attempts older than this should be EXPIRED
 * - Can be tuned in env later if needed
 */
export const DEFAULT_DRAFT_EXPIRY_MINUTES = 15;
