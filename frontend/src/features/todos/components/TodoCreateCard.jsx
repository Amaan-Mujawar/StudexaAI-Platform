// src/features/todos/components/TodoCreateCard.jsx

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarDays, Flag } from "lucide-react";
import toast from "react-hot-toast";

import cx from "../../../utils/cx.js";
import {
  TODO_PRIORITY_LABELS,
  TODO_PRIORITIES,
} from "../constants/todo.constants.js";
import { normalizePriority, toDatetimeLocalValue } from "../utils/todo.utils.js";

const easePremium = [0.2, 0.8, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const TodoCreateCard = ({ onCreateTodo, createLoading = false }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(TODO_PRIORITIES.MEDIUM);
  const [dueAt, setDueAt] = useState("");

  const priorityOptions = useMemo(
    () => [
      { value: TODO_PRIORITIES.LOW, label: TODO_PRIORITY_LABELS.low },
      { value: TODO_PRIORITIES.MEDIUM, label: TODO_PRIORITY_LABELS.medium },
      { value: TODO_PRIORITIES.HIGH, label: TODO_PRIORITY_LABELS.high },
    ],
    []
  );

  const handleCreate = async () => {
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) {
      toast.error("Task title required");
      return;
    }

    const payload = {
      title: cleanTitle,
      priority: normalizePriority(priority),
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
    };

    await onCreateTodo?.(payload);

    setTitle("");
    setPriority(TODO_PRIORITIES.MEDIUM);
    setDueAt("");
  };

  return (
    <motion.section variants={fadeUp}>
      <div className="rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-text-muted">Manual todo</p>
            <h2 className="mt-1 text-lg font-extrabold text-text-title">Add a task</h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-text-muted shadow-card">
            <Plus className="h-3.5 w-3.5 text-brand-blue" />
            quick add
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted">Task title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Revise DBMS normalization (25 mins)"
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-title shadow-card outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-text-muted">Priority</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                <Flag className="h-4 w-4 text-brand-blue" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-transparent text-sm font-extrabold text-text-title outline-none"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted">Due date (optional)</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                <CalendarDays className="h-4 w-4 text-brand-blue" />
                <input
                  type="datetime-local"
                  value={toDatetimeLocalValue(dueAt)}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-text-title outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-text-muted">
              Tip: keep tasks small (&lt;= 25 mins) for consistent streaks.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              disabled={createLoading}
              className={cx(
                "btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold",
                createLoading ? "pointer-events-none opacity-70" : ""
              )}
            >
              <Plus className="h-4 w-4" />
              {createLoading ? "Adding..." : "Add task"}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TodoCreateCard;
