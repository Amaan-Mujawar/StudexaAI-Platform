import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardMobileHeader from "./DashboardMobileHeader.jsx";
import DashboardDrawer from "./DashboardDrawer.jsx";

import "../../styles/dashboard.css";

const DashboardLayout = () => {
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setDrawerOpen(false);
    };

    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add("app-shell");
    return () => document.body.classList.remove("app-shell");
  }, []);

  return (
    <div className="dashboard-root">
      <div
        className={`dashboard-shell ${
          sidebarCollapsed ? "is-collapsed" : ""
        }`}
        style={{ "--sidebar-width": sidebarCollapsed ? "72px" : "272px" }}
      >
        {/* Sidebar */}
        <div className="dashboard-sidebar hidden lg:flex">
          <DashboardSidebar
            variant="desktop"
            onCollapseChange={(v) => setSidebarCollapsed(!!v)}
            onNavigate={() => {}}
          />
        </div>

        {/* Main column */}
        <div className="dashboard-main">
          {/* Mobile header */}
          <div className="block lg:hidden dashboard-header">
            <DashboardMobileHeader
              onOpenSidebar={() => setDrawerOpen(true)}
            />
          </div>

          {/* Scroll owner */}
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Drawer */}
      <DashboardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="dashboard-sidebar">
          <DashboardSidebar
            variant="mobile"
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </DashboardDrawer>
    </div>
  );
};

export default DashboardLayout;
