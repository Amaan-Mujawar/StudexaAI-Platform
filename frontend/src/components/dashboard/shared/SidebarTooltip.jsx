// src/components/dashboard/shared/SidebarTooltip.jsx

import { useEffect, useId, useMemo, useRef, useState } from "react";
import cx from "../../../utils/cx.js";

/* =====================================================
   SidebarTooltip (FINAL — ChatGPT-like)
   ✅ Collapsed sidebar tooltips (icons-only)
   ✅ Hover + keyboard focus
   ✅ Smart positioning (clamped)
   ✅ Portal-less (stable)
   ✅ Backward compatible props:
      - enabled (old usage)
      - disabled (current API)
===================================================== */

/**
 * Props:
 * - label: string (required)
 * - side?: "right" | "left" (default "right")
 * - align?: "center" | "start" | "end" (default "center")
 * - enabled?: boolean   (back-compat)
 * - disabled?: boolean  (preferred)
 * - maxWidth?: number   (default 220)
 * - children: ReactNode
 */
const SidebarTooltip = ({
  label,
  side = "right",
  align = "center",
  enabled,
  disabled,
  maxWidth = 220,
  children,
}) => {
  const id = useId();
  const wrapRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const isDisabled = useMemo(() => {
    // ✅ If enabled is explicitly provided, it wins.
    if (typeof enabled === "boolean") return !enabled;
    return Boolean(disabled);
  }, [enabled, disabled]);

  const canShow = Boolean(label) && !isDisabled;

  const calc = () => {
    if (typeof window === "undefined") return;
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth || 0;
    const vh = window.innerHeight || 0;

    const gap = 10;
    const tipW = Math.max(180, Math.min(Number(maxWidth) || 220, 320));

    let left =
      side === "left" ? rect.left - tipW - gap : rect.right + gap;

    // clamp horizontally
    left = Math.max(12, Math.min(vw - tipW - 12, left));

    let top = rect.top + rect.height / 2;
    if (align === "start") top = rect.top + 10;
    if (align === "end") top = rect.bottom - 10;

    // clamp vertically
    top = Math.max(14, Math.min(vh - 14, top));

    setPos({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    calc();

    const onScroll = () => calc();
    const onResize = () => calc();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side, align, maxWidth]);

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => {
        if (!canShow) return;
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        if (!canShow) return;
        setOpen(true);
      }}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}

      {open ? (
        <span
          id={id}
          role="tooltip"
          className={cx(
            "fixed z-[200] pointer-events-none",
            "rounded-2xl border border-border bg-white/92",
            "px-3 py-2.5",
            "shadow-[0_18px_60px_rgba(9,18,45,0.20)]",
            "backdrop-blur-xl",
            "-translate-y-1/2"
          )}
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            width: `${Math.max(180, Math.min(Number(maxWidth) || 220, 320))}px`,
          }}
        >
          <span className="block text-[12px] font-extrabold text-text-title">
            {label}
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-text-muted">
            Click to open
          </span>
        </span>
      ) : null}
    </span>
  );
};

export default SidebarTooltip;
