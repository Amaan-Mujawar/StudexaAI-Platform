// src/features/todos/components/TodoHeader.jsx

import { motion } from "framer-motion";
import {
  ListTodo,
  Sparkles,
  RefreshCw,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";
import cx from "../../../utils/cx.js";

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

const TodoHeader = ({
  total = 0,
  ongoing = 0,
  completed = 0,
  aiCount = 0,
  loading = false,
  error = "",
  onRefresh,
}) => {
  return (
    <motion.section variants={fadeUp}>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                <ListTodo className="h-4 w-4 text-brand-blue" />
                AI Todo
                <span className="mx-1 text-text-muted/40">•</span>
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                Plan → Execute → Win
              </div>

              <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">
                Your task command center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-body">
                Add tasks, generate a clean 3-step plan using AI, and keep your
                daily momentum consistent.
              </p>

              {error ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onRefresh}
                className={cx(
                  "btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold",
                  !onRefresh ? "pointer-events-none opacity-60" : ""
                )}
              >
                <RefreshCw className={cx("h-4 w-4", loading ? "animate-spin" : "")} />
                Refresh
              </button>

              <div className="rounded-2xl border border-border bg-white/85 px-5 py-3 shadow-card">
                <p className="text-[11px] font-semibold text-text-muted">
                  Snapshot
                </p>

                <div className="mt-1 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-text-title tabular-nums">
                    {total} total
                  </span>

                  <span className="text-text-muted/40">•</span>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-blue tabular-nums">
                    {ongoing} ongoing
                  </span>

                  <span className="text-text-muted/40">•</span>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-text-muted tabular-nums">
                    {completed} done
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* micro strip */}
          <div className="mt-6 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-text-title">
                  Keep it repeat-proof
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-body">
                  Try to maintain daily pending ≤ 3 for consistency.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-text-muted shadow-card">
                  <BrainCircuit className="h-4 w-4 text-brand-cyan" />
                  AI suggestions:{" "}
                  <span className="font-extrabold text-text-title tabular-nums">
                    {aiCount}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-text-muted shadow-card">
                  <TrendingUp className="h-4 w-4 text-brand-blue" />
                  Momentum:{" "}
                  <span className="font-extrabold text-text-title tabular-nums">
                    {Math.min(
                      100,
                      Math.round(
                        (completed / Math.max(1, total)) * 100 +
                          (ongoing > 0 ? 12 : 0)
                      )
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TodoHeader;
