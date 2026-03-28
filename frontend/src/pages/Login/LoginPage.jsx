// src/pages/Login/LoginPage.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  LogIn,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import LandingNavbar from "../../components/landing/LandingNavbar.jsx";
import FooterSection from "../../components/landing/sections/FooterSection.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const easePremium = [0.2, 0.8, 0.2, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const StepDot = ({ state = "upcoming" }) => {
  const isActive = state === "active";
  const isDone = state === "done";

  return (
    <span className="relative flex h-7 w-7 items-center justify-center">
      {(isActive || isDone) && (
        <span
          className={`absolute inset-0 rounded-full blur-md ${isActive ? "bg-brand-cyan/35" : "bg-white/18"
            }`}
        />
      )}

      <span
        className={[
          "relative h-3 w-3 rounded-full transition",
          isActive
            ? "bg-brand-cyan shadow-[0_0_0_6px_rgba(83,181,255,0.12)]"
            : isDone
              ? "bg-white/70"
              : "bg-white/20 ring-1 ring-white/25",
        ].join(" ")}
      />
    </span>
  );
};

const StepItem = ({ step, title, desc, state = "upcoming" }) => {
  const isActive = state === "active";

  return (
    <div className="relative flex items-start gap-3">
      <div className="mt-3 flex flex-col items-center">
        <StepDot state={state} />
        {step !== 2 && (
          <div className="mt-2 flex flex-col items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="h-1 w-1 rounded-full bg-white/25" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <div
          className={[
            "inline-block rounded-2xl px-4 py-3 transition",
            isActive
              ? "bg-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_0_40px_rgba(83,181,255,0.12)]"
              : "bg-transparent",
          ].join(" ")}
        >
          <p className="text-[11px] font-semibold text-white/65">
            Step {String(step).padStart(2, "0")}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/70">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (sessionStorage.getItem("reset_flow_complete")) {
      sessionStorage.removeItem("reset_flow_complete");
    }
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 1;
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      setError(null);

      // Ensure no trailing slash
      const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }).catch((err) => {
        throw new Error(`Network error or server unreachable: ${err.message}`);
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid email or password.");
        } else if (res.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(data?.message || "Login failed. Please try again.");
        }
        return;
      }

      setAuthenticatedUser(data);

      // Store token for Bearer auth support (api.js interceptor)
      if (data?.token) {
        localStorage.setItem("studexa_token", data.token);
      }

      if (data?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <LandingNavbar />

      <main className="relative w-full">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-ai-glow opacity-60" />
          <div className="absolute left-1/2 top-[-260px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-cyan/25 blur-3xl glow-pulse" />
          <div className="absolute right-[-240px] top-[140px] h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-240px] left-[-240px] h-[460px] w-[460px] rounded-full bg-brand-blue/8 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-26">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-border bg-white/70 shadow-card backdrop-blur-xl lg:grid-cols-12"
          >
            <motion.aside variants={fadeUp} className="lg:col-span-5 lg:pr-0">
              <div className="h-full rounded-none border-0 bg-brand-navy px-6 py-6 shadow-none lg:rounded-l-3xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                    <Sparkles className="h-4 w-4 text-brand-cyan" />
                    Welcome back
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-white/40" />
                    Your progress is safe
                  </div>
                </div>

                <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                  Login to continue
                </h1>

                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/70">
                  StudexaAI keeps your learning loop connected:{" "}
                  <span className="font-semibold text-white">
                    Plan → Learn → Practice → Review → Improve
                  </span>
                  .
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
                    <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                    Secure login
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                    Login securely to access your dashboard and saved progress.
                  </p>
                </div>

                <div className="mt-6">
                  <StepItem
                    step={1}
                    title="Login"
                    desc="Enter email + password."
                    state="active"
                  />
                  <StepItem
                    step={2}
                    title="Dashboard Access"
                    desc="Continue to workspace."
                    state="upcoming"
                  />
                </div>
              </div>
            </motion.aside>

            <motion.section variants={fadeUp} className="lg:col-span-7">
              <div className="flex h-full items-center justify-center rounded-none border-0 bg-white/85 p-6 shadow-none backdrop-blur-xl sm:p-8 lg:rounded-r-3xl">
                <div className="w-full max-w-[560px] scale-[0.90] origin-center text-center">
                  <div className="w-full text-center">
                    <p className="text-xs font-semibold text-text-muted">
                      Step 01 / 02
                    </p>
                    <h2 className="mt-1 text-[30px] font-extrabold tracking-tight text-text-title sm:text-[38px]">
                      Login
                    </h2>
                  </div>

                  <p className="mt-3 mx-auto max-w-2xl text-sm leading-relaxed text-text-body">
                    Enter your credentials to access your dashboard.
                  </p>

                  {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 text-left">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="mt-7 space-y-5">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-text-title">
                        Email
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card transition focus-within:border-border-soft">
                        <Mail className="h-5 w-5 text-text-muted" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted/70"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-text-title">
                        Password
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card transition focus-within:border-border-soft">
                        <Lock className="h-5 w-5 text-text-muted" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted/70"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Link
                        to="/login/forgot-password"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:underline"
                      >
                        <KeyRound className="h-4 w-4" />
                        Forgot password?
                      </Link>

                      <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className={[
                          "btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold",
                          !canSubmit || loading ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        <LogIn className="h-4 w-4" />
                        {loading ? "Logging in..." : "Continue"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="pt-3 text-center text-sm font-semibold text-text-muted">
                      New here?{" "}
                      <Link
                        to="/register"
                        className="text-brand-blue transition hover:underline"
                      >
                        Create a free account →
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default LoginPage;
