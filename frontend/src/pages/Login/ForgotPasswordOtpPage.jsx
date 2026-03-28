// src/pages/Login/ForgotPasswordOtpPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import LandingNavbar from "../../components/landing/LandingNavbar.jsx";
import FooterSection from "../../components/landing/sections/FooterSection.jsx";

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
          className={`absolute inset-0 rounded-full blur-md ${
            isActive ? "bg-brand-cyan/35" : "bg-white/18"
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
        {step !== 3 && (
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

const OTP_LEN = 6;
const RESEND_LOCK_SECONDS = 120;

const ForgotPasswordOtpPage = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(RESEND_LOCK_SECONDS);

  const email = sessionStorage.getItem("reset_email") || "";
  const resetCompleted = sessionStorage.getItem("reset_flow_complete");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (!email && !resetCompleted) {
      navigate("/login/forgot-password", { replace: true });
      return;
    }

    setTimeout(() => {
      inputsRef.current?.[0]?.focus?.();
    }, 50);

    setCooldown(RESEND_LOCK_SECONDS);
  }, [email, resetCompleted, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  const otp = useMemo(() => digits.join(""), [digits]);
  const canSubmit = otp.length === OTP_LEN && /^\d{6}$/.test(otp);

  const formatCooldown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleChange = (idx, val) => {
    setError(null);

    const onlyDigit = String(val || "").replace(/\D/g, "").slice(-1);

    setDigits((prev) => {
      const next = [...prev];
      next[idx] = onlyDigit;
      return next;
    });

    if (onlyDigit && idx < OTP_LEN - 1) {
      inputsRef.current?.[idx + 1]?.focus?.();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setDigits((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
        return;
      }

      if (idx > 0) {
        inputsRef.current?.[idx - 1]?.focus?.();
        setDigits((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      }
    }

    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current?.[idx - 1]?.focus?.();
    }

    if (e.key === "ArrowRight" && idx < OTP_LEN - 1) {
      inputsRef.current?.[idx + 1]?.focus?.();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData("text") || "";
    const cleaned = text.replace(/\D/g, "").slice(0, OTP_LEN);
    if (!cleaned) return;

    e.preventDefault();

    const next = cleaned.split("");
    while (next.length < OTP_LEN) next.push("");
    setDigits(next);

    const lastIndex = Math.min(cleaned.length, OTP_LEN) - 1;
    setTimeout(() => inputsRef.current?.[lastIndex]?.focus?.(), 0);
  };

  const submitOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email session missing. Please try again.");
      return;
    }

    if (!canSubmit) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "OTP verification failed.");
        return;
      }

      navigate("/login/reset-password", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email || cooldown > 0) return;

    try {
      setResending(true);
      setError(null);

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          type: "reset",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Failed to resend OTP.");
        return;
      }

      setDigits(Array(OTP_LEN).fill(""));
      setCooldown(RESEND_LOCK_SECONDS);
      setTimeout(() => inputsRef.current?.[0]?.focus?.(), 50);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <LandingNavbar />

      <main className="relative w-full">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-ai-glow opacity-60" />
          <div className="absolute left-1/2 top-[-260px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-cyan/25 blur-3xl glow-pulse" />
          <div className="absolute right-[-240px] top-[140px] h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-240px] left-[-240px] h-[460px] w-[460px] rounded-full bg-brand-blue/8 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-border bg-white/70 shadow-card backdrop-blur-xl lg:grid-cols-12"
          >
            {/* Left: Steps */}
            <motion.aside variants={fadeUp} className="lg:col-span-5 lg:pr-0">
              <div className="h-full rounded-none border-0 bg-brand-navy px-6 py-6 shadow-none lg:rounded-l-3xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                    <Sparkles className="h-4 w-4 text-brand-cyan" />
                    Reset OTP
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-white/40" />
                    Secure recovery
                  </div>
                </div>

                <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                  Verify OTP
                </h1>

                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/70">
                  Enter the{" "}
                  <span className="font-semibold text-white">6-digit</span> code
                  sent to your email to continue reset.
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
                    <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                    OTP expires automatically
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                    For security, OTP is time-limited. You can resend after cooldown.
                  </p>
                </div>

                <div className="mt-6">
                  <StepItem
                    step={1}
                    title="Request OTP"
                    desc="Email verification initiated."
                    state="done"
                  />
                  <StepItem
                    step={2}
                    title="Verify OTP"
                    desc="Enter OTP to confirm."
                    state="active"
                  />
                  <StepItem
                    step={3}
                    title="Set New Password"
                    desc="Create a secure new password."
                    state="upcoming"
                  />
                </div>
              </div>
            </motion.aside>

            {/* Right: OTP Form */}
            <motion.section variants={fadeUp} className="lg:col-span-7">
              <div className="flex h-full items-center justify-center rounded-none border-0 bg-white/85 p-6 shadow-none backdrop-blur-xl sm:p-8 lg:rounded-r-3xl">
                <div className="w-full max-w-[720px] scale-[0.90] origin-center text-center">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-full text-center">
                      <p className="text-xs font-semibold text-text-muted">
                        Step 02 / 03
                      </p>
                      <h2 className="mt-1 text-[30px] font-extrabold tracking-tight text-text-title sm:text-[38px]">
                        OTP Verification
                      </h2>
                      <p className="mt-3 mx-auto max-w-2xl text-sm leading-relaxed text-text-body">
                        We’ve sent a verification code to:
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-title shadow-card">
                    <span className="break-all">{email || "your email"}</span>
                  </div>

                  {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 text-left">
                      {error}
                    </div>
                  )}

                  <form onSubmit={submitOtp} className="mt-7 space-y-6">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-text-title">
                        Enter 6-digit OTP
                      </label>

                      <div
                        className="mt-3 flex flex-wrap items-center justify-between gap-2"
                        onPaste={handlePaste}
                      >
                        {digits.map((d, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="h-14 w-[14.5%] min-w-[46px] rounded-2xl border border-border bg-white text-center text-lg font-extrabold text-text-title shadow-card outline-none transition focus:border-border-soft"
                            aria-label={`OTP digit ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-semibold text-text-muted">
                          Tip: You can paste the OTP directly.
                        </p>

                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={resendOtp}
                            disabled={resending || cooldown > 0}
                            className={[
                              "btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold",
                              resending || cooldown > 0 ? "opacity-60" : "",
                            ].join(" ")}
                          >
                            <RefreshCw className="h-4 w-4" />
                            {resending ? "Resending..." : "Resend OTP"}
                          </button>

                          <span className="text-xs font-extrabold text-text-muted tabular-nums">
                            {cooldown > 0 ? formatCooldown(cooldown) : "00:00"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        to="/login"
                        className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
                      >
                        <KeyRound className="h-4 w-4" />
                        Back to Login
                      </Link>

                      <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className={[
                          "btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold",
                          !canSubmit || loading ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
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

export default ForgotPasswordOtpPage;
