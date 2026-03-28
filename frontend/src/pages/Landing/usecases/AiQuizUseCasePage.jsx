// src/pages/Landing/usecases/AiQuizUseCasePage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Brain,
  Zap,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
  RefreshCcw,
  Lock,
  BookOpen,
  BarChart3,
  LogIn,
  UserPlus,
} from "lucide-react";

import LandingNavbar from "../../../components/landing/LandingNavbar.jsx";
import FooterSection from "../../../components/landing/sections/FooterSection.jsx";

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

const pillars = [
  {
    title: "Unique questions every attempt",
    desc: "StudexaAI enforces non-repetition so practice stays meaningful.",
    icon: <RefreshCcw className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Instant testing after learning",
    desc: "Turn concepts into confidence with quiz-first learning loops.",
    icon: <Zap className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Built for interview readiness",
    desc: "Practice like real rounds: focused topics, scoring, review & improve.",
    icon: <Trophy className="h-5 w-5 text-brand-blue" />,
  },
];

const highlights = [
  {
    title: "Repeat-proof integrity",
    desc: "No recycled questions. Every attempt stays fresh.",
    icon: <Lock className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Explanations + learning continuation",
    desc: "Review answers with clear explanations after completion.",
    icon: <BookOpen className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Attempt history saved",
    desc: "Every attempt is tracked so your progress becomes measurable.",
    icon: <BarChart3 className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Smart topic-level testing",
    desc: "Test understanding instantly on any topic you choose.",
    icon: <Target className="h-5 w-5 text-brand-blue" />,
  },
];

const sampleFlow = [
  "Choose a topic (ex: DBMS, React, Operating Systems)",
  "Generate quiz instantly (fresh question set)",
  "Attempt under focus mode",
  "See score + explanations",
  "Reattempt later with new questions",
];

const AiQuizUseCasePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <LandingNavbar />

      <main className="relative w-full">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-ai-glow opacity-55" />
          <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-cyan/20 blur-3xl glow-pulse" />
          <div className="absolute right-[-260px] top-[120px] h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-260px] left-[-260px] h-[520px] w-[520px] rounded-full bg-brand-blue/8 blur-3xl" />
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
              Use Case • StudexaAI
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              AI Quiz
              <span className="block text-brand-blue">
                Practice that never becomes repetitive.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body sm:text-lg"
            >
              Most quiz apps fail because they reuse the same questions again and
              again — making practice lose its value. StudexaAI fixes this with a
              strict rule:
              <span className="font-semibold text-text-title">
                {" "}
                questions must not repeat across attempts.
              </span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                Repeat-proof practice
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <Brain className="h-4 w-4 text-brand-blue" />
                Learning → Testing loop
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <BadgeCheck className="h-4 w-4 text-brand-blue" />
                Interview-grade rounds
              </span>
            </motion.div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-14 max-w-6xl"
          >
            <motion.div
              variants={fadeUp}
              className="card relative overflow-hidden rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute left-1/2 top-[-140px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-brand-cyan/15 blur-3xl" />
              </div>

              <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left */}
                <div className="lg:col-span-7">
                  <p className="text-sm font-semibold text-text-muted">
                    Why AI Quiz exists
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                    Fresh attempts. Real improvement. No repetition.
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-text-body sm:text-base">
                    StudexaAI AI Quiz is built for consistent learners — because
                    consistency needs quality practice. With attempt lifecycle +
                    history + explanations, every session becomes a step forward.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {pillars.map((p) => (
                      <div
                        key={p.title}
                        className="rounded-2xl border border-border bg-white/70 px-4 py-4 shadow-card backdrop-blur-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="icon-box mt-0.5">{p.icon}</div>
                          <div>
                            <p className="text-sm font-extrabold text-text-title">
                              {p.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-text-body">
                              {p.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/use-cases"
                      className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                    >
                      Explore all Use Cases <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to="/contact"
                      className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                {/* Right */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-card backdrop-blur-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-text-title">
                          Sample flow
                        </p>
                        <p className="mt-1 text-xs font-semibold text-text-muted">
                          How a quiz attempt works
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-page px-3 py-1 text-xs font-semibold text-text-muted">
                        <Target className="h-4 w-4 text-brand-blue" />
                        Flow
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {sampleFlow.map((line) => (
                        <div
                          key={line}
                          className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-card"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-blue" />
                          <p className="text-sm font-semibold text-text-title">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-border bg-white px-5 py-4 shadow-card">
                      <div className="flex items-start gap-3">
                        <div className="icon-box mt-0.5">
                          <Trophy className="h-5 w-5 text-brand-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-text-title">
                            Designed for real rounds
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-text-body">
                            The system supports attempt integrity + review, so
                            your improvement becomes trackable and repeatable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-white/70 px-5 py-4 text-sm font-semibold text-text-body shadow-card backdrop-blur-xl">
                    <span className="text-text-muted">Rule:</span>{" "}
                    <span className="text-text-title">
                      Questions must not repeat across attempts
                    </span>
                  </div>
                </div>
              </div>

              {/* visible structure line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
            </motion.div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-10 max-w-6xl"
          >
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="rounded-2xl border border-border bg-white/80 p-5 shadow-card backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="icon-box mt-0.5">{h.icon}</div>
                    <div>
                      <p className="text-sm font-extrabold text-text-title">
                        {h.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-body">
                        {h.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white/70 px-6 py-5 text-center shadow-card backdrop-blur-xl sm:flex-row sm:text-left"
            >
              <div className="flex items-start gap-3">
                <div className="icon-box mt-0.5">
                  <Sparkles className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-text-title">
                    Want to try AI Quiz right now?
                  </p>
                  <p className="mt-1 text-sm text-text-body">
                    Create a free account and start repeat-proof practice.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  to="/signup"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  <UserPlus className="h-4 w-4" />
                  Create a Free Account
                </Link>

                <Link
                  to="/login"
                  className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default AiQuizUseCasePage;
