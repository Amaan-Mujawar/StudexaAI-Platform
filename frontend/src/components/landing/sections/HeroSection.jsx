// src/components/landing/sections/HeroSection.jsx

import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  BookOpen,
  Target,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";

const loopSteps = [
  { label: "Plan", icon: ClipboardList },
  { label: "Learn", icon: BookOpen },
  { label: "Practice", icon: Target },
  { label: "Review", icon: CalendarCheck },
  { label: "Improve", icon: RefreshCw },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const easePremium = [0.2, 0.8, 0.2, 1];

// ✅ EXACT design reference sizes (UI freeze)
const NODE_CLASS =
  "flex h-16 w-20 flex-col items-center justify-center gap-1 rounded-xl border bg-white shadow-md backdrop-blur-xl transition-all duration-500 sm:h-20 sm:w-24 sm:gap-1.5";

// ✅ Geometry (UI freeze)
const ORBIT_RADIUS_SM = 122;
const ORBIT_RADIUS_LG = 136;

// motion system (UI freeze)
const ORBIT_DURATION = 30;
const ACTIVE_CYCLE_MS = 1500;

/* ================================
   Utilities (enterprise safe)
================================ */
function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsSmUp(mq.matches);

    update();
    mq.addEventListener?.("change", update);

    return () => mq.removeEventListener?.("change", update);
  }, []);

  return isSmUp;
}

function usePageVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onChange = () => setVisible(!document.hidden);
    onChange();

    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}

/* ================================
   Orbit Node (no hook-in-loop)
================================ */
const OrbitNode = ({
  node,
  index,
  isActive,
  prefersReducedMotion,
  isSmUp,
  orbitRotation,
  isEngineHovered,
}) => {
  const { label, icon: Icon, angleDeg } = node;

  const uprightRotate = useTransform(orbitRotation, (v) => -(v + angleDeg));
  const radius = isSmUp ? ORBIT_RADIUS_LG : ORBIT_RADIUS_SM;

  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{ transform: `rotate(${angleDeg}deg)` }}
    >
      <div className="absolute -translate-y-1/2">
        <div style={{ transform: `translateX(${radius}px)` }}>
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { y: [0, -7 - index * 0.6, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    repeat: Infinity,
                    duration: 4.8 + index * 0.33,
                    ease: "easeInOut",
                  }
            }
          >
            <motion.div
              style={{
                rotate: prefersReducedMotion ? 0 : uprightRotate,
                transformOrigin: "center",
                willChange: "transform",
              }}
            >
              <motion.div
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        scale: 1.085,
                        y: -3,
                        boxShadow: "0 16px 50px rgba(83,181,255,0.22)",
                      }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.995 }}
                transition={{ duration: 0.18, ease: easePremium }}
                animate={{
                  scale: isActive ? 1.1 : isEngineHovered ? 1.045 : 1,
                  y: isActive ? -4 : 0,
                }}
                className={[
                  "group relative",
                  NODE_CLASS,
                  isActive || isEngineHovered
                    ? "border-blue-300 shadow-blue-500/20 ring-2 ring-blue-500/20"
                    : "border-slate-200 shadow-slate-200/50",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "pointer-events-none absolute -inset-3 rounded-2xl blur-xl transition-opacity duration-300",
                    isActive || isEngineHovered
                      ? "opacity-100 bg-brand-cyan/15"
                      : "opacity-0 bg-brand-cyan/10 group-hover:opacity-100",
                  ].join(" ")}
                />

                <Icon className="relative z-10 h-6 w-6 text-brand-blue sm:h-7 sm:w-7" />
                <span className="relative z-10 text-[11px] font-semibold text-text-title sm:text-[12px]">
                  {label}
                </span>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-brand-blue/15"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEngineHovered, setIsEngineHovered] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isSmUp = useIsSmUp();
  const pageVisible = usePageVisibility();

  const orbitRotation = useMotionValue(0);
  const orbitControlsRef = useRef(null);

  // ✅ Active step cycle (enterprise safe)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % loopSteps.length);
    }, ACTIVE_CYCLE_MS);

    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  /**
   * ✅ FIXED: Orbit should NEVER restart, never slow, never snap.
   * - No dependency on hover
   * - No dependency on pageVisible (unless you *want* it)
   * - Uses incremental target: current + 360
   */
  useEffect(() => {
    if (prefersReducedMotion) return;

    orbitControlsRef.current?.stop?.();

    const start = orbitRotation.get();

    orbitControlsRef.current = animate(orbitRotation, start + 360, {
      duration: ORBIT_DURATION,
      ease: "linear",
      repeat: Infinity,
    });

    return () => orbitControlsRef.current?.stop?.();
  }, [orbitRotation, prefersReducedMotion]);

  const nodes = useMemo(() => {
    return loopSteps.map((step, i) => {
      const angleDeg = (360 / loopSteps.length) * i - 90;
      return { ...step, i, angleDeg };
    });
  }, []);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ai-glow opacity-60" />
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-cyan/25 blur-3xl glow-pulse" />
        <div className="absolute right-[-200px] top-[80px] h-[420px] w-[420px] rounded-full bg-brand-blue/20 blur-3xl float-slow" />
        <div className="absolute bottom-[-220px] left-[-200px] h-[420px] w-[420px] rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              StudexaAI is <span className="text-text-title">FREE</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl lg:text-6xl"
            >
              Plan. Learn. Practice.
              <span className="relative block">
                Improve daily.
                <span className="absolute -bottom-1 left-0 h-[6px] w-full bg-brand-cyan/25 blur-md" />
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-xl text-base leading-relaxed text-text-body sm:text-lg"
            >
              StudexaAI is a learning + productivity platform built for students
              and working professionals. Build consistency, revise smarter, and
              become interview-ready — without repetitive practice systems.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.18, ease: easePremium }}
              >
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold focus-visible:ring-4 focus-visible:ring-brand-cyan/25"
                >
                  Create a free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.18, ease: easePremium }}
              >
                <Link
                  to="/login"
                  className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold focus-visible:ring-4 focus-visible:ring-brand-cyan/15"
                >
                  Login
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-4 text-sm text-text-muted"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: easePremium }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white/70 px-3 py-2 shadow-card backdrop-blur-xl"
              >
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                <span className="font-medium text-text-title">
                  Cookie-secure authentication
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: easePremium }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white/70 px-3 py-2 shadow-card backdrop-blur-xl"
              >
                <span className="h-2 w-2 rounded-full bg-status-success" />
                <span className="font-medium text-text-title">
                  No repeated questions ever
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT — StudexaAI Loop Engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex items-center justify-center"
            onHoverStart={() => setIsEngineHovered(true)}
            onHoverEnd={() => setIsEngineHovered(false)}
          >
            <div className="relative h-[320px] w-[320px] sm:h-[360px] sm:w-[360px]">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                  aria-hidden
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: isEngineHovered ? 1 : 0.85,
                          scale: isEngineHovered ? 1.02 : 1,
                        }
                  }
                  transition={{ duration: 0.35, ease: easePremium }}
                  className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan/10 blur-2xl glow-pulse"
                />
              </div>

              <motion.div
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        repeat: Infinity,
                        duration: isEngineHovered ? 40 : 46,
                        ease: "linear",
                      }
                }
                className={[
                  "absolute inset-0 rounded-full border border-border-soft transition-shadow duration-300",
                  isEngineHovered ? "shadow-[0_0_0_6px_rgba(83,181,255,0.08)]" : "",
                ].join(" ")}
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.65), 0 0 0 0 rgba(83,181,255,0)",
                }}
              />

              <motion.div
                aria-hidden="true"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: isEngineHovered ? 0.55 : 0.35 }
                }
                transition={{ duration: 0.25, ease: easePremium }}
                className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-soft bg-white/30"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.65)",
                }}
              />

              <motion.div
                className="absolute inset-0 z-10"
                style={{
                  rotate: prefersReducedMotion ? 0 : orbitRotation,
                  transformOrigin: "50% 50%",
                }}
              >
                {nodes.map((node, index) => (
                  <OrbitNode
                    key={node.label}
                    node={node}
                    index={index}
                    isActive={activeIndex === node.i}
                    prefersReducedMotion={prefersReducedMotion}
                    isSmUp={isSmUp}
                    orbitRotation={orbitRotation}
                    isEngineHovered={isEngineHovered}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease: easePremium }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1.05, boxShadow: "0 16px 40px rgba(83,181,255,0.20)" }
                }
                className="group absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border bg-white shadow-card"
                style={{
                  boxShadow:
                    "0 10px 30px rgba(11, 22, 49, 0.08), 0 0 0 6px rgba(83,181,255,0.10)",
                }}
              >
                <motion.div
                  aria-hidden
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: isEngineHovered ? 1 : 0,
                          scale: isEngineHovered ? 1 : 0.96,
                        }
                  }
                  transition={{ duration: 0.35, ease: easePremium }}
                  className="pointer-events-none absolute inset-0 rounded-full bg-brand-blue/10 blur-xl"
                />
                <motion.div
                  aria-hidden
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: isEngineHovered ? 1 : 0,
                          scale: isEngineHovered ? 1.08 : 1,
                        }
                  }
                  transition={{ duration: 0.35, ease: easePremium, delay: 0.02 }}
                  className="pointer-events-none absolute -inset-6 rounded-full bg-brand-cyan/10 blur-2xl"
                />

                <p className="relative z-10 text-xs font-semibold text-text-muted">
                  StudexaAI
                </p>
                <p className="relative z-10 mt-1 text-sm font-bold text-text-title">
                  Built for discipline
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
