// src/components/landing/LandingNavbar.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import UseCasesDropdown from "./UseCasesDropdown.jsx";
import cx from "../../utils/cx.js";

const navLinkBase =
  "relative inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold transition-colors duration-200";

const underlineBase =
  "pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-brand-gradient transition-transform duration-300 ease-premium";

const LandingNavbar = () => {
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [mobileUseCasesOpen, setMobileUseCasesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const useCasesCloseTimerRef = useRef(null);
  const useCasesWrapperRef = useRef(null);

  const nav = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/about" },
      { label: "Use cases", to: "/use-cases", type: "dropdown" },
      { label: "Contact Us", to: "/contact" },
    ],
    []
  );

  const isUseCasesRoute = location.pathname.startsWith("/use-cases");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // close menus on route change
    setMobileOpen(false);
    setUseCasesOpen(false);
    setMobileUseCasesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (!useCasesWrapperRef.current) return;
      if (!useCasesWrapperRef.current.contains(e.target)) {
        setUseCasesOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close all menus on Escape (industry standard accessibility)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;

      setMobileOpen(false);
      setUseCasesOpen(false);
      setMobileUseCasesOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const openUseCases = () => {
    if (useCasesCloseTimerRef.current) {
      clearTimeout(useCasesCloseTimerRef.current);
      useCasesCloseTimerRef.current = null;
    }
    setUseCasesOpen(true);
  };

  const delayedCloseUseCases = () => {
    if (useCasesCloseTimerRef.current)
      clearTimeout(useCasesCloseTimerRef.current);

    useCasesCloseTimerRef.current = setTimeout(() => {
      setUseCasesOpen(false);
    }, 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Premium glass bar */}
      <div
        className={cx(
          "w-full bg-white/70 backdrop-blur-xl transition-all duration-300 ease-premium",
          scrolled
            ? "shadow-card border-b border-border-soft"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/brand/studexaai-logo.png"
              alt="StudexaAI"
              className="h-10 w-auto select-none object-contain sm:h-11"
              draggable={false}
            />
          </Link>

          {/* Center nav links (desktop) */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {nav.map((item) => {
              // Use cases dropdown
              if (item.type === "dropdown") {
                const isActiveUseCases = isUseCasesRoute;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={useCasesWrapperRef}
                    onMouseEnter={openUseCases}
                    onMouseLeave={delayedCloseUseCases}
                  >
                    <NavLink
                      to={item.to}
                      className={() =>
                        cx(
                          navLinkBase,
                          "group",
                          isActiveUseCases
                            ? "text-brand-blue"
                            : "text-text-body hover:text-brand-blue"
                        )
                      }
                      onClick={() => setUseCasesOpen(false)}
                      aria-haspopup="menu"
                      aria-expanded={useCasesOpen}
                    >
                      {item.label}

                      <ChevronDown
                        className={cx(
                          "h-4 w-4 transition-transform duration-200",
                          useCasesOpen ? "rotate-180" : ""
                        )}
                      />

                      <span
                        className={cx(
                          underlineBase,
                          isActiveUseCases
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </NavLink>

                    <AnimatePresence>
                      {useCasesOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{
                            duration: 0.18,
                            ease: [0.2, 0.8, 0.2, 1],
                          }}
                        >
                          <UseCasesDropdown
                            open={useCasesOpen}
                            onClose={() => setUseCasesOpen(false)}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    cx(
                      navLinkBase,
                      "group",
                      isActive
                        ? "text-brand-blue"
                        : "text-text-body hover:text-brand-blue"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={cx(
                          underlineBase,
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/register"
              className={cx(
                "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white",
                "bg-brand-gradient shadow-card transition duration-200 ease-premium",
                "hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-brand-cyan/25"
              )}
            >
              Create a free account
            </Link>

            <Link
              to="/login"
              className={cx(
                "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold",
                "border border-border bg-white text-text-title transition duration-200 ease-premium",
                "hover:-translate-y-0.5 hover:border-border-soft hover:shadow-card focus:outline-none focus:ring-4 focus:ring-brand-cyan/15"
              )}
            >
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={cx(
              "inline-flex items-center justify-center rounded-md p-2.5 md:hidden",
              "border border-border bg-white text-text-title transition duration-200 ease-premium",
              "hover:shadow-card focus:outline-none focus:ring-4 focus:ring-brand-cyan/15"
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen ? (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/20 md:hidden"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />

              <motion.div
                id="landing-mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative z-50 md:hidden"
              >
                <div className="mx-auto w-full max-w-7xl px-4 pb-5 pt-2 sm:px-6">
                  <div className="mt-2 rounded-xl border border-border bg-white shadow-card">
                    <div className="flex flex-col p-2">
                      {/* Home */}
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          cx(
                            "rounded-lg px-4 py-3 text-sm font-semibold transition duration-200 ease-premium",
                            isActive
                              ? "bg-brand-blue/10 text-brand-blue"
                              : "text-text-title hover:bg-surface-page"
                          )
                        }
                      >
                        Home
                      </NavLink>

                      {/* About */}
                      <NavLink
                        to="/about"
                        className={({ isActive }) =>
                          cx(
                            "rounded-lg px-4 py-3 text-sm font-semibold transition duration-200 ease-premium",
                            isActive
                              ? "bg-brand-blue/10 text-brand-blue"
                              : "text-text-title hover:bg-surface-page"
                          )
                        }
                      >
                        About Us
                      </NavLink>

                      {/* Use cases (mobile expandable) */}
                      <button
                        type="button"
                        onClick={() => setMobileUseCasesOpen((v) => !v)}
                        className={cx(
                          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition duration-200 ease-premium",
                          isUseCasesRoute
                            ? "bg-brand-blue/10 text-brand-blue"
                            : "text-text-title hover:bg-surface-page"
                        )}
                        aria-expanded={mobileUseCasesOpen}
                        aria-controls="mobile-usecases-panel"
                      >
                        <span>Use cases</span>
                        <ChevronDown
                          className={cx(
                            "h-4 w-4 transition-transform duration-200",
                            mobileUseCasesOpen ? "rotate-180" : ""
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileUseCasesOpen ? (
                          <motion.div
                            id="mobile-usecases-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.18,
                              ease: [0.2, 0.8, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 space-y-1 px-2 pb-2">
                              {/* IMPORTANT: keep "All use cases" link (previous version feature) */}
                              <NavLink
                                to="/use-cases"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                All use cases
                              </NavLink>

                              <NavLink
                                to="/use-cases/ai-todo"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                AI TODO
                              </NavLink>

                              <NavLink
                                to="/use-cases/ai-note"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                AI Note
                              </NavLink>

                              <NavLink
                                to="/use-cases/ai-quiz"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                AI Quiz
                              </NavLink>

                              <NavLink
                                to="/use-cases/aptitude"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                Aptitude
                              </NavLink>

                              <NavLink
                                to="/use-cases/logical-reasoning"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                Logical Reasoning
                              </NavLink>

                              <NavLink
                                to="/use-cases/verbal-reasoning"
                                className={({ isActive }) =>
                                  cx(
                                    "block rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 ease-premium",
                                    isActive
                                      ? "bg-brand-cyan/15 text-brand-blue"
                                      : "text-text-body hover:bg-surface-page"
                                  )
                                }
                              >
                                Verbal Reasoning
                              </NavLink>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      {/* Contact */}
                      <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                          cx(
                            "rounded-lg px-4 py-3 text-sm font-semibold transition duration-200 ease-premium",
                            isActive
                              ? "bg-brand-blue/10 text-brand-blue"
                              : "text-text-title hover:bg-surface-page"
                          )
                        }
                      >
                        Contact Us
                      </NavLink>
                    </div>

                    <div className="border-t border-border p-3">
                      <div className="grid grid-cols-1 gap-3">
                        <Link
                          to="/register"
                          className={cx(
                            "inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white",
                            "bg-brand-gradient shadow-card transition duration-200 ease-premium",
                            "hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-brand-cyan/25"
                          )}
                        >
                          Create a free account
                        </Link>

                        <Link
                          to="/login"
                          className={cx(
                            "inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold",
                            "border border-border bg-white text-text-title transition duration-200 ease-premium",
                            "hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-brand-cyan/15"
                          )}
                        >
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Tiny background glow layer (subtle AI touch) */}
                  <div className="pointer-events-none relative mt-4">
                    <div className="absolute -left-10 -top-6 h-24 w-24 rounded-full bg-brand-cyan/25 blur-2xl" />
                    <div className="absolute -right-10 -bottom-4 h-24 w-24 rounded-full bg-brand-blue/15 blur-2xl" />
                  </div>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default LandingNavbar;
