// src/features/todos/components/TodoSection.jsx

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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

const TodoSection = ({ title, subtitle, rightSlot, children }) => {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue" />
            <h2 className="text-base font-extrabold tracking-tight text-text-title">
              {title}
            </h2>
          </div>

          {subtitle ? (
            <p className="mt-1 text-xs font-semibold text-text-muted">
              {subtitle}
            </p>
          ) : null}
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      <div className="space-y-3">{children}</div>
    </motion.section>
  );
};

export default TodoSection;
