// src/context/SidebarHistoryContext.jsx

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/* =====================================================
   SidebarHistoryContext (ChatGPT-style)
   - Sidebar does NOT fetch history.
   - Feature pages own their history fetching.
   - Features set history for sidebar to render.
   - Dashboard (/dashboard) should set history = null.
===================================================== */

/**
 * @typedef {Object} SidebarHistoryItem
 * @property {string} id
 * @property {string} title
 * @property {string=} subtitle
 * @property {string=} timestamp
 * @property {string=} route
 */

/**
 * @typedef {Object} SidebarHistoryState
 * @property {string|null} title
 * @property {SidebarHistoryItem[]|null} items
 */

const SidebarHistoryContext = createContext(null);

export const SidebarHistoryProvider = ({ children }) => {
  /** @type {[SidebarHistoryState, Function]} */
  const [history, setHistoryState] = useState({
    title: null,
    items: null, // null = do not show section (Dashboard behavior)
  });

  /**
   * Set feature history
   * @param {Partial<SidebarHistoryState>} next
   */
  const setSidebarHistory = useCallback((next) => {
    setHistoryState((prev) => {
      const title =
        next && Object.prototype.hasOwnProperty.call(next, "title")
          ? next.title ?? null
          : prev.title ?? null;

      const items =
        next && Object.prototype.hasOwnProperty.call(next, "items")
          ? next.items ?? null
          : prev.items ?? null;

      return { title, items };
    });
  }, []);

  /**
   * Clear history completely (hide section)
   */
  const clearSidebarHistory = useCallback(() => {
    setHistoryState({
      title: null,
      items: null,
    });
  }, []);

  /**
   * Force "visible but empty" state (shows placeholder UI)
   * Useful when feature pages load history but none exists.
   */
  const showEmptySidebarHistory = useCallback((title = "History") => {
    setHistoryState({
      title: title || "History",
      items: [],
    });
  }, []);

  const value = useMemo(() => {
    return {
      history,
      setSidebarHistory,
      clearSidebarHistory,
      showEmptySidebarHistory,
    };
  }, [history, setSidebarHistory, clearSidebarHistory, showEmptySidebarHistory]);

  return (
    <SidebarHistoryContext.Provider value={value}>
      {children}
    </SidebarHistoryContext.Provider>
  );
};

export const useSidebarHistory = () => {
  const ctx = useContext(SidebarHistoryContext);
  if (!ctx) {
    throw new Error(
      "useSidebarHistory must be used within <SidebarHistoryProvider>"
    );
  }
  return ctx;
};

export default SidebarHistoryContext;
