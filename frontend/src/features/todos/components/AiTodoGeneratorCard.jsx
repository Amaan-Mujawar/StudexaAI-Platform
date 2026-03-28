// src/features/todos/components/AiTodoGeneratorCard.jsx

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  CalendarDays,
  Flag,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import cx from "../../../utils/cx.js";
import {
  TODO_PRIORITY_LABELS,
  TODO_PRIORITIES,
  TODO_PRIORITY_ORDER,
} from "../constants/todo.constants.js";
import { normalizePriority, toDatetimeLocalValue } from "../utils/todo.utils.js";

const easePremium = [0.2, 0.8, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easePremium },
  },
};

const AiTodoGeneratorCard = ({
  onGenerate,
  onCreateTodo,
  loading = false,
  createLoading = false,
}) => {
  const [goal, setGoal] = useState("");
  const [drafts, setDrafts] = useState([]); // [{ id, title, priority, dueAt }]

  const priorityOptions = useMemo(
    () =>
      TODO_PRIORITY_ORDER.map((p) => ({
        value: p,
        label: TODO_PRIORITY_LABELS[p],
      })),
    []
  );

  const canGenerate = String(goal || "").trim().length > 0 && !loading;

  const handleGenerate = async () => {
    const clean = String(goal || "").trim();
    if (!clean) {
      toast.error("Enter a goal");
      return;
    }

    const res = await onGenerate?.(clean);

    // res is optional; parent might directly return array or object
    const todos =
      res?.todos && Array.isArray(res.todos)
        ? res.todos
        : Array.isArray(res)
        ? res
        : null;

    // If parent doesn't return data, assume it updated drafts itself (but we still guard)
    if (!todos) return;

    const nextDrafts = todos.slice(0, 3).map((t, idx) => ({
      id: `${Date.now()}-${idx}`,
      title: String(t || "").trim() || "Review today's study plan",
      priority: TODO_PRIORITIES.MEDIUM,
      dueAt: "",
    }));

    setDrafts(nextDrafts);
  };

  const updateDraft = (id, patch) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
  };

  const removeDraft = (id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const addDraftToTodos = async (draft) => {
    const title = String(draft.title || "").trim();
    if (!title) {
      toast.error("Task title required");
      return;
    }

    await onCreateTodo?.({
      title,
      priority: normalizePriority(draft.priority),
      dueAt: draft.dueAt ? new Date(draft.dueAt).toISOString() : null,
    });

    // remove only after successful create
    removeDraft(draft.id);
    toast.success("Task added");
  };

  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
        {/* Premium tint */}
        <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />

        <div className="relative">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                AI Todo Generator
                <span className="mx-1 text-text-muted/40">•</span>
                <Wand2 className="h-4 w-4 text-brand-blue" />
                3 suggestions
              </div>

              <h2 className="mt-3 text-lg font-extrabold text-text-title">
                Turn your goal into an action plan
              </h2>

              <p className="mt-1 text-xs font-semibold text-text-muted">
                AI proposes tasks (no DB write). You choose what to add.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDrafts([]);
                toast.success("Cleared AI drafts");
              }}
              className="btn-ghost inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold"
              disabled={drafts.length === 0}
            >
              <X className="h-4 w-4" />
              Clear drafts
            </button>
          </div>

          {/* Goal input */}
          <div className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-muted">
                Goal
              </label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Prepare for DBMS exam"
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-title shadow-card outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cx(
                "btn-secondary inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold",
                !canGenerate ? "pointer-events-none opacity-70" : ""
              )}
            >
              <Sparkles className={cx("h-4 w-4", loading ? "animate-pulse" : "")} />
              {loading ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          {/* Drafts */}
          <AnimatePresence mode="popLayout">
            {drafts.length > 0 ? (
              <motion.div
                variants={list}
                initial="hidden"
                animate="show"
                className="mt-5 space-y-3"
              >
                {drafts.map((d) => (
                  <motion.div
                    key={d.id}
                    variants={item}
                    layout
                    className="rounded-3xl border border-border bg-white/80 p-4 shadow-card"
                  >
                    <div className="space-y-4">
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-extrabold text-text-title">
                            Suggested task
                          </p>

                          <button
                            type="button"
                            onClick={() => removeDraft(d.id)}
                            className="btn-ghost inline-flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold"
                          >
                            <X className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>

                        <input
                          value={d.title}
                          onChange={(e) =>
                            updateDraft(d.id, { title: e.target.value })
                          }
                          className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-title shadow-card outline-none focus:ring-2 focus:ring-brand-blue/20"
                          placeholder="Review topic and solve 10 questions"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:items-center">
                        {/* priority */}
                        <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-brand-blue" />
                            <select
                              value={d.priority}
                              onChange={(e) =>
                                updateDraft(d.id, {
                                  priority: e.target.value,
                                })
                              }
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

                        {/* due */}
                        <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-brand-blue" />
                            <input
                              type="datetime-local"
                              value={toDatetimeLocalValue(d.dueAt)}
                              onChange={(e) =>
                                updateDraft(d.id, { dueAt: e.target.value })
                              }
                              className="w-full bg-transparent text-sm font-semibold text-text-title outline-none"
                            />
                          </div>
                        </div>

                        {/* add */}
                        <button
                          type="button"
                          onClick={() => addDraftToTodos(d)}
                          disabled={createLoading}
                          className={cx(
                            "btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold sm:col-span-2 xl:col-span-1",
                            createLoading ? "pointer-events-none opacity-70" : ""
                          )}
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-text-muted shadow-card">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue" />
                        You can edit before saving
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-text-muted shadow-card">
                        <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
                        AI creates drafts only
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: easePremium }}
                className="mt-5 rounded-3xl border border-border bg-white/60 p-5 shadow-card"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-text-title">
                      No AI drafts yet
                    </p>
                    <p className="mt-1 text-xs font-semibold text-text-muted">
                      Enter a goal above and generate tasks.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-text-muted shadow-card">
                    <Wand2 className="h-3.5 w-3.5 text-brand-blue" />
                    ready when you are
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default AiTodoGeneratorCard;
