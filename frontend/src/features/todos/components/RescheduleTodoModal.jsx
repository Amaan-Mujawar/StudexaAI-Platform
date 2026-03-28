// src/features/todos/components/RescheduleTodoModal.jsx

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, X, RotateCcw, Save, AlertTriangle } from "lucide-react";

import cx from "../../../utils/cx.js";
import { TODO_COPY } from "../constants/todo.constants.js";
import { isPastDate, toDatetimeLocal } from "../utils/todo.utils.js";

/* =====================================================
   RescheduleTodoModal (ULTIMATE)
   ✅ matches backend rule:
      completed -> ongoing REQUIRES dueAt in the future
   ✅ no loopholes
   ✅ keyboard accessible
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

const RescheduleTodoModal = ({
  open,
  todo,
  loading = false,
  onClose,
  onConfirm, // (newDueAtIso: string) => Promise<void> | void
}) => {
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    if (!open) return;

    // default value for best UX:
    // if todo already has dueAt -> use it
    // else -> blank (force user to choose)
    const initial =
      todo?.dueAt && typeof todo.dueAt === "string"
        ? toDatetimeLocal(todo.dueAt)
        : "";
    setDueAt(initial);
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

  const dueIso = useMemo(() => {
    if (!dueAt) return "";
    try {
      return new Date(dueAt).toISOString();
    } catch {
      return "";
    }
  }, [dueAt]);

  const isInvalid = useMemo(() => {
    if (!dueIso) return true;
    return isPastDate(dueIso);
  }, [dueIso]);

  const canConfirm = !!dueIso && !isInvalid && !loading;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm?.(dueIso);
  };

  const handleReset = () => {
    setDueAt("");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90]"
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

          {/* modal */}
          <div className="relative flex min-h-dvh items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-border bg-white shadow-card-xl"
              variants={modalAnim}
            >
              {/* ambient */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-12 -top-12 h-56 w-56 rounded-full bg-brand-blue/10 blur-3xl opacity-70" />
                <div className="absolute -right-10 -bottom-14 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl opacity-70" />
              </div>

              <div className="relative p-5 sm:p-7">
                {/* header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                      <CalendarClock className="h-4 w-4 text-brand-blue" />
                      {TODO_COPY.rescheduleTitle}
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold tracking-tight text-text-title sm:text-xl">
                      Pick a new due date
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                      This is required to move a completed task back to ongoing.
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

                {/* body */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-border bg-white/70 p-4 shadow-card">
                    <p className="text-xs font-extrabold text-text-title">
                      Task
                    </p>
                    <p className="mt-1 text-sm font-semibold text-text-body">
                      {todo?.title || "Untitled task"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
                      New due date (required)
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

                    {isInvalid ? (
                      <div className="mt-2 flex items-start gap-2 rounded-2xl border border-status-error/20 bg-status-error/10 px-3 py-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-status-error" />
                        <p className="text-[12px] font-semibold text-status-error">
                          Please select a future date & time.
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] font-semibold text-text-muted">
                        Choose a future date to comply with backend guardrails.
                      </p>
                    )}
                  </div>
                </div>

                {/* footer */}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className={cx(
                      "btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className={cx(
                      "btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold",
                      !canConfirm ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Updating..." : TODO_COPY.confirm}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default RescheduleTodoModal;
