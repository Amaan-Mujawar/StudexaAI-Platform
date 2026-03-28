// src/features/todos/api/todos.api.js

import api from "../../../services/api.js";

/* =====================================================
   TODOS API — Frontend Contract Layer
   - NO endpoint changes
   - Mirrors backend behavior exactly
   - Single responsibility: network only
===================================================== */

/* ================= CORE TODOS ================= */

/**
 * Fetch all todos (backend returns status field)
 * @returns {Promise<Array>}
 */
export const fetchTodos = async () => {
  const res = await api.get("/todos");
  return res.data;
};

/**
 * Create a new todo
 * @param {{ title: string, priority?: string, dueAt?: string|null }} payload
 * @returns {Promise<Object>}
 */
export const createTodo = async (payload) => {
  const res = await api.post("/todos", payload);
  return res.data;
};

/**
 * Update a todo
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const updateTodo = async (id, payload) => {
  const res = await api.put(`/todos/${id}`, payload);
  return res.data;
};

/**
 * Delete a todo
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
export const deleteTodo = async (id) => {
  const res = await api.delete(`/todos/${id}`);
  return res.data;
};

/* ================= AI TODOS ================= */

/**
 * Generate AI todo suggestions (EXACTLY 3 enforced by backend)
 * @param {string} goal
 * @returns {Promise<{ todos: string[] }>}
 */
export const generateAiTodos = async (goal) => {
  const res = await api.post("/ai/todos", { goal });
  return res.data;
};

/* ================= TODO → AI NOTE ================= */

/**
 * Generate AI note from a todo
 * @param {string} todoId
 * @returns {Promise<Object>}
 */
export const generateAiNoteFromTodo = async (todoId) => {
  const res = await api.post(`/ai/todos/${todoId}/note`);
  return res.data;
};

/**
 * Regenerate AI note from a todo
 * @param {string} todoId
 * @returns {Promise<Object>}
 */
export const regenerateAiNoteFromTodo = async (todoId) => {
  const res = await api.post(`/ai/todos/${todoId}/note/regenerate`);
  return res.data;
};

/**
 * Fetch AI note linked to a todo
 * @param {string} todoId
 * @returns {Promise<Object>}
 */
export const fetchAiNoteByTodo = async (todoId) => {
  const res = await api.get(`/ai/notes/todo/${todoId}`);
  return res.data;
};

export default {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  generateAiTodos,
  generateAiNoteFromTodo,
  regenerateAiNoteFromTodo,
  fetchAiNoteByTodo,
};
