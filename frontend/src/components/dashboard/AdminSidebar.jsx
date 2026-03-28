// src/components/dashboard/AdminSidebar.jsx
// Shared dashboard design: same layout, tokens, and interaction as DashboardSidebar
// so Admin and User dashboards share one product experience. See DashboardSidebar.jsx.

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";

import cx from "../../utils/cx.js";
import { logoutUser } from "../../api/authApi.js";
import {
  ADMIN_SIDEBAR_NAV_ITEMS,
  getActiveAdminSidebarTo,
} from "./sidebar/adminSidebarConstants.js";

const ROW_H = "h-10";

const getInitials = (value = "") => {
  const s = String(value || "").trim();
  if (!s) return "A";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return s.slice(0, 2).toUpperCase();
};

const AdminSidebar = ({ variant = "desktop", onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname || "/admin/dashboard";
  const activeTo = getActiveAdminSidebarTo(pathname);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuWrapRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e) => {
      if (!menuOpen) return;
      if (menuWrapRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleNav = (to) => {
    if (typeof onNavigate === "function") onNavigate();
    navigate(to);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logoutUser();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
      if (typeof onNavigate === "function") onNavigate();
    }
  };

  const faviconUrl = "/favicon.png";

  return (
    <aside
      className={cx(
        "relative flex h-full w-full flex-col",
        "border-r border-border bg-white/80 backdrop-blur-xl"
      )}
      data-variant={variant}
    >
      {/* Top header — matches DashboardSidebar */}
      <div className="shrink-0 border-b border-border bg-white/85 backdrop-blur-xl">
        <div className="relative flex items-center justify-between px-3 py-3">
          <Link
            to="/admin/dashboard"
            onClick={() => onNavigate?.()}
            className="flex items-center gap-3"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-2xl border border-border bg-white shadow-card">
              <span className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.14]" />
              <img
                src={faviconUrl}
                alt="StudexaAI"
                className="relative h-[22px] w-[22px] object-contain"
                draggable="false"
              />
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold text-text-title">
                StudexaAI
              </p>
              <p className="text-[11px] font-semibold text-text-muted">Admin</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Nav — same row height and active style as DashboardSidebar */}
      <div className="scroll-region flex-1 py-2 px-2">
        <nav className="flex flex-col gap-1">
          {ADMIN_SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTo === item.to;
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => handleNav(item.to)}
                className={cx(
                  "w-full rounded-xl transition flex items-center gap-2 px-2",
                  ROW_H,
                  active
                    ? "bg-brand-blue/10 text-text-title"
                    : "text-text-body hover:bg-brand-blue/8"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="grid place-items-center h-8 w-8">
                  <Icon
                    className={cx(
                      "h-[16px] w-[16px]",
                      active ? "text-brand-blue" : "text-text-muted"
                    )}
                  />
                </span>
                <span className="truncate text-[12px] font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile / Logout — same as DashboardSidebar */}
      <div
        ref={menuWrapRef}
        className="relative shrink-0 border-t border-border bg-white/80 backdrop-blur-xl px-2 py-2"
      >
        {menuOpen && (
          <div
            className={cx(
              "absolute z-[90] rounded-2xl border border-border bg-white/92 shadow-card-hover backdrop-blur-xl",
              "bottom-[64px] left-2 right-2"
            )}
            role="menu"
            aria-label="Account menu"
          >
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={cx(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition",
                "hover:bg-brand-blue/8",
                "disabled:cursor-not-allowed disabled:opacity-70"
              )}
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white shadow-card">
                <LogOut className="h-4 w-4 text-brand-blue" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-text-title">
                  {loggingOut ? "Logging out..." : "Logout"}
                </p>
                <p className="text-[11px] font-semibold text-text-muted">
                  End session securely
                </p>
              </div>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={cx(
            "w-full rounded-xl transition",
            ROW_H,
            "hover:bg-brand-blue/8",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
            "flex items-center gap-3 px-3"
          )}
        >
          <span className="grid place-items-center rounded-2xl border border-border bg-white shadow-card h-10 w-10">
            <span className="text-xs font-extrabold text-text-title">
              {getInitials("Admin")}
            </span>
          </span>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-extrabold text-text-title">
              Account
            </p>
            <p className="text-[11px] font-semibold text-text-muted">
              Signed in
            </p>
          </div>
          <ChevronDown
            className={cx(
              "h-4 w-4 transition",
              menuOpen ? "rotate-180 text-text-title" : "text-text-muted"
            )}
          />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
