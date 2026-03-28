// src/components/dashboard/QuickActionCard.jsx

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import cx from "../../utils/cx.js";

/* =====================================================
   QuickActionCard (FINAL — responsive-safe)
   - Original two-column alignment preserved
   - Text visibility improved (no hard truncation)
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const QuickActionCard = ({
  title,
  desc,
  icon: Icon,
  tone = "cyan", // "cyan" | "blue"
  onClick,
  disabled = false,
  rightLabel = "Open",
  className = "",
}) => {
  return (
    <motion.button
      variants={item}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "group relative w-full overflow-hidden rounded-3xl border p-6 text-left shadow-card backdrop-blur-xl transition-all duration-200 ease-premium",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
        "bg-white/70 border-border",
        "ring-1 ring-brand-blue/5",
        "hover:bg-brand-blue/5 hover:border-brand-blue/20 hover:shadow-card-hover",
        "active:translate-y-[1px]",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      aria-label={title}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 -top-14 h-56 w-56 rounded-full bg-brand-cyan/10 blur-3xl opacity-70 transition group-hover:opacity-90" />
        <div className="absolute -right-14 -bottom-20 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl opacity-60 transition group-hover:opacity-85" />
      </div>

      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="min-w-0">
          <p className="text-base font-extrabold leading-tight text-text-title break-words">
            {title}
          </p>

          {desc ? (
            <p className="mt-1 text-sm leading-relaxed text-text-body break-words">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-end justify-between">
          <span
            className={cx(
              "inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-card transition-all duration-200 ease-premium",
              tone === "cyan"
                ? "border-brand-cyan/20 group-hover:border-brand-cyan/30"
                : "border-brand-blue/20 group-hover:border-brand-blue/30"
            )}
            aria-hidden="true"
          >
            {Icon ? (
              <Icon
                className={cx(
                  "h-5 w-5 transition-colors duration-200",
                  tone === "cyan" ? "text-brand-cyan" : "text-brand-blue"
                )}
              />
            ) : null}
          </span>

          <span
            className={cx(
              "mt-3 inline-flex items-center gap-1.5 rounded-full border bg-white shadow-card transition-all duration-200 ease-premium",
              "border-border text-text-muted",
              "group-hover:border-brand-blue/20 group-hover:text-brand-blue group-hover:bg-brand-blue/5",
              "px-2.5 py-1 text-[11px] font-semibold"
            )}
            aria-hidden="true"
          >
            {rightLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-text-muted">
            <span
              className={cx(
                "h-2 w-2 rounded-full",
                tone === "cyan" ? "bg-brand-cyan/70" : "bg-brand-blue/70"
              )}
              aria-hidden="true"
            />
            Quick access
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default QuickActionCard;
