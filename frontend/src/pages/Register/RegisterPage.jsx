// src/pages/Register/RegisterPage.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import LandingNavbar from "../../components/landing/LandingNavbar.jsx";
import FooterSection from "../../components/landing/sections/FooterSection.jsx";

import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../utils/validators.js";

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
      {/* glow */}
      {(isActive || isDone) && (
        <span
          className={`absolute inset-0 rounded-full blur-md ${
            isActive ? "bg-brand-cyan/35" : "bg-white/18"
          }`}
        />
      )}

      {/* core dot */}
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
      {/* left dots connector */}
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

      {/* content */}
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    password: null,
    global: null,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const nameError = useMemo(() => validateName(form.name), [form.name]);
  const emailError = useMemo(() => validateEmail(form.email), [form.email]);
  const passwordError = useMemo(
    () => validatePassword(form.password),
    [form.password]
  );

  const canSubmit = useMemo(() => {
    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      form.name.trim() &&
      form.email.trim() &&
      form.password
    );
  }, [nameError, emailError, passwordError, form]);

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: null, global: null }));
  };

  const onBlurField = (key) => {
    setTouched((p) => ({ ...p, [key]: true }));

    if (key === "name") setErrors((p) => ({ ...p, name: nameError }));
    if (key === "email") setErrors((p) => ({ ...p, email: emailError }));
    if (key === "password")
      setErrors((p) => ({ ...p, password: passwordError }));
  };

  const submitRegister = async (e) => {
    e.preventDefault();

    setTouched({ name: true, email: true, password: true });

    const nextErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      global: null,
    };

    setErrors(nextErrors);

    if (!canSubmit) return;

    try {
      setLoading(true);

      const email = form.email.trim().toLowerCase();
      const payload = {
        name: form.name.trim(),
        email,
        password: form.password,
      };

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrors((p) => ({
          ...p,
          global:
            data?.message ||
            "Unable to send OTP. Please check your details and try again.",
        }));
        return;
      }

      sessionStorage.setItem("register_email", email);
      sessionStorage.setItem("register_name", payload.name);

      navigate("/register/otp");
    } catch {
      setErrors((p) => ({
        ...p,
        global: "Network error. Please try again.",
      }));
    } finally {
      setLoading(false);
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

        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-18">
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
                    Secure onboarding
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-white/40" />
                    100% Free for learners
                  </div>
                </div>

                <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                  Create your StudexaAI account
                </h1>

                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/70">
                  Start your loop:{" "}
                  <span className="font-semibold text-white">
                    Plan → Learn → Practice → Review → Improve
                  </span>
                  . Your account unlocks AI tools + repeat-proof practice.
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
                    <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                    OTP-based email verification enabled
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                    For your safety, registration requires verifying a 6-digit
                    OTP sent to your email.
                  </p>
                </div>

                <div className="mt-6">
                  <StepItem
                    step={1}
                    title="Create account"
                    desc="Enter your details to begin."
                    state="active"
                  />
                  <StepItem
                    step={2}
                    title="Verify email"
                    desc="Confirm OTP sent to your inbox."
                    state="upcoming"
                  />
                  <StepItem
                    step={3}
                    title="Login"
                    desc="Access dashboard and start learning."
                    state="upcoming"
                  />
                </div>
              </div>
            </motion.aside>

            {/* Right: Form */}
            <motion.section variants={fadeUp} className="lg:col-span-7">
              <div className="flex h-full items-start justify-center rounded-none border-0 bg-white/85 p-6 shadow-none backdrop-blur-xl sm:p-8 lg:rounded-r-3xl">
                <div className="w-full max-w-[560px] scale-[0.90] origin-center -mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-full text-center">
                      <p className="text-xs font-semibold text-text-muted">
                        Step 01 / 03
                      </p>
                      <h2 className="mt-1 text-[30px] font-extrabold tracking-tight text-text-title sm:text-[38px]">
                        Register
                      </h2>
                    </div>
                  </div>

                  {errors.global && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      {errors.global}
                    </div>
                  )}

                  <form onSubmit={submitRegister} className="mt-6 space-y-5">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-semibold text-text-title">
                        Full Name
                      </label>
                      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card transition focus-within:border-border-soft">
                        <User className="h-5 w-5 text-text-muted" />
                        <input
                          value={form.name}
                          onChange={(e) => setField("name", e.target.value)}
                          onBlur={() => onBlurField("name")}
                          type="text"
                          placeholder="Your full name"
                          className="w-full bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted/70"
                          autoComplete="name"
                        />
                      </div>

                      {touched.name && (errors.name || nameError) && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          {errors.name || nameError}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-semibold text-text-title">
                        Email
                      </label>
                      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card transition focus-within:border-border-soft">
                        <Mail className="h-5 w-5 text-text-muted" />
                        <input
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          onBlur={() => onBlurField("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="w-full bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted/70"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>

                      {touched.email && (errors.email || emailError) && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          {errors.email || emailError}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-semibold text-text-title">
                        Password
                      </label>
                      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card transition focus-within:border-border-soft">
                        <Lock className="h-5 w-5 text-text-muted" />
                        <input
                          value={form.password}
                          onChange={(e) => setField("password", e.target.value)}
                          onBlur={() => onBlurField("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="w-full bg-transparent text-sm font-semibold text-text-title outline-none placeholder:text-text-muted/70"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-page text-text-muted transition hover:text-text-title"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-text-muted">
                        Must include uppercase, lowercase, number & symbol. No
                        spaces.
                      </p>

                      {touched.password &&
                        (errors.password || passwordError) && (
                          <p className="mt-2 text-xs font-semibold text-red-600">
                            {errors.password || passwordError}
                          </p>
                        )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className={[
                          "btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-semibold",
                          !canSubmit || loading ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        {loading ? "Sending OTP..." : "Continue"}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <p className="mt-4 text-center text-sm font-semibold text-text-muted">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-brand-blue transition hover:underline"
                        >
                          Login →
                        </Link>
                      </p>

                      <p className="mt-2 text-center text-xs leading-relaxed text-text-muted">
                        By continuing, you agree to our{" "}
                        <Link
                          to="/terms"
                          className="font-semibold text-text-title transition hover:underline"
                        >
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy-policy"
                          className="font-semibold text-text-title transition hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
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

export default RegisterPage;
