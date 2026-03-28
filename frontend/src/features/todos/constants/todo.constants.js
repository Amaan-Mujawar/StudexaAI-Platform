// src/features/todos/constants/todo.constants.js

/* =====================================================
   TODOS CONSTANTS (ULTIMATE)
   ✅ Single source of truth for:
      - priorities
      - labels
      - status
      - UI mappings (safe defaults)
   ✅ Matches backend:
      priority: low | medium | high
      status (derived): ongoing | completed
===================================================== */

export const TODO_PRIORITIES = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const TODO_PRIORITY_VALUES = Object.freeze([
  TODO_PRIORITIES.LOW,
  TODO_PRIORITIES.MEDIUM,
  TODO_PRIORITIES.HIGH,
]);

export const TODO_PRIORITY_LABELS = Object.freeze({
  [TODO_PRIORITIES.LOW]: "Low",
  [TODO_PRIORITIES.MEDIUM]: "Medium",
  [TODO_PRIORITIES.HIGH]: "High",
});

export const TODO_STATUS = Object.freeze({
  ONGOING: "ongoing",
  COMPLETED: "completed",
});

export const TODO_STATUS_VALUES = Object.freeze([
  TODO_STATUS.ONGOING,
  TODO_STATUS.COMPLETED,
]);

export const TODO_STATUS_LABELS = Object.freeze({
  [TODO_STATUS.ONGOING]: "Ongoing",
  [TODO_STATUS.COMPLETED]: "Completed",
});

/* =====================================================
   UI HELPERS (Tailwind classes)
   - Uses existing tokens/utilities style pattern
   - Avoids hardcoded random colors where possible
===================================================== */

export const todoPriorityBadgeClass = Object.freeze({
  [TODO_PRIORITIES.LOW]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [TODO_PRIORITIES.MEDIUM]: "bg-amber-50 text-amber-700 border-amber-200",
  [TODO_PRIORITIES.HIGH]: "bg-rose-50 text-rose-700 border-rose-200",
});

export const todoStatusBadgeClass = Object.freeze({
  [TODO_STATUS.ONGOING]: "bg-surface-page text-text-muted border-border",
  [TODO_STATUS.COMPLETED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
});

/* =====================================================
   DEFAULTS
===================================================== */

export const TODO_DEFAULTS = Object.freeze({
  priority: TODO_PRIORITIES.MEDIUM,
});

/* =====================================================
   PRIORITY ORDER (UI SAFE)
===================================================== */

export const TODO_PRIORITY_ORDER = Object.freeze([
  TODO_PRIORITIES.HIGH,
  TODO_PRIORITIES.MEDIUM,
  TODO_PRIORITIES.LOW,
]);

/* =====================================================
   PRIORITY META (UI SYSTEM)
===================================================== */

export const TODO_PRIORITY_META = Object.freeze({
  [TODO_PRIORITIES.LOW]: {
    badgeClassName: todoPriorityBadgeClass[TODO_PRIORITIES.LOW],
    iconClassName: "text-emerald-600",
  },

  [TODO_PRIORITIES.MEDIUM]: {
    badgeClassName: todoPriorityBadgeClass[TODO_PRIORITIES.MEDIUM],
    iconClassName: "text-amber-600",
  },

  [TODO_PRIORITIES.HIGH]: {
    badgeClassName: todoPriorityBadgeClass[TODO_PRIORITIES.HIGH],
    iconClassName: "text-rose-600",
  },
});

/* =====================================================
   UI COPY (SINGLE SOURCE)
===================================================== */

export const TODO_COPY = Object.freeze({
  markComplete: "Mark complete",
  markOngoing: "Mark ongoing",

  aiNote: "Generate AI Note",
  quiz: "Start Quiz",

  noDueDate: "No due date",
});
