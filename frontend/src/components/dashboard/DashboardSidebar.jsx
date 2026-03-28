// src/components/dashboard/DashboardSidebar.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, PanelLeft, PanelRight } from "lucide-react";

import cx from "../../utils/cx.js";
import { logoutUser } from "../../api/authApi.js";
import { useSidebarHistory } from "../../context/SidebarHistoryContext.jsx";
import useSidebarCollapse from "./sidebar/useSidebarCollapse.js";
import SidebarTooltip from "./shared/SidebarTooltip.jsx";

import {
  SIDEBAR_NAV_ITEMS,
  shouldShowHistory,
  getActiveSidebarTo,
} from "./sidebar/sidebarConstants.js";

/* =====================================================
   DashboardSidebar (ULTIMATE — ChatGPT-like density)
   ✅ collapse icon + profile icon match link icon rhythm
   ✅ reduced extra padding in nav icons (ChatGPT compact)
   ✅ dropdown in collapsed mode opens ABOVE profile icon and
      LEFT-anchored to the sidebar edge with fixed width
   ✅ consistent single-row height for both modes
===================================================== */

const ROW_H = "h-10";

const getInitials = (value = "") => {
  const s = String(value || "").trim();
  if (!s) return "U";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return s.slice(0, 2).toUpperCase();
};

const DashboardSidebar = ({
  variant = "desktop", // desktop | mobile
  onNavigate,
  onCollapseChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname || "/dashboard";

  const activeTo = useMemo(() => getActiveSidebarTo(pathname), [pathname]);
  const showHistory = useMemo(() => shouldShowHistory(pathname), [pathname]);

  const { history } = useSidebarHistory();

  const { collapsed, toggleCollapsed, isDesktopCollapsible } =
    useSidebarCollapse({ enabled: variant === "desktop" });

  const isCollapsed = variant === "desktop" && collapsed;

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuWrapRef = useRef(null);

  useEffect(() => {
    if (variant === "desktop" && typeof onCollapseChange === "function") {
      onCollapseChange(Boolean(collapsed));
    }
  }, [collapsed, onCollapseChange, variant]);

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

  const historyTitle = history?.title || "History";
  const historyItems = Array.isArray(history?.items) ? history.items : null;

  const faviconUrl = "/favicon.png";

  return (
    <aside
      className={cx(
        "relative flex h-full w-full flex-col",
        "border-r border-border bg-white/80 backdrop-blur-xl"
      )}
      data-variant={variant}
      data-collapsed={isCollapsed ? "true" : "false"}
    >
      {/* ===== TOP HEADER (fixed) ===== */}
      <div className="shrink-0 border-b border-border bg-white/85 backdrop-blur-xl">
        <div
          className={cx(
            // center the collapse button when collapsed; normal justify-between when expanded
            "relative flex items-center px-3 py-3",
            isCollapsed ? "justify-center" : "justify-between",
            isCollapsed ? "min-h-[64px]" : ""
          )}
        >
          {!isCollapsed ? (
            <Link
              to="/dashboard"
              onClick={() => onNavigate?.()}
              className="flex items-center gap-3"
            >
              <span className="grid h-10 w-10 place-items-center">
                <img
                  src={faviconUrl}
                  alt="StudexaAI"
                  className="h-[22px] w-[22px] object-contain"
                  draggable="false"
                />
              </span>

              <div className="leading-tight">
                <p className="text-[13px] font-extrabold text-text-title">
                  StudexaAI
                </p>
                <p className="text-[11px] font-semibold text-text-muted">
                  Workspace
                </p>
              </div>
            </Link>
          ) : (
            // keep placeholder so header height remains consistent
            <div aria-hidden="true" />
          )}

          {variant === "desktop" && (
            <SidebarTooltip
              enabled={isCollapsed}
              label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              side="right"
            >
              {/* fixed-size toggle to match nav row rhythm */}
              <button
                type="button"
                onClick={() => isDesktopCollapsible && toggleCollapsed()}
                aria-pressed={isCollapsed}
                className={cx(
                  "grid place-items-center rounded-2xl border border-border bg-white shadow-card transition",
                  ROW_H,
                  "h-10 w-10",
                  "hover:bg-brand-blue/8",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelRight className="h-[16px] w-[16px] text-text-muted" />
                ) : (
                  <PanelLeft className="h-[16px] w-[16px] text-text-muted" />
                )}
              </button>
            </SidebarTooltip>
          )}
        </div>
      </div>

      {/* ===== SCROLL AREA ===== */}
      <div
        className={cx(
          "scroll-region flex-1 py-2",
          isCollapsed ? "px-1" : "px-2"
        )}
      >
        <nav className="flex flex-col gap-1">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTo === item.to;

            const button = (
              <button
                key={item.to}
                type="button"
                onClick={() => handleNav(item.to)}
                className={cx(
                  "w-full rounded-xl transition",
                  ROW_H,
                  isCollapsed
                    ? "grid place-items-center"
                    : "flex items-center gap-2 px-2",
                  active
                    ? "bg-brand-blue/10 text-text-title"
                    : "text-text-body hover:bg-brand-blue/8"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cx(
                    "grid place-items-center",
                    isCollapsed ? "h-9 w-9" : "h-8 w-8"
                  )}
                >
                  <Icon
                    className={cx(
                      "h-[16px] w-[16px]",
                      active ? "text-brand-blue" : "text-text-muted"
                    )}
                  />
                </span>

                {!isCollapsed && (
                  <span className="truncate text-[12px] font-semibold">
                    {item.label}
                  </span>
                )}
              </button>
            );

            if (isCollapsed && variant === "desktop") {
              return (
                <SidebarTooltip
                  key={item.to}
                  enabled
                  label={item.label}
                  side="right"
                >
                  {button}
                </SidebarTooltip>
              );
            }

            return button;
          })}
        </nav>

        {showHistory && !isCollapsed && historyItems !== null && (
          <div className="mt-4 px-1">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-text-muted">
              {historyTitle}
            </p>

            {historyItems.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white/70 px-3 py-3 shadow-card text-center">
                <p className="text-[11px] font-bold text-text-muted italic">
                  No sessions found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {historyItems.slice(0, 24).map((it, idx) => (
                  <button
                    key={it?.id || idx}
                    type="button"
                    onClick={() => it?.route && handleNav(it.route)}
                    className="group w-full rounded-xl px-3 py-2.5 text-left border border-transparent transition hover:bg-brand-blue/6 hover:border-brand-blue/10 active:scale-[0.98]"
                  >
                    <p className="truncate text-[12.5px] font-bold text-text-title group-hover:text-brand-blue transition">
                      {it?.title || "Untitled"}
                    </p>
                    {it?.subtitle && (
                      <div className="mt-1 flex items-center justify-between">
                        <p className="truncate text-[10.5px] font-bold text-text-muted opacity-80">
                          {it.subtitle}
                        </p>
                        {it.timestamp && (
                           <span className="text-[9px] font-black text-text-muted/40 uppercase">
                             {new Date(it.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== PROFILE (fixed bottom) ===== */}
      <div
        ref={menuWrapRef}
        className={cx(
          "relative shrink-0 border-t border-border bg-white/80 backdrop-blur-xl",
          isCollapsed ? "px-1 py-2" : "px-2 py-2"
        )}
      >
        {menuOpen && (
          <div
            className={cx(
              "absolute z-[90] rounded-2xl border border-border bg-white/92 shadow-card-hover backdrop-blur-xl",
              // always above profile row
              "bottom-[64px]",
              // collapsed: position to the right of the sidebar (anchored to its edge),
              // expanded: span the sidebar inner width (left/right inset)
              isCollapsed ? "ml-2 w-[240px]" : "left-2 right-2"
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

        {/* profile button matches nav icon rhythm in collapsed */}
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
            isCollapsed ? "grid place-items-center" : "flex items-center gap-3 px-3"
          )}
        >
          <span
            className={cx(
              "grid place-items-center rounded-2xl border border-border bg-white shadow-card",
              isCollapsed ? "h-9 w-9" : "h-10 w-10"
            )}
          >
            <span className="text-xs font-extrabold text-text-title">
              {getInitials("User")}
            </span>
          </span>

          {!isCollapsed && (
            <>
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
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
