// src/components/dashboard/sidebar/useSidebarCollapse.js

import { useCallback, useEffect, useMemo, useState } from "react";

/* =====================================================
   useSidebarCollapse (ULTIMATE — ChatGPT Style)
   ✅ Desktop sidebar collapse state (expanded/collapsed)
   ✅ Persisted in localStorage
   ✅ Safe JSON parsing + safe fallback
   ✅ Watches viewport (auto disables collapse on mobile)
   ✅ Industry-standard API:
      - collapsed
      - setCollapsed
      - toggleCollapsed
      - isDesktopCollapsible
===================================================== */

const STORAGE_KEY = "studexai.sidebar.collapsed";

/**
 * Read persisted boolean safely
 */
const readBool = (value, fallback = false) => {
  if (value === null || value === undefined) return fallback;

  // raw string support
  if (value === "true") return true;
  if (value === "false") return false;

  // json support
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "boolean") return parsed;
  } catch {
    // ignore
  }

  return fallback;
};

/**
 * Determine if we are in desktop breakpoint.
 * - lg breakpoint is 1024px
 * - collapse is desktop-only by design
 */
const isDesktop = () => {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(min-width: 1024px)")?.matches ?? true;
};

export const useSidebarCollapse = (opts = {}) => {
  const { defaultCollapsed = false, enabled = true } = opts || {};

  const canUseDOM =
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  const [isDesktopViewport, setIsDesktopViewport] = useState(() => isDesktop());

  // watch viewport so collapse never breaks mobile UX
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktopViewport(!!mq.matches);

    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    // Safari fallback
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const isDesktopCollapsible = enabled && isDesktopViewport;

  const [collapsed, setCollapsedState] = useState(() => {
    // collapse is only meaningful on desktop
    if (!enabled) return false;
    if (!canUseDOM) return defaultCollapsed;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    return readBool(raw, defaultCollapsed);
  });

  // Ensure: never remain collapsed on mobile
  useEffect(() => {
    if (!enabled) return;
    if (isDesktopViewport) return;
    // mobile: force expanded
    setCollapsedState(false);
  }, [enabled, isDesktopViewport]);

  // Persist updates (desktop only)
  useEffect(() => {
    if (!enabled) return;
    if (!canUseDOM) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, String(Boolean(collapsed)));
    } catch {
      // ignore storage errors
    }
  }, [collapsed, enabled, canUseDOM]);

  const setCollapsed = useCallback(
    (next) => {
      if (!enabled) return;
      if (!isDesktopViewport) return;

      setCollapsedState((prev) => {
        const value =
          typeof next === "function" ? Boolean(next(prev)) : Boolean(next);
        return value;
      });
    },
    [enabled, isDesktopViewport]
  );

  const toggleCollapsed = useCallback(() => {
    if (!enabled) return;
    if (!isDesktopViewport) return;
    setCollapsedState((v) => !v);
  }, [enabled, isDesktopViewport]);

  const api = useMemo(() => {
    return {
      collapsed: Boolean(collapsed) && isDesktopCollapsible,
      setCollapsed,
      toggleCollapsed,
      isDesktopCollapsible,
    };
  }, [collapsed, setCollapsed, toggleCollapsed, isDesktopCollapsible]);

  return api;
};

export default useSidebarCollapse;
