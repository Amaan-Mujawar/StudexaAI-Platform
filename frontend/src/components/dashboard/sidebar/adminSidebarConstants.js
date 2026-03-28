// src/components/dashboard/sidebar/adminSidebarConstants.js
// Admin nav items — same shape as sidebarConstants for shared DashboardSidebar-style UI.

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TicketIcon,
} from "lucide-react";

export const ADMIN_SIDEBAR_NAV_ITEMS = Object.freeze([
  { key: "dashboard", label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", to: "/admin/users", icon: Users },
  { key: "content", label: "Content", to: "/admin/content", icon: FileText },
  { key: "tickets", label: "Tickets", to: "/admin/tickets", icon: TicketIcon },
  { key: "settings", label: "Settings", to: "/admin/settings", icon: Settings },
]);

export const getActiveAdminSidebarTo = (pathname) => {
  const p = pathname || "/admin/dashboard";
  const match = ADMIN_SIDEBAR_NAV_ITEMS.find(
    (item) => p === item.to || p.startsWith(`${item.to}/`)
  );
  return match?.to || "/admin/dashboard";
};
