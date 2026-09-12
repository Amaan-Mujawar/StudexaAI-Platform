// src/layouts/AdminLayout.jsx
// Uses the same layout shell as User Dashboard (DashboardLayout) so both dashboards
// share grid, breakpoints, header, sidebar behavior, and card design. See dashboard.css.

import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Reused from User Dashboard for pixel-level consistency (drawer, mobile header, dashboard.css).
import DashboardDrawer from "../components/dashboard/DashboardDrawer.jsx";
import DashboardMobileHeader from "../components/dashboard/DashboardMobileHeader.jsx";
import AdminSidebar from "../components/dashboard/AdminSidebar.jsx";

import "../styles/dashboard.css";

const AdminLayout = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="dashboard-root">
      <div className="dashboard-shell">
        {/* Same grid/sidebar column as DashboardLayout; AdminSidebar mirrors DashboardSidebar styling. */}
        <div className="dashboard-sidebar hidden lg:flex">
          <AdminSidebar variant="desktop" onNavigate={() => {}} />
        </div>

        <div className="dashboard-main">
          <div className="block lg:hidden dashboard-header">
            <DashboardMobileHeader
              title="Admin"
              onOpenSidebar={() => setDrawerOpen(true)}
            />
          </div>

          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Shared DashboardDrawer — same Framer Motion and focus trap as User Dashboard. */}
      <DashboardDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="dashboard-sidebar">
          <AdminSidebar
            variant="mobile"
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </DashboardDrawer>
    </div>
  );
};

export default AdminLayout;
