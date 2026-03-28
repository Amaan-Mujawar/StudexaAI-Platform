// src/modules/todos/utils/todo.integration.utils.js
import AiNote from "../../ai/models/AiNote.js";
import QuizAttempt from "../../quiz/models/QuizAttempt.js";

/**
 * Todo Integration Utilities
 * - Only for unlinking/linking behavior across features
 * - Keeps controllers/services clean
 * - Must preserve existing behavior exactly
 */

/* =====================================================
   UNLINK TODO -> (AiNotes + QuizAttempts)
   Used when deleting a Todo
===================================================== */
export const unlinkTodoRelations = async ({ userId, todoId }) => {
  if (!userId || !todoId) return;

  // Unlink AI Notes
  await AiNote.updateMany(
    { user: userId, linkedTodo: todoId },
    { $set: { linkedTodo: null } }
  );

  // Unlink Quiz Attempts
  await QuizAttempt.updateMany(
    { user: userId, linkedTodo: todoId },
    { $set: { linkedTodo: null } }
  );
};
