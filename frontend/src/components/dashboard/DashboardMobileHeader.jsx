// src/components/dashboard/DashboardMobileHeader.jsx

import { Menu } from "lucide-react";
import cx from "../../utils/cx.js";

/* =====================================================
   DashboardMobileHeader (FINAL — ChatGPT style)
   ✅ only on mobile (lg:hidden)
   ✅ fixed (NOT sticky)
   ✅ minimal: hamburger + "StudexaAI" only
   ✅ no extra buttons/actions
   ✅ polished: correct hit areas + focus rings
   ✅ spacing/density aligned to ChatGPT
===================================================== */

/**
 * Props:
 * - onOpenSidebar: () => void
 */
const DashboardMobileHeader = ({ onOpenSidebar }) => {
  return (
    <header
      className={cx(
        "lg:hidden",
        "fixed top-0 left-0 right-0 z-[70] h-[56px]",
        "border-b border-border",
        "bg-white/80 backdrop-blur-xl"
      )}
      role="banner"
      aria-label="StudexaAI mobile header"
    >
      {/* subtle bluish tint (premium) */}
      <div className="pointer-events-none absolute inset-0 bg-brand-blue/5" />

      <div className="relative flex h-full items-center gap-2.5 px-3">
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => {
            if (typeof onOpenSidebar === "function") onOpenSidebar();
          }}
          className={cx(
            "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
            "border border-border bg-white shadow-card transition",
            "hover:bg-brand-blue/6",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
          )}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-text-title" />
        </button>

        {/* Title */}
        <p className="truncate text-[13px] font-extrabold tracking-tight text-text-title">
          StudexaAI
        </p>
      </div>
    </header>
  );
};

export default DashboardMobileHeader;
