// src/features/todos/utils/todo.utils.js

import {
  TODO_PRIORITIES,
  TODO_PRIORITY_VALUES,
  TODO_STATUS,
  TODO_STATUS_VALUES,
} from "../constants/todo.constants.js";

/* =====================================================
   TODO UTILS (ULTIMATE)
   ✅ strict validation + safe coercion
   ✅ backend-compatible shape
   ✅ centralized date helpers (dueAt)
===================================================== */

/* =========================
   TYPE GUARDS
========================= */
export const isNonEmptyString = (v) =>
  typeof v === "string" && v.trim().length > 0;

export const isValidPriority = (p) =>
  typeof p === "string" && TODO_PRIORITY_VALUES.includes(p);

export const isValidStatus = (s) =>
  typeof s === "string" && TODO_STATUS_VALUES.includes(s);

/* =========================
   COERCERS
========================= */
export const coercePriority = (p, fallback = TODO_PRIORITIES.MEDIUM) => {
  if (isValidPriority(p)) return p;
  return fallback;
};

export const coerceStatus = (s, fallback = TODO_STATUS.ONGOING) => {
  if (isValidStatus(s)) return s;
  return fallback;
};

/* =========================
   DATE HELPERS
========================= */

/**
 * Accepts:
 * - ISO string
 * - datetime-local string
 * - Date
 * - null/undefined
 *
 * Returns:
 * - ISO string (or null)
 */
export const toISODateOrNull = (value) => {
  if (!value) return null;

  // Already a Date
  if (value instanceof Date) {
    const t = value.getTime();
    if (!Number.isFinite(t)) return null;
    return value.toISOString();
  }

  // String input
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;

    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return null;

    return d.toISOString();
  }

  return null;
};

/**
 * Convert ISO string to "YYYY-MM-DDTHH:mm" for datetime-local input
 */
export const isoToDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  // local datetime-local format
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

/**
 * Check if ISO date is in the past
 */
export const isPastDate = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return false;
  return d.getTime() < Date.now();
};

/* =========================
   TODO NORMALIZER
========================= */

/**
 * Backend returns todos with:
 * - _id
 * - title
 * - priority
 * - dueAt
 * - completed boolean
 * - status: "ongoing" | "completed" (added in service)
 *
 * Normalize to safe UI object.
 */
export const normalizeTodo = (raw) => {
  const todo = raw && typeof raw === "object" ? raw : {};

  const _id = typeof todo._id === "string" ? todo._id : "";
  const title = typeof todo.title === "string" ? todo.title : "";
  const priority = coercePriority(todo.priority);
  const completed = Boolean(todo.completed);

  // Prefer backend status, fallback derive
  const status = coerceStatus(
    todo.status,
    completed ? TODO_STATUS.COMPLETED : TODO_STATUS.ONGOING
  );

  const dueAt = typeof todo.dueAt === "string" ? todo.dueAt : null;

  return {
    _id,
    title,
    priority,
    dueAt,
    completed,
    status,
    createdAt: todo.createdAt || null,
    updatedAt: todo.updatedAt || null,
    linkedQuiz: todo.linkedQuiz ?? null,
  };
};

/* =========================
   GROUPING HELPERS
========================= */
export const splitTodosByStatus = (todos = []) => {
  const list = Array.isArray(todos) ? todos : [];
  const ongoing = [];
  const completed = [];

  for (const t of list) {
    const todo = normalizeTodo(t);
    if (todo.status === TODO_STATUS.COMPLETED) completed.push(todo);
    else ongoing.push(todo);
  }

  return { ongoing, completed };
};

/**
 * Compatibility helper for UI components
 * (maps to existing strict coercion system)
 */
export const normalizePriority = (p) => coercePriority(p);

/**
 * Compatibility alias for UI components
 */
export const toDatetimeLocalValue = isoToDateTimeLocal;

/**
 * Compatibility alias for TodoItem component
 */
export const toDatetimeLocal = isoToDateTimeLocal;

/* =========================
   UI DATE FORMATTER
========================= */

/**
 * Format ISO due date into human friendly label
 */
export const formatTodoDueText = (iso) => {
  if (!iso) return "";

  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfDue = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );

  const diffDays = Math.round(
    (startOfDue - startOfToday) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return `Today at ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffDays === 1) {
    return `Tomorrow at ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffDays === -1) {
    return `Yesterday at ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
