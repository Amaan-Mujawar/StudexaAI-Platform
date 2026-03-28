// src/modules/ai/utils/ai.integration.utils.js
import QuizAttempt from "../../quiz/models/QuizAttempt.js";

/**
 * Unlink QuizAttempts linked to an AI Note
 * Used when an AI note is deleted.
 *
 * IMPORTANT:
 * - preserves existing behavior from old controllers/ai.controller.js
 * - does NOT delete quiz attempts, only unlinks linkedNote
 */
export const unlinkQuizAttemptsFromNote = async ({ noteId }) => {
  if (!noteId) return;

  await QuizAttempt.updateMany(
    { linkedNote: noteId },
    { $set: { linkedNote: null } }
  );
};

export default {
  unlinkQuizAttemptsFromNote,
};
