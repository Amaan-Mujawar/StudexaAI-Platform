// src/features/todos/components/TodoItem.jsx

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  CalendarClock,
  Trash2,
  Pencil,
  Sparkles,
  Save,
  X,
  Flag,
} from "lucide-react";

import cx from "../../../utils/cx.js";
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_LABELS,
  TODO_PRIORITY_META,
  TODO_COPY,
} from "../constants/todo.constants.js";

import {
  formatTodoDueText,
  toDatetimeLocal,
  isPastDate,
} from "../utils/todo.utils.js";

/* =====================================================
   TodoItem (ULTIMATE)
   ✅ matches StudexaAI premium dashboard style
   ✅ supports:
      - toggle completed
      - edit title/priority/dueAt
      - delete
      - AI note (generate/view from parent)
      - quiz launch (parent)
   ✅ No feature loss
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const itemAnim = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easePremium },
  },
};

const Badge = ({ className = "", children }) => {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-[11px] font-semibold shadow-card",
        className
      )}
    >
      {children}
    </span>
  );
};

const PriorityBadge = ({ priority = "medium" }) => {
  const meta = TODO_PRIORITY_META[priority] || TODO_PRIORITY_META.medium;

  return (
    <Badge className={cx(meta.badgeClassName, "border-border")}>
      <Flag className={cx("h-3.5 w-3.5", meta.iconClassName)} />
      {TODO_PRIORITY_LABELS[priority] || "Medium"}
    </Badge>
  );
};

/**
 * Props:
 * - todo (required)
 * - completed?: boolean
 * - busy?: boolean
 * - generatingNote?: boolean
 * - launchingQuiz?: boolean
 *
 * Actions (from parent):
 * - onToggle(todo)
 * - onDelete(todo)
 * - onEdit(todo, updates)
 * - onGenerateNote(todo)
 * - onViewNote(todo)
 * - onLaunchQuiz(todo)
 */
const TodoItem = ({
  todo,
  completed = false,
  busy = false,

  generatingNote = false,
  launchingQuiz = false,

  onToggle,
  onDelete,
  onEdit, // Now opens modal via parent
  onGenerateNote,
  onViewNote,
  onLaunchQuiz,
}) => {
  const dueText = useMemo(() => formatTodoDueText(todo?.dueAt), [todo?.dueAt]);
  const dueIsPast = useMemo(() => isPastDate(todo?.dueAt), [todo?.dueAt]);

  const canInteract = !busy;

  return (
    <motion.div
      variants={itemAnim}
      initial="hidden"
      animate="show"
      className={cx(
        "group relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl",
        "transition-all duration-200 ease-premium",
        "hover:border-brand-blue/20 hover:bg-brand-blue/5 hover:shadow-card-hover"
      )}
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 -top-14 h-56 w-56 rounded-full bg-brand-cyan/10 blur-3xl opacity-70 transition group-hover:opacity-90" />
        <div className="absolute -right-14 -bottom-20 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl opacity-60 transition group-hover:opacity-85" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Toggle */}
          <button
            type="button"
            onClick={() => canInteract && onToggle?.(todo)}
            disabled={!canInteract}
            className={cx(
              "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-border bg-white shadow-card transition",
              "hover:bg-brand-blue/6",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
              !canInteract ? "opacity-70 cursor-not-allowed" : ""
            )}
            aria-label={completed ? TODO_COPY.markOngoing : TODO_COPY.markComplete}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-brand-blue" />
            ) : (
              <Circle className="h-5 w-5 text-text-muted" />
            )}
          </button>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={cx(
                    "text-[15px] font-extrabold leading-snug text-text-title",
                    completed ? "line-through opacity-70" : ""
                  )}
                >
                  {todo?.title || "Untitled task"}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={todo?.priority || "medium"} />

                  {todo?.dueAt ? (
                    <Badge
                      className={cx(
                        "border-border",
                        dueIsPast
                          ? "text-status-error border-red-200 bg-red-50"
                          : "text-text-muted"
                      )}
                    >
                      <CalendarClock className="h-3.5 w-3.5 text-brand-blue" />
                      {dueText}
                    </Badge>
                  ) : (
                    <Badge className="text-text-muted">
                      <CalendarClock className="h-3.5 w-3.5 text-text-muted" />
                      No due date
                    </Badge>
                  )}
                </div>
              </div>

              {/* Primary actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!canInteract) return;
                    onEdit?.(todo);
                  }}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-xs font-semibold shadow-card transition",
                    "hover:bg-brand-blue/6 hover:border-brand-blue/20",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
                  )}
                >
                  <Pencil className="h-4 w-4 text-text-muted" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => canInteract && onDelete?.(todo)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-xs font-semibold shadow-card transition",
                    "hover:bg-red-50 hover:border-red-200 hover:text-status-error",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
                  )}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Integrations */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!canInteract) return;
                  onGenerateNote?.(todo);
                }}
                disabled={!canInteract || generatingNote}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-xs font-semibold shadow-card transition",
                  "border-border text-text-title",
                  "hover:bg-brand-blue/6 hover:border-brand-blue/20",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                  generatingNote || !canInteract
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                )}
              >
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                {generatingNote ? "Generating AI Note..." : TODO_COPY.aiNote}
              </button>

              <button
                type="button"
                onClick={() => canInteract && onViewNote?.(todo)}
                disabled={!canInteract}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-xs font-semibold shadow-card transition",
                  "border-border text-text-muted",
                  "hover:bg-brand-blue/6 hover:border-brand-blue/20 hover:text-brand-blue",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                  !canInteract ? "opacity-70 cursor-not-allowed" : ""
                )}
              >
                View Note
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!canInteract) return;
                  onLaunchQuiz?.(todo);
                }}
                disabled={!canInteract || launchingQuiz}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-xs font-semibold shadow-card transition",
                  "border-border text-text-muted",
                  "hover:bg-brand-blue/6 hover:border-brand-blue/20 hover:text-brand-blue",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                  launchingQuiz || !canInteract
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                )}
              >
                {launchingQuiz ? "Starting quiz..." : TODO_COPY.quiz}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
