// src/modules/common/utils/attemptCleanup.util.js

import { ATTEMPT_STATES, DEFAULT_DRAFT_EXPIRY_MINUTES } from "../constants/attemptStates.js";

/**
 * Attempt Cleanup Utilities
 * -------------------------
 * Shared helpers for Quiz + Practices.
 *
 * Goals:
 * - Provide safe "draft expiry" logic
 * - Avoid background tasks (no cron) while still allowing cleanup calls:
 *   - during generation
 *   - during history fetch
 *   - during result fetch (optional)
 *
 * IMPORTANT:
 * - This file MUST NOT import feature services/controllers.
 * - It should remain reusable & pure.
 */

/**
 * Returns a Date that represents the cutoff time for draft expiry.
 * @param {number} minutes
 */
export const getDraftExpiryCutoffDate = (minutes = DEFAULT_DRAFT_EXPIRY_MINUTES) => {
  const safeMinutes =
    typeof minutes === "number" && minutes > 0 ? minutes : DEFAULT_DRAFT_EXPIRY_MINUTES;

  return new Date(Date.now() - safeMinutes * 60 * 1000);
};

/**
 * Expires abandoned draft attempts for a given Mongoose model.
 * - Only affects: state=DRAFT and no answers
 * - Does NOT touch completed or active attempts
 *
 * @param {object} params
 * @param {import("mongoose").Model} params.Model
 * @param {import("mongoose").Types.ObjectId|string} params.userId
 * @param {number} [params.expiryMinutes]
 * @returns {Promise<number>} modifiedCount
 */
export const expireDraftAttempts = async ({ Model, userId, expiryMinutes }) => {
  if (!Model || !userId) return 0;

  const cutoff = getDraftExpiryCutoffDate(expiryMinutes);

  const res = await Model.updateMany(
    {
      user: userId,
      deletedAt: null,
      state: ATTEMPT_STATES.DRAFT,
      createdAt: { $lt: cutoff },

      // safety: ensure no progress
      $or: [{ answers: { $exists: false } }, { answers: { $size: 0 } }],
    },
    {
      $set: {
        state: ATTEMPT_STATES.EXPIRED,
        expiredAt: new Date(),
      },
    }
  );

  return res?.modifiedCount || 0;
};

/**
 * Marks a given attempt as CANCELLED.
 * Used when client exits intentionally (optional endpoint later)
 *
 * @param {object} params
 * @param {import("mongoose").Model} params.Model
 * @param {string} params.attemptId
 * @param {string} params.userId
 * @returns {Promise<boolean>}
 */
export const cancelAttempt = async ({ Model, attemptId, userId }) => {
  if (!Model || !attemptId || !userId) return false;

  const res = await Model.updateOne(
    {
      _id: attemptId,
      user: userId,
      deletedAt: null,
      state: { $in: [ATTEMPT_STATES.DRAFT, ATTEMPT_STATES.ACTIVE] },
    },
    {
      $set: {
        state: ATTEMPT_STATES.CANCELLED,
        cancelledAt: new Date(),
      },
    }
  );

  return (res?.modifiedCount || 0) > 0;
};

export default {
  getDraftExpiryCutoffDate,
  expireDraftAttempts,
  cancelAttempt,
};
