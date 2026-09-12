// src/components/dashboard/StatDonutChart.jsx

import { useMemo } from "react";
import cx from "../../utils/cx.js";

/* =====================================================
   StatDonutChart (FINAL)
   - Lightweight SVG donut (no extra libs)
   - Uses design tokens (no random colors)
   - Industry-grade accessibility
===================================================== */

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const StatDonutChart = ({
  value = 0, // 0..100
  size = 140,
  stroke = 14,
  labelTop = "Avg Score",
  labelMain,
  labelBottom,
  className = "",
}) => {
  const v = clamp(Number(value) || 0, 0, 100);

  const cfg = useMemo(() => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (v / 100) * c;

    return { r, c, dash };
  }, [size, stroke, v]);

  const mainLabel =
    typeof labelMain === "string" ? labelMain : `${Math.round(v)}%`;

  return (
    <div
      className={cx("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${labelTop}: ${Math.round(v)} percent`}
    >
      {/* faint premium glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-brand-blue/5 blur-2xl opacity-60" />

      <svg
        width={size}
        height={size}
        className="relative"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={cfg.r}
          fill="none"
          stroke="rgba(15, 23, 42, 0.08)"
          strokeWidth={stroke}
        />

        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={cfg.r}
          fill="none"
          stroke="rgba(59, 130, 246, 0.95)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${cfg.dash} ${cfg.c - cfg.dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* center labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[11px] font-semibold text-text-muted">{labelTop}</p>
        <p className="mt-0.5 text-[28px] font-extrabold tracking-tight text-text-title tabular-nums">
          {mainLabel}
        </p>
        {labelBottom ? (
          <p className="mt-0.5 text-[11px] font-semibold text-text-muted">
            {labelBottom}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default StatDonutChart;
