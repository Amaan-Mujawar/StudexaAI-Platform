// src/modules/todos/services/todo.service.js
import Todo from "../models/Todo.js";
import autoCompleteOverdueTodos from "../../../utils/autoCompleteOverdueTodos.js";
import { unlinkTodoRelations } from "../utils/todo.integration.utils.js";

/* =====================================================
   GET TODOS
   - Auto-complete overdue todos
   - Backend-authoritative status
===================================================== */
export const getTodosService = async (userId) => {
  await autoCompleteOverdueTodos(userId);

  const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 }).lean();

  const withStatus = todos.map((todo) => ({
    ...todo,
    status: todo.completed ? "completed" : "ongoing",
  }));

  return withStatus;
};

/* =====================================================
   CREATE TODO
===================================================== */
export const createTodoService = async (
  userId,
  { title, priority = "medium", dueAt = null }
) => {
  await autoCompleteOverdueTodos(userId);

  if (!title || title.trim() === "") {
    const err = new Error("Title is required");
    err.statusCode = 400;
    throw err;
  }

  const todo = await Todo.create({
    user: userId,
    title: title.trim(),
    priority,
    dueAt,
  });

  return todo;
};

/* =====================================================
   UPDATE TODO
===================================================== */
export const updateTodoService = async (userId, todoId, updates = {}) => {
  await autoCompleteOverdueTodos(userId);

  const todo = await Todo.findOne({
    _id: todoId,
    user: userId,
  });

  if (!todo) {
    const err = new Error("Todo not found");
    err.statusCode = 404;
    throw err;
  }

  const now = new Date();

  // Completed → Ongoing (guardrail)
  if (todo.completed === true && updates.completed === false) {
    const newDueAt = updates.dueAt;

    if (!newDueAt) {
      const err = new Error(
        "Due date is required when marking task as ongoing"
      );
      err.statusCode = 400;
      throw err;
    }

    if (new Date(newDueAt) <= now) {
      const err = new Error("Due date must be in the future");
      err.statusCode = 400;
      throw err;
    }

    todo.completed = false;
    todo.dueAt = newDueAt;
  }

  // Normal updates
  if (updates.title !== undefined) {
    todo.title = String(updates.title).trim();
  }

  if (updates.priority !== undefined) {
    todo.priority = updates.priority;
  }

  if (
    updates.dueAt !== undefined &&
    updates.completed !== false &&
    updates.dueAt !== null
  ) {
    todo.dueAt = updates.dueAt;
  }

  // Ongoing → Completed
  if (updates.completed === true) {
    todo.completed = true;
    todo.dueAt = null;
  }

  const updatedTodo = await todo.save();
  return updatedTodo;
};

/* =====================================================
   DELETE TODO
   - Safely unlink AI notes & quizzes
===================================================== */
export const deleteTodoService = async (userId, todoId) => {
  await autoCompleteOverdueTodos(userId);

  const todo = await Todo.findOne({
    _id: todoId,
    user: userId,
  });

  if (!todo) {
    const err = new Error("Todo not found");
    err.statusCode = 404;
    throw err;
  }

  // Preserve existing behavior: unlink first, then delete todo
  await unlinkTodoRelations({ userId, todoId: todo._id });

  await todo.deleteOne();

  return { message: "Todo deleted successfully" };
};
