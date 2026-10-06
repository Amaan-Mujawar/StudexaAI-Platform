// src/features/todos/components/EditTodoModal.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Flag, CalendarClock, PencilLine } from "lucide-react";

import cx from "../../../utils/cx.js";
import {
  TODO_PRIORITIES,
  TODO_PRIORITY_ORDER,
  TODO_PRIORITY_LABELS,
  TODO_COPY,
} from "../constants/todo.constants.js";

import { toDatetimeLocal, isPastDate } from "../utils/todo.utils.js";

/* =====================================================
   EditTodoModal (ULTIMATE)
   ✅ premium UI
   ✅ keyboard accessible (esc to close)
   ✅ strictly keeps behavior compatible with backend rules
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const overlayAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: easePremium } },
};

const modalAnim = {
  hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.22, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.985,
    filter: "blur(8px)",
    transition: { duration: 0.18, ease: easePremium },
  },
};

/**
 * Props:
 * - open: boolean
 * - todo: object | null
 * - loading?: boolean
 * - onClose: () => void
 * - onSave: (updates) => Promise<void> | void
 *
 * Notes:
 * - We DO NOT change the feature logic here.
 * - Guardrails:
 *   - title required (frontend)
 *   - dueAt can be null
 *   - backend strictly enforces dueAt for completed -> ongoing transition (handled elsewhere)
 */
const EditTodoModal = ({
  open,
  todo,
  loading = false,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    if (!open || !todo) return;

    setTitle(todo?.title || "");
    setPriority(todo?.priority || "medium");
    setDueAt(todo?.dueAt ? toDatetimeLocal(todo.dueAt) : "");
  }, [open, todo]);

  // ESC support
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const cleanTitle = useMemo(() => String(title || "").trim(), [title]);
  const dueIsPast = useMemo(() => {
    if (!dueAt) return false;
    try {
      return isPastDate(new Date(dueAt).toISOString());
    } catch {
      return false;
    }
  }, [dueAt]);

  const canSave = !!cleanTitle && !loading;

  const handleSave = async () => {
    if (!canSave) return;

    const updates = {
      title: cleanTitle,
      priority,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
    };

    await onSave?.(updates);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* overlay */}
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            variants={overlayAnim}
            onClick={onClose}
          />

          {/* modal content wrapper */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center lg:pl-[var(--sidebar-width,0px)] sm:p-0">
              <motion.div
                role="dialog"
                aria-modal="true"
                className={cx(
                  "relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-border bg-white text-left shadow-card-xl"
                )}
                variants={modalAnim}
              >
              {/* ambient */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-12 -top-12 h-60 w-60 rounded-full bg-brand-cyan/10 blur-3xl opacity-80" />
                <div className="absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl opacity-70" />
              </div>

              <div className="relative p-5 sm:p-7">
                {/* header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                      <PencilLine className="h-4 w-4 text-brand-blue" />
                      {TODO_COPY.editTaskTitle}
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold tracking-tight text-text-title sm:text-xl">
                      Update this task
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                      Edit title, priority, and due date.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className={cx(
                      "grid h-10 w-10 place-items-center rounded-2xl border border-border bg-white shadow-card transition",
                      "hover:bg-brand-blue/6",
                      "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    )}
                    disabled={loading}
                    aria-label="Close"
                  >
                    <X className="h-4.5 w-4.5 text-text-muted" />
                  </button>
                </div>

                {/* form */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                      Task title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className={cx(
                        "mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-title shadow-card outline-none",
                        "focus:ring-4 focus:ring-brand-cyan/20"
                      )}
                      autoFocus
                      disabled={loading}
                    />
                    {!cleanTitle ? (
                      <p className="mt-2 text-[11px] font-semibold text-status-error">
                        Title is required.
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                      Priority
                    </label>

                    <div className="relative mt-2">
                      <Flag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue" />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={cx(
                          "w-full appearance-none rounded-2xl border border-border bg-white py-3 pl-11 pr-10 text-sm font-semibold text-text-title shadow-card outline-none",
                          "focus:ring-4 focus:ring-brand-cyan/20"
                        )}
                        disabled={loading}
                      >
                        {TODO_PRIORITY_ORDER.map((p) => (
                          <option key={p} value={p}>
                            {TODO_PRIORITY_LABELS[p]}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-text-muted">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                      Due date
                    </label>

                    <div className="relative mt-2">
                      <CalendarClock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                      <input
                        type="datetime-local"
                        value={dueAt}
                        onChange={(e) => setDueAt(e.target.value)}
                        className={cx(
                          "w-full rounded-2xl border border-border bg-white py-3 pl-11 pr-4 text-sm font-semibold text-text-title shadow-card outline-none",
                          "focus:ring-4 focus:ring-brand-cyan/20"
                        )}
                        disabled={loading}
                      />
                    </div>

                    {dueAt && dueIsPast ? (
                      <p className="mt-2 text-[11px] font-semibold text-status-error">
                        Due date is in the past.
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] font-semibold text-text-muted">
                        Leave empty if you don’t want a due date.
                      </p>
                    )}
                  </div>
                </div>

                {/* footer */}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className={cx(
                      "btn-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold",
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className={cx(
                      "btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold",
                      !canSave ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : TODO_COPY.save}
                  </button>
                </div>

                {/* note */}
                <div className="mt-5 rounded-2xl border border-border bg-white/70 px-4 py-3 shadow-card">
                  <p className="text-xs font-semibold text-text-muted">
                    Note: backend auto-completes overdue tasks. If you try to
                    mark a completed task as ongoing, backend requires a future
                    due date.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default EditTodoModal;
