// src/modules/quiz/utils/quiz.integration.utils.js
import Todo from "../../todos/models/Todo.js";
import AiNote from "../../ai/models/AiNote.js";

/**
 * Quiz Integration Utils (SAFE, NON-BREAKING)
 *
 * Goal:
 * - Preserve existing behavior from old controllers/quiz.controller.js
 * - Centralize cross-feature linking here to avoid scattering logic
 *
 * Important:
 * - This file MUST remain "integration-only"
 * - It should NOT contain quiz generation logic
 * - It should NOT validate payloads
 */

/**
 * Back-link created QuizAttempt to Todo/AiNote
 * - Todo.linkedQuiz = attemptId
 * - AiNote.linkedQuiz = attemptId
 *
 * Mirrors original behavior:
 *  if (todoId) await Todo.updateOne(... { linkedQuiz: attempt._id })
 *  if (noteId) await AiNote.updateOne(... { linkedQuiz: attempt._id })
 */
export const linkQuizAttemptToEntities = async ({
  userId,
  attemptId,
  todoId = null,
  noteId = null,
}) => {
  if (!userId || !attemptId) return;

  const ops = [];

  if (todoId) {
    ops.push(
      Todo.updateOne(
        { _id: todoId, user: userId },
        { $set: { linkedQuiz: attemptId } }
      )
    );
  }

  if (noteId) {
    ops.push(
      AiNote.updateOne(
        { _id: noteId, user: userId },
        { $set: { linkedQuiz: attemptId } }
      )
    );
  }

  if (ops.length) {
    await Promise.all(ops);
  }
};

export default {
  linkQuizAttemptToEntities,
};
