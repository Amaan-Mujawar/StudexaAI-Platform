// src/features/todos/components/TodoSkeleton.jsx

import { motion } from "framer-motion";
import cx from "../../../utils/cx.js";

/* =====================================================
   TodoSkeleton (ULTIMATE)
   ✅ premium glass skeleton for AiTodoPage
   ✅ matches StudexaAI design tokens
   ✅ responsive-safe
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/55 before:to-transparent";

const Box = ({ className = "" }) => (
  <div
    className={cx(
      "rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl",
      "p-6",
      className
    )}
  >
    <div className={cx("h-full w-full rounded-2xl bg-surface-page/70", shimmer)} />
  </div>
);

const Line = ({ w = "w-full", h = "h-4" }) => (
  <div className={cx("rounded-xl bg-surface-page/70", shimmer, w, h)} />
);

const Pill = ({ w = "w-24" }) => (
  <div className={cx("h-9 rounded-full bg-surface-page/70", shimmer, w)} />
);

const TodoSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: easePremium }}
      className="space-y-6"
      aria-label="Loading todos"
      role="status"
    >
      {/* header skeleton */}
      <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Line w="w-40" h="h-4" />
            <Line w="w-[320px] max-w-full" h="h-10" />
            <Line w="w-[420px] max-w-full" h="h-4" />
          </div>
          <div className="flex gap-3">
            <Pill w="w-32" />
            <Pill w="w-32" />
          </div>
        </div>
      </div>

      {/* create + ai generator */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Box className="lg:col-span-5 h-[320px]" />
        <Box className="lg:col-span-7 h-[320px]" />
      </div>

      {/* sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* ongoing */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <Line w="w-40" h="h-5" />
              <Pill w="w-24" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-card">
                <Line w="w-[75%]" h="h-4" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill w="w-20" />
                  <Pill w="w-24" />
                  <Pill w="w-28" />
                  <Pill w="w-24" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-card">
                <Line w="w-[62%]" h="h-4" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill w="w-20" />
                  <Pill w="w-24" />
                  <Pill w="w-28" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-card">
                <Line w="w-[80%]" h="h-4" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill w="w-24" />
                  <Pill w="w-28" />
                  <Pill w="w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* completed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <Line w="w-44" h="h-5" />
              <Pill w="w-24" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-card">
                <Line w="w-[70%]" h="h-4" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill w="w-24" />
                  <Pill w="w-20" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-card">
                <Line w="w-[58%]" h="h-4" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill w="w-24" />
                  <Pill w="w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoSkeleton;
