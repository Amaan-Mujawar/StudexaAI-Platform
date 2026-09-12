// src/components/dashboard/shared/DeleteConfirmationModal.jsx

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import cx from "../../../utils/cx.js";

const easePremium = [0.2, 0.8, 0.2, 1];

const overlayAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: easePremium } },
};

const modalAnim = {
  hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.22, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.985,
    filter: "blur(8px)",
    transition: { duration: 0.18, ease: easePremium },
  },
};

const DeleteConfirmationModal = ({
  open,
  title = "Delete Attempt?",
  description = "Are you sure you want to remove this record? This action cannot be undone.",
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* overlay */}
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            variants={overlayAnim}
            onClick={onClose}
          />

          {/* modal content wrapper */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center lg:pl-[var(--sidebar-width,0px)] sm:p-0">
              <motion.div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-white text-left shadow-card-xl"
                variants={modalAnim}
              >
                <div className="relative p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-status-error/10 text-status-error">
                      <Trash2 className="h-8 w-8" />
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-text-title">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-text-muted">
                      {description}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700 border border-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      This will also remove it from your history.
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="btn-secondary w-full py-3.5 font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={loading}
                      className="btn-primary w-full bg-status-error text-white hover:bg-status-error/90 py-3.5 font-extrabold"
                    >
                      {loading ? "Deleting..." : "Delete Permanently"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
