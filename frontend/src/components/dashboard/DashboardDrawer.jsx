// src/components/dashboard/DashboardDrawer.jsx

import { useEffect, useId, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cx from "../../utils/cx.js";

/* =====================================================
   DashboardDrawer (ChatGPT-style Mobile Sidebar Drawer)
   ✅ Overlay + sliding panel
   ✅ Closes on:
      - outside click
      - Escape key
      - route change handled by parent (DashboardLayout)
   ✅ Width matches ChatGPT mobile drawer
   ✅ Prevent background interaction
   ✅ Accessibility:
      - role="dialog"
      - aria-modal="true"
      - focus restore
      - focus trap (industry standard)
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.16, ease: easePremium } },
};

const panelVariants = {
  hidden: { x: "-100%" },
  show: { x: 0, transition: { duration: 0.22, ease: easePremium } },
  exit: { x: "-100%", transition: { duration: 0.18, ease: easePremium } },
};

const getFocusable = (root) => {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",")
    )
  ).filter(
    (el) =>
      !!el &&
      !el.hasAttribute("disabled") &&
      !el.getAttribute("aria-hidden") &&
      el.tabIndex !== -1
  );
};

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - children: ReactNode (Sidebar content)
 */
const DashboardDrawer = ({ open = false, onClose, children }) => {
  const dialogId = useId();
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const safeClose = useMemo(() => {
    return () => {
      if (typeof onClose === "function") onClose();
    };
  }, [onClose]);

  // Escape-to-close
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        safeClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, safeClose]);

  // Lock background scroll while open (extra safety)
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  // Focus management (restore focus on close)
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement;

    const t = window.setTimeout(() => {
      const focusables = getFocusable(panelRef.current);
      const first = focusables[0] || panelRef.current;
      first?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);

      const last = lastFocusedRef.current;
      if (last && typeof last.focus === "function") last.focus();
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open) return;

    const onTrap = (e) => {
      if (e.key !== "Tab") return;
      if (!panelRef.current) return;

      const focusables = getFocusable(panelRef.current);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      // Shift+Tab
      if (e.shiftKey) {
        if (active === first || active === panelRef.current) {
          e.preventDefault();
          last.focus();
        }
        return;
      }

      // Tab
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onTrap);
    return () => window.removeEventListener("keydown", onTrap);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close sidebar"
            onClick={safeClose}
            className="absolute inset-0 cursor-default"
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <span className="absolute inset-0 bg-black/35" />
            <span className="absolute inset-0 backdrop-blur-[2px]" />
          </motion.button>

          {/* Panel */}
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cx(
              "absolute left-0 top-0 h-full",
              // ✅ ChatGPT-like mobile drawer width
              "w-[320px] max-w-[88vw]",
              "border-r border-border bg-white/80 backdrop-blur-xl",
              "shadow-[0_20px_80px_rgba(9,18,45,0.22)]",
              "outline-none"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar drawer"
            aria-describedby={dialogId}
            onClick={(e) => e.stopPropagation()}
          >
            {/* hidden description for accessibility */}
            <span id={dialogId} className="sr-only">
              Sidebar navigation drawer
            </span>

            {/* premium tint */}
            <div className="pointer-events-none absolute inset-0 bg-brand-blue/5" />

            <div className="relative h-full">{children}</div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default DashboardDrawer;
