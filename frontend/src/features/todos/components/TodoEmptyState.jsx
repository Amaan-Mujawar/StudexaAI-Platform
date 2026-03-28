// src/features/todos/components/TodoEmptyState.jsx

import { motion } from "framer-motion";
import { Sparkles, ClipboardList, CalendarClock, ArrowRight } from "lucide-react";

import cx from "../../../utils/cx.js";

/* =====================================================
   TodoEmptyState (ULTIMATE)
   ✅ works for ongoing/completed/ai empty
   ✅ design-system friendly (tokens only)
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easePremium },
  },
};

const TodoEmptyState = ({
  title = "Nothing here yet",
  description = "Create a task to get started.",
  icon: Icon = ClipboardList,
  tone = "blue", // "blue" | "cyan"
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
}) => {
  const toneClass =
    tone === "cyan"
      ? "bg-brand-cyan/10 text-brand-cyan"
      : "bg-brand-blue/10 text-brand-blue";

  const ringClass =
    tone === "cyan" ? "ring-brand-cyan/20" : "ring-brand-blue/20";

  const AccentIcon = tone === "cyan" ? Sparkles : CalendarClock;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl"
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cx(
            "absolute -left-14 -top-14 h-56 w-56 rounded-full blur-3xl opacity-60",
            tone === "cyan" ? "bg-brand-cyan/10" : "bg-brand-blue/10"
          )}
        />
        <div className="absolute -right-20 -bottom-16 h-72 w-72 rounded-full bg-surface-page/60 blur-3xl opacity-70" />
      </div>

      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* left */}
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={cx(
              "grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-4",
              toneClass,
              ringClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
              <AccentIcon
                className={cx(
                  "h-4 w-4",
                  tone === "cyan" ? "text-brand-cyan" : "text-brand-blue"
                )}
              />
              Fresh start
            </div>

            <h3 className="mt-3 text-base font-extrabold tracking-tight text-text-title sm:text-lg">
              {title}
            </h3>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          </div>
        </div>

        {/* right */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {secondaryLabel ? (
            <button
              type="button"
              onClick={onSecondary}
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              {secondaryLabel}
            </button>
          ) : null}

          {ctaLabel ? (
            <button
              type="button"
              onClick={onCta}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* tiny footer note */}
      <div className="relative mt-5 rounded-2xl border border-border bg-white/70 px-4 py-3 shadow-card">
        <p className="text-xs font-semibold text-text-muted">
          Pro tip: keep tasks small —{" "}
          <span className="font-extrabold text-text-title">
            ≤ 25 min chunks
          </span>{" "}
          for consistent momentum.
        </p>
      </div>
    </motion.div>
  );
};

export default TodoEmptyState;
