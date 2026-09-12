// src/components/dashboard/PracticeMiniBars.jsx

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, LayoutGrid, MessageSquareText } from "lucide-react";

import cx from "../../utils/cx.js";
import { formatNumber } from "../../utils/format.js";

/* =====================================================
   PracticeMiniBars (FINAL)
   - Distribution widget for Aptitude / Logical / Verbal
   - ✅ expects `stats` from backend dashboard stats
   - Premium glass with faint bluish tint
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easePremium },
  },
};

const BarRow = ({ icon: Icon, label, value, pct, tone = "cyan" }) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cx(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white shadow-card",
          tone === "cyan" ? "border-brand-cyan/20" : "border-brand-blue/20"
        )}
      >
        <Icon
          className={cx(
            "h-4.5 w-4.5",
            tone === "cyan" ? "text-brand-cyan" : "text-brand-blue"
          )}
        />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-extrabold text-text-title">
            {label}
          </p>
          <p className="text-sm font-extrabold text-text-title tabular-nums">
            {formatNumber(value)}
          </p>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-page">
          <div
            className={cx(
              "h-full rounded-full transition-all duration-500 ease-premium",
              tone === "cyan" ? "bg-brand-cyan/70" : "bg-brand-blue/70"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const PracticeMiniBars = ({ stats, className = "" }) => {
  const data = useMemo(() => {
    const lr = Number(stats?.logicalReasoningPractices ?? 0);
    const apt = Number(stats?.aptitudePractices ?? 0);
    const vr = Number(stats?.verbalReasoningPractices ?? 0);

    const total = lr + apt + vr;

    const pct = (v) => {
      if (!total) return 0;
      return Math.round((v / total) * 100);
    };

    return {
      lr,
      apt,
      vr,
      total,
      lrPct: pct(lr),
      aptPct: pct(apt),
      vrPct: pct(vr),
    };
  }, [stats]);

  return (
    <motion.div
      variants={item}
      className={cx(
        "relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl",
        className
      )}
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white/45 opacity-70" />
        <div className="absolute -left-16 -top-14 h-56 w-56 rounded-full bg-brand-cyan/12 blur-3xl" />
        <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-muted">
              Practice distribution
            </p>
            <h3 className="mt-1 text-lg font-extrabold tracking-tight text-text-title sm:text-xl">
              Your practice balance
            </h3>
          </div>

          <div className="rounded-2xl border border-border bg-white px-4 py-2.5 shadow-card">
            <p className="text-[11px] font-semibold text-text-muted">
              total sessions
            </p>
            <p className="mt-0.5 text-xl font-extrabold text-text-title tabular-nums">
              {formatNumber(data.total)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <BarRow
            icon={LayoutGrid}
            label="Aptitude"
            value={data.apt}
            pct={data.aptPct}
            tone="blue"
          />
          <BarRow
            icon={Brain}
            label="Logical Reasoning"
            value={data.lr}
            pct={data.lrPct}
            tone="cyan"
          />
          <BarRow
            icon={MessageSquareText}
            label="Verbal Reasoning"
            value={data.vr}
            pct={data.vrPct}
            tone="blue"
          />
        </div>

        {!data.total && (
          <div className="mt-6 rounded-2xl border border-border bg-white px-5 py-4 shadow-card">
            <p className="text-sm font-extrabold text-text-title">
              No practice sessions yet
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-body">
              Start one quick round today — your balance chart will appear here.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PracticeMiniBars;
