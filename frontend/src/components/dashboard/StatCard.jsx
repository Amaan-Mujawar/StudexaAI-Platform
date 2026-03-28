// src/components/dashboard/StatCard.jsx

import { motion } from "framer-motion";
import cx from "../../utils/cx.js";

const easePremium = [0.2, 0.8, 0.2, 1];

/* =====================================================
   StatCard (FINAL)
   - Premium glass card
   - Optional icon + rightSlot
   - Supports footer slot
===================================================== */

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName = "",
  rightSlot,
  footer,
  className = "",
  variant = "default", // default | soft
  as: Comp = "div",
  onClick,
  disabled = false,
}) => {
  const clickable = typeof onClick === "function" && !disabled;

  return (
    <Comp
      onClick={clickable ? onClick : undefined}
      className={cx(
        "group relative overflow-hidden rounded-3xl border shadow-card backdrop-blur-xl",
        "transition-all duration-200 ease-premium",
        variant === "soft"
          ? "border-border bg-white/75"
          : "border-border bg-white/85",
        clickable
          ? "cursor-pointer hover:-translate-y-[1px] hover:shadow-card-hover"
          : "",
        disabled ? "pointer-events-none opacity-70" : "",
        className
      )}
    >
      {/* faint premium tint (bluish glass) */}
      <div className="pointer-events-none absolute inset-0 bg-brand-blue/0 transition-colors duration-200 ease-premium group-hover:bg-brand-blue/5" />

      {/* ambient */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-brand-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-brand-blue/8 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: easePremium }}
        className="relative p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-muted">{title}</p>

            <div className="mt-2 flex items-end gap-3">
              <p className="truncate text-3xl font-extrabold tracking-tight text-text-title sm:text-[34px]">
                {value}
              </p>
            </div>

            {subtitle ? (
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {rightSlot}

            {Icon ? (
              <div
                className={cx(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white shadow-card",
                  "transition-all duration-200 ease-premium group-hover:shadow-card-hover",
                  iconClassName
                )}
              >
                <Icon className="h-5 w-5 text-brand-blue" />
              </div>
            ) : null}
          </div>
        </div>

        {footer ? (
          <div className="mt-5 border-t border-border-soft pt-4">{footer}</div>
        ) : null}
      </motion.div>
    </Comp>
  );
};

export default StatCard;
