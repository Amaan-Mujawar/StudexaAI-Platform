// src/components/dashboard/sidebar/sidebarConstants.js

import {
  Home,
  CheckSquare,
  FileText,
  Sparkles,
  LayoutGrid,
  Brain,
  MessageSquareText,
  Trophy,
  BookOpen,
  Settings,
  TicketIcon,
} from "lucide-react";

/* =====================================================
   Sidebar Constants (FINAL)
   ✅ Single source of truth for:
      - sidebar nav items
      - feature route detection
      - active route resolution
   ✅ Prevents duplication + keeps Sidebar clean
===================================================== */

export const SIDEBAR_NAV_ITEMS = Object.freeze([
  { key: "home", label: "Home", to: "/dashboard", icon: Home },
  {
    key: "ai-todo",
    label: "AI Todo",
    to: "/dashboard/ai-todo",
    icon: CheckSquare,
  },
  {
    key: "ai-note",
    label: "AI Note",
    to: "/dashboard/ai-note",
    icon: FileText,
  },
  {
    key: "ai-quiz",
    label: "AI Quiz",
    to: "/dashboard/ai-quiz",
    icon: Sparkles,
  },
  {
    key: "aptitude",
    label: "Aptitude",
    to: "/dashboard/aptitude",
    icon: LayoutGrid,
  },
  {
    key: "logical-reasoning",
    label: "Logical Reasoning",
    to: "/dashboard/logical-reasoning",
    icon: Brain,
  },
  {
    key: "verbal-reasoning",
    label: "Verbal Reasoning",
    to: "/dashboard/verbal-reasoning",
    icon: MessageSquareText,
  },
  {
    key: "contest",
    label: "Contest",
    to: "/dashboard/contest",
    icon: Trophy,
  },
  {
    key: "resources",
    label: "Resources",
    to: "/dashboard/resources",
    icon: BookOpen,
  },
  {
    key: "tickets",
    label: "My Tickets",
    to: "/dashboard/tickets",
    icon: TicketIcon,
  },
  {
    key: "settings",
    label: "Settings",
    to: "/dashboard/settings",
    icon: Settings,
  },
]);

/* =====================================================
   HISTORY CONFIGURATION
   - Only these routes will show history in sidebar
   - AI Todo is EXCLUDED (no history)
===================================================== */

export const ROUTES_WITH_HISTORY = Object.freeze([
  "/dashboard/ai-note",
  "/dashboard/ai-quiz",
  "/dashboard/aptitude",
  "/dashboard/logical-reasoning",
  "/dashboard/verbal-reasoning",
]);

export const ROUTES_WITHOUT_HISTORY = Object.freeze([
  "/dashboard/ai-todo",
  "/dashboard/resources",
  "/dashboard/settings",
]);

/**
 * Check if current route should show history in sidebar
 * @param {string} pathname - Current route path
 * @returns {boolean} - True if route should show history
 */
export const shouldShowHistory = (pathname) => {
  const p = pathname || "";
  if (!p) return false;
  if (p === "/dashboard") return false;

  return ROUTES_WITH_HISTORY.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
};

/**
 * Legacy: Check if route is a feature route (any feature)
 * Used for other purposes, not history
 */
export const isFeatureRoute = (pathname) => {
  const p = pathname || "";
  if (!p) return false;
  if (p === "/dashboard") return false;

  const allFeatureRoutes = [...ROUTES_WITH_HISTORY, ...ROUTES_WITHOUT_HISTORY];
  return allFeatureRoutes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
};

export const getActiveSidebarTo = (pathname) => {
  const p = pathname || "/dashboard";

  const match = SIDEBAR_NAV_ITEMS.find((item) => {
    if (item.to === "/dashboard") return p === "/dashboard";
    return p === item.to || p.startsWith(`${item.to}/`);
  });

  return match?.to || "/dashboard";
};

export default {
  SIDEBAR_NAV_ITEMS,
  ROUTES_WITH_HISTORY,
  ROUTES_WITHOUT_HISTORY,
  shouldShowHistory,
  isFeatureRoute,
  getActiveSidebarTo,
};
