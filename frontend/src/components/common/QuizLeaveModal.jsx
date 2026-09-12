// src/components/common/QuizLeaveModal.jsx

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useQuizGuard } from "../../context/QuizGuardContext.jsx";

/* =====================================================
   QuizLeaveModal
   ✅ Shown when user tries to navigate away mid-quiz
   ✅ Animated entrance/exit via framer-motion
   ✅ Accessible: focus-trapped, Escape key support
   ✅ Two clear CTAs: Stay in Quiz | Leave Session
   ✅ Matches StudexaAI design system exactly
===================================================== */

const QuizLeaveModal = () => {
  const { pendingNavTarget, confirmLeave } = useQuizGuard();

  const isOpen = pendingNavTarget !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="quiz-leave-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => confirmLeave(false)}
          />

          {/* ── Modal Panel ── */}
          <motion.div
            key="quiz-leave-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="quiz-leave-title"
            aria-describedby="quiz-leave-desc"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-border bg-white/95 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              {/* ── Header ── */}
              <div className="flex items-start justify-between px-6 pt-6 pb-0">
                {/* Warning badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>

                {/* Close X */}
                <button
                  type="button"
                  onClick={() => confirmLeave(false)}
                  aria-label="Stay in quiz"
                  className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-white text-text-muted shadow-card transition hover:bg-brand-blue/8 hover:text-text-title focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="px-6 pt-4 pb-2">
                <h2
                  id="quiz-leave-title"
                  className="text-[17px] font-black text-text-title leading-snug"
                >
                  Leave this quiz session?
                </h2>
                <p
                  id="quiz-leave-desc"
                  className="mt-2 text-[13px] font-semibold text-text-muted leading-relaxed"
                >
                  Your progress is saved, but the current question state will
                  reset. You can resume from the session list anytime.
                </p>
              </div>

              {/* ── Divider ── */}
              <div className="mx-6 mt-4 border-t border-border" />

              {/* ── Actions ── */}
              <div className="flex flex-col gap-2.5 px-6 py-5">
                {/* Primary: Stay */}
                <button
                  type="button"
                  id="quiz-leave-stay"
                  onClick={() => confirmLeave(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue py-3 text-[13px] font-black text-white shadow-brand shadow-brand-blue/25 transition-all hover:bg-brand-blue-hover active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
                >
                  Stay in Quiz
                </button>

                {/* Secondary: Leave */}
                <button
                  type="button"
                  id="quiz-leave-confirm"
                  onClick={() => confirmLeave(true)}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-white py-3 text-[13px] font-black text-text-body shadow-card transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                >
                  Leave Session
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuizLeaveModal;
