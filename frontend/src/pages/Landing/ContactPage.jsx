// src/pages/Landing/ContactPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Mail,
  MessageSquare,
  ShieldCheck,
  Bug,
  Lightbulb,
  Trash2,
  HelpCircle,
  ArrowRight,
  Info,
  Send,
  CheckCircle2,
  Loader2,
  Ticket,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import LandingNavbar from "../../components/landing/LandingNavbar.jsx";
import FooterSection from "../../components/landing/sections/FooterSection.jsx";
import { submitGuestTicket } from "../../api/ticketsApi.js";
import AuthContext from "../../context/AuthContext.jsx";

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

const ContactPage = () => {
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [subject, setSubject] = useState("support");
  const [faqOpen, setFaqOpen] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill if user logs in while on page
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const subjects = useMemo(
    () => [
      {
        id: "suggestion",
        label: "Suggestion / Idea",
        icon: <Lightbulb className="h-4 w-4 text-brand-blue" />,
        hint: "Help us improve StudexaAI's learning loop.",
      },
      {
        id: "bug",
        label: "Report a Bug",
        icon: <Bug className="h-4 w-4 text-brand-blue" />,
        hint: "Spotted something broken? Tell us the steps.",
      },
      {
        id: "support",
        label: "Support / Help",
        icon: <HelpCircle className="h-4 w-4 text-brand-blue" />,
        hint: "Need help understanding something or using features?",
      },
      {
        id: "privacy",
        label: "Delete Account / Data",
        icon: <Trash2 className="h-4 w-4 text-brand-blue" />,
        hint: "Request account deletion or data removal.",
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "What issue are you facing?",
        a: "Choose a subject above (Suggestion / Bug / Support / Delete Data) and describe your issue. We'll review it and get back to you.",
        icon: <Info className="h-4 w-4 text-brand-blue" />,
      },
      {
        q: "I want help with practice modules (Aptitude / Reasoning).",
        a: "Use \"Support / Help\" and mention the module name, what you clicked, and the exact message/error you see. If possible, include steps to reproduce.",
        icon: <HelpCircle className="h-4 w-4 text-brand-blue" />,
      },
      {
        q: "I found repeated questions. Isn't StudexaAI repeat-proof?",
        a: "StudexaAI is designed to enforce non-repetitive practice across attempts. If you notice repetition, report it via \"Report a Bug\" with screenshot/context so we can investigate.",
        icon: <ShieldCheck className="h-4 w-4 text-brand-blue" />,
      },
      {
        q: "How do I request deleting my account/data?",
        a: "Select \"Delete Account / Data\", provide your email (optional but recommended), and clearly mention what you want deleted (account only / data only / full removal).",
        icon: <Trash2 className="h-4 w-4 text-brand-blue" />,
      },
    ],
    []
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Please describe your issue";
    else if (form.message.trim().length < 10) e.message = "Message is too short";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitGuestTicket({ ...form, subject });
      setSubmittedTicket(result.ticket);
      setSubmitted(true);
      toast.success("Ticket submitted! We'll be in touch.");
    } catch (err) {
      toast.error(err?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <LandingNavbar />

      <main className="relative w-full">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-ai-glow opacity-55" />
          <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-cyan/20 blur-3xl glow-pulse" />
          <div className="absolute right-[-240px] top-[140px] h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-240px] left-[-240px] h-[520px] w-[520px] rounded-full bg-brand-blue/8 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          {/* Header */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              Contact
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              We'd love to hear from you.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body sm:text-lg"
            >
              Have a suggestion? Found a bug? Want help using features? Or need
              account/data deletion? Send us a message — we'll take a look.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-7 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-white/70 px-5 py-4 text-left shadow-card backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="icon-box mt-0.5">
                  <ShieldCheck className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-text-title">
                    Important safety note
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-body">
                    StudexaAI is{" "}
                    <span className="font-semibold text-text-title">
                      100% free for learners
                    </span>
                    . Please be cautious of scammers requesting money, tests, or
                    job offers using the StudexaAI name.
                  </p>
                </div>
              </div>

              <Link
                to="/terms"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:underline"
              >
                View Terms <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Form + FAQ */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Contact Form / Success State */}
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="card overflow-hidden rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8">

                {submitted && submittedTicket ? (
                  /* ─── Success State — always shows Login/Register CTAs ─── */
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-extrabold text-text-title">
                      Ticket Submitted!
                    </h2>
                    <p className="mt-2 text-sm text-text-body max-w-sm">
                      Your support request has been received. We'll review it and reply to{" "}
                      <span className="font-semibold text-text-title">{form.email}</span>.
                    </p>

                    {/* Ticket number badge */}
                    <div className="mt-5 rounded-2xl border border-border bg-surface-page px-5 py-4 w-full max-w-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="h-4 w-4 text-brand-blue" />
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Ticket Number</span>
                      </div>
                      <p className="text-lg font-extrabold text-brand-blue">
                        {submittedTicket.ticketNumber}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">Status: Open — in our queue</p>
                    </div>

                    {/* Track-ticket callout */}
                    <div className="mt-4 rounded-2xl border border-border bg-white/70 px-4 py-3 w-full max-w-sm text-left">
                      <p className="text-xs leading-relaxed text-text-body">
                        <span className="font-semibold text-text-title">Want to track this ticket?</span>{" "}
                        Login or create a free account to view your ticket status and our team's responses in your personal dashboard.
                      </p>
                    </div>

                    {/* CTAs — always shown regardless of session state */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/login"
                        state={{ from: "/dashboard/tickets" }}
                        className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                      >
                        <LogIn className="h-4 w-4" />
                        Login to Track Ticket
                      </Link>
                      <Link
                        to="/register"
                        className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                      >
                        <UserPlus className="h-4 w-4" />
                        Create a Free Account
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSubmittedTicket(null);
                        setForm({ name: "", email: "", message: "" });
                        setSubject("support");
                      }}
                      className="mt-3 text-xs text-text-muted underline underline-offset-2 hover:text-text-title transition"
                    >
                      Submit another ticket
                    </button>
                  </div>
                ) : (
                  /* ─── Form State ─── */
                  <>
                    <div className="flex items-center gap-3">
                      <div className="icon-box">
                        <MessageSquare className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-text-title">
                          Send a message
                        </p>
                        <p className="text-sm text-text-body">
                          The more detail you provide, the faster we can help.
                        </p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mt-7">
                      <p className="text-sm font-semibold text-text-title">Subject</p>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {subjects.map((s) => {
                          const active = subject === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSubject(s.id)}
                              className={[
                                "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left shadow-card transition",
                                active
                                  ? "border-brand-blue/40 bg-white"
                                  : "border-border bg-white/70 hover:bg-white",
                              ].join(" ")}
                            >
                              <div className="icon-box mt-0.5">{s.icon}</div>
                              <div className="min-w-0">
                                <p className="text-sm font-extrabold text-text-title">
                                  {s.label}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-text-body">
                                  {s.hint}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fields */}
                    <form onSubmit={handleSubmit}>
                      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm font-semibold text-text-title">
                            Full Name <span className="text-status-error">*</span>
                          </span>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleField("name", e.target.value)}
                            placeholder="Enter your full name"
                            className={`mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-text-title shadow-card outline-none transition focus:border-brand-blue/40 ${errors.name ? "border-status-error" : "border-border"}`}
                          />
                          {errors.name && <p className="mt-1 text-xs text-status-error">{errors.name}</p>}
                        </label>

                        <label className="block">
                          <span className="text-sm font-semibold text-text-title">
                            Email <span className="text-status-error">*</span>
                          </span>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleField("email", e.target.value)}
                            placeholder="you@example.com"
                            className={`mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-text-title shadow-card outline-none transition focus:border-brand-blue/40 ${errors.email ? "border-status-error" : "border-border"}`}
                          />
                          {errors.email && <p className="mt-1 text-xs text-status-error">{errors.email}</p>}
                        </label>

                        <label className="block sm:col-span-2">
                          <span className="text-sm font-semibold text-text-title">
                            Message <span className="text-status-error">*</span>
                          </span>
                          <textarea
                            rows={6}
                            value={form.message}
                            onChange={(e) => handleField("message", e.target.value)}
                            placeholder="Write your message... (Include steps, screenshots info, module name, what you expected vs what happened, etc.)"
                            className={`mt-2 w-full resize-none rounded-2xl border bg-white/80 px-4 py-3 text-sm text-text-title shadow-card outline-none transition focus:border-brand-blue/40 ${errors.message ? "border-status-error" : "border-border"}`}
                          />
                          {errors.message && <p className="mt-1 text-xs text-status-error">{errors.message}</p>}
                        </label>
                      </div>

                      {/* CTA */}
                      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted">
                          <Mail className="h-4 w-4 text-brand-blue" />
                          Or email:{" "}
                          <span className="text-text-title">
                            studexaai.support@gmail.com
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Send Message <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <div className="card rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="icon-box">
                    <HelpCircle className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-text-title">FAQs</p>
                    <p className="text-sm text-text-body">Quick answers to common issues.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {faqs.map((f, idx) => {
                    const open = faqOpen === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFaqOpen(open ? -1 : idx)}
                        className="w-full rounded-2xl border border-border bg-white/70 px-5 py-4 text-left shadow-card transition hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="icon-box mt-0.5">{f.icon}</div>
                            <div>
                              <p className="text-sm font-extrabold text-text-title">{f.q}</p>
                              {open && (
                                <p className="mt-2 text-sm leading-relaxed text-text-body">
                                  {f.a}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-text-muted">
                            {open ? "Hide" : "View"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card">
                  <p className="text-sm font-extrabold text-text-title">Still stuck?</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-body">
                    Send a message with your exact module + steps. We'll investigate and help you quickly.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/privacy-policy"
                      className="btn-secondary inline-flex flex-1 items-center justify-center px-5 py-3 text-sm font-semibold"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms"
                      className="btn-secondary inline-flex flex-1 items-center justify-center px-5 py-3 text-sm font-semibold"
                    >
                      Terms
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
