// src/pages/UserDashboard/NewTicketPage.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  MessageSquare,
  Lightbulb,
  Bug,
  HelpCircle,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  User,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { submitAuthenticatedTicket } from "../../api/ticketsApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

/* ─── Animation Variants ──────────────────────────────────── */
const easePremium = [0.2, 0.8, 0.2, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easePremium },
  },
};

/* ─── Subject Options ─────────────────────────────────────── */
const SUBJECTS = [
  {
    id: "suggestion",
    label: "Suggestion / Idea",
    icon: Lightbulb,
    hint: "Help us improve StudexaAI's learning loop.",
    color: "text-amber-600",
    activeBorder: "border-amber-400/60 bg-amber-50/40",
  },
  {
    id: "bug",
    label: "Report a Bug",
    icon: Bug,
    hint: "Spotted something broken? Tell us the exact steps.",
    color: "text-red-600",
    activeBorder: "border-red-400/60 bg-red-50/40",
  },
  {
    id: "support",
    label: "Support / Help",
    icon: HelpCircle,
    hint: "Need help understanding a feature or module?",
    color: "text-brand-blue",
    activeBorder: "border-brand-blue/40 bg-brand-blue/5",
  },
  {
    id: "privacy",
    label: "Delete Account / Data",
    icon: Trash2,
    hint: "Request account deletion or full data removal.",
    color: "text-purple-600",
    activeBorder: "border-purple-400/60 bg-purple-50/40",
  },
];

/* ─── Main Component ──────────────────────────────────────── */
const NewTicketPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subject, setSubject] = useState("support");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  /* Pre-fill from authenticated user — non-editable */
  const userName = user?.name || "";
  const userEmail = user?.email || "";

  const canSubmit = useMemo(
    () => message.trim().length >= 10,
    [message]
  );

  /* After success: brief delay then navigate to ticket list */
  useEffect(() => {
    if (!submitted || !submittedTicket) return;
    const t = setTimeout(() => {
      navigate("/dashboard/tickets", {
        replace: true,
        state: { newTicketNumber: submittedTicket.ticketNumber },
      });
    }, 2800);
    return () => clearTimeout(t);
  }, [submitted, submittedTicket, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setMessageError("Please describe your issue.");
      return;
    }
    if (message.trim().length < 10) {
      setMessageError("Message is too short — add more detail.");
      return;
    }

    setMessageError("");
    setSubmitting(true);

    try {
      const result = await submitAuthenticatedTicket({
        name: userName,
        email: userEmail,
        subject,
        message: message.trim(),
      });
      setSubmittedTicket(result.ticket);
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Success Banner (shown in-place, then auto-redirects) ─ */
  if (submitted && submittedTicket) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-green-200 bg-green-50 shadow-card">
          <div className="flex flex-col items-center py-14 px-6 text-center">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-green-200 bg-white">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700">
              <Ticket className="h-4 w-4 text-green-600" />
              Support
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
              Ticket Submitted!
            </h1>
            <p className="mt-2 max-w-sm text-sm text-text-body">
              Your support request has been received. We'll reply to{" "}
              <span className="font-semibold text-text-title">{userEmail}</span>.
            </p>

            {/* Ticket badge */}
            <div className="mt-6 rounded-2xl border border-green-200 bg-white px-8 py-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Ticket className="h-4 w-4 text-green-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Ticket Number
                </span>
              </div>
              <p className="text-xl font-extrabold text-green-700">
                {submittedTicket.ticketNumber}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Status: Open — in our queue
              </p>
            </div>

            <p className="mt-6 text-xs text-text-muted">
              Redirecting to My Tickets in a moment…
            </p>

            {/* Manual nav fallback */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/dashboard/tickets", { replace: true })}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                <Ticket className="h-4 w-4" />
                View My Tickets
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedTicket(null);
                  setMessage("");
                  setSubject("support");
                }}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Form View ─────────────────────────────────────────── */
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.section variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                  <Ticket className="h-4 w-4 text-brand-blue" />
                  Support
                </div>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                  New Support Ticket
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                  Describe your issue in detail and we'll get back to you.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/tickets")}
                className="btn-secondary inline-flex w-fit items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Form Card */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
          <div className="p-6 sm:p-8">

            {/* Who's submitting — locked to logged-in user */}
            <div className="mb-7 rounded-2xl border border-border bg-surface-page px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Submitting as
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <User className="h-4 w-4 text-text-muted shrink-0" />
                  <span className="text-sm font-semibold text-text-title truncate">
                    {userName}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <Mail className="h-4 w-4 text-text-muted shrink-0" />
                  <span className="text-sm font-semibold text-text-title truncate">
                    {userEmail}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Ticket will be linked to your account and appear in My Tickets.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Subject Selector */}
              <div>
                <p className="text-sm font-semibold text-text-title mb-3">
                  Subject <span className="text-status-error">*</span>
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SUBJECTS.map((s) => {
                    const Icon = s.icon;
                    const isActive = subject === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSubject(s.id)}
                        className={[
                          "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                          isActive
                            ? s.activeBorder
                            : "border-border bg-white/70 hover:bg-white",
                        ].join(" ")}
                      >
                        <div className="icon-box mt-0.5 shrink-0">
                          <Icon className={`h-4 w-4 ${s.color}`} />
                        </div>
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

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-text-title">
                  Message <span className="text-status-error">*</span>
                </label>
                <textarea
                  rows={7}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (messageError) setMessageError("");
                  }}
                  placeholder="Describe your issue in detail — include the module name, steps taken, what you expected vs what happened, any error messages, etc."
                  className={`mt-2 w-full resize-none rounded-2xl border bg-white/80 px-4 py-3 text-sm text-text-title shadow-card outline-none transition focus:border-brand-blue/40 ${
                    messageError ? "border-status-error" : "border-border"
                  }`}
                />
                {messageError && (
                  <p className="mt-1 text-xs text-status-error">{messageError}</p>
                )}
                <p className="mt-1 text-xs text-text-muted">
                  The more detail you provide, the faster we can help.{" "}
                  <span className={message.trim().length < 10 && message.length > 0 ? "text-status-error font-semibold" : "text-text-muted"}>
                    ({message.trim().length} chars{message.trim().length < 10 ? `, need ${10 - message.trim().length} more` : ""})
                  </span>
                </p>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/tickets")}
                  className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !canSubmit}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Info note */}
      <motion.section variants={fadeUp}>
        <div className="rounded-2xl border border-border bg-white/60 px-5 py-4 shadow-card backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-text-title">
                What happens after you submit?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-body">
                Your ticket will appear in{" "}
                <span className="font-semibold text-text-title">My Tickets</span>{" "}
                with a unique ticket number. Our team will review it and respond to{" "}
                <span className="font-semibold text-text-title">{userEmail}</span>.
                You can also reach us directly at{" "}
                <span className="font-semibold text-text-title">
                  studexaai.support@gmail.com
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default NewTicketPage;
