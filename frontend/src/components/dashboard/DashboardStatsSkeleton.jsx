// src/components/dashboard/DashboardStatsSkeleton.jsx

import { motion } from "framer-motion";
import cx from "../../utils/cx.js";

/* =====================================================
   DashboardStatsSkeleton (FINAL)
   - Premium glass skeleton loading
   - Matches StudexaAI tokens (no random colors)
===================================================== */

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/55 before:to-transparent";

const Box = ({ className = "" }) => (
  <div
    className={cx(
      "rounded-2xl border border-border bg-white/85 shadow-card backdrop-blur-xl",
      "p-5 sm:p-6",
      className
    )}
  >
    <div className={cx("h-full w-full rounded-xl bg-surface-page/70", shimmer)} />
  </div>
);

const DashboardStatsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-6"
      aria-label="Loading dashboard stats"
      role="status"
    >
      {/* header skeleton */}
      <div className="rounded-3xl border border-border bg-white/80 p-6 shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className={cx("h-4 w-36 rounded-lg bg-surface-page/70", shimmer)} />
            <div
              className={cx(
                "h-10 w-[260px] max-w-full rounded-2xl bg-surface-page/70",
                shimmer
              )}
            />
            <div
              className={cx(
                "h-4 w-[320px] max-w-full rounded-lg bg-surface-page/70",
                shimmer
              )}
            />
          </div>

          <div className="flex gap-3">
            <div className={cx("h-10 w-28 rounded-2xl bg-surface-page/70", shimmer)} />
            <div className={cx("h-10 w-28 rounded-2xl bg-surface-page/70", shimmer)} />
          </div>
        </div>
      </div>

      {/* stats grid skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Box className="h-[170px]" />
            <Box className="h-[170px]" />
            <Box className="h-[170px]" />
            <Box className="h-[170px]" />
          </div>
        </div>

        <div className="lg:col-span-4">
          <Box className="h-[360px]" />
        </div>
      </div>

      {/* quick actions skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Box className="h-[130px]" />
        <Box className="h-[130px]" />
        <Box className="h-[130px]" />
        <Box className="h-[130px]" />
      </div>
    </motion.div>
  );
};

export default DashboardStatsSkeleton;
