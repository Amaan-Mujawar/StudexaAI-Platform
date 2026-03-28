// src/pages/Landing/usecases/AiNoteUseCasePage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Sparkles,
  NotebookPen,
  Brain,
  Wand2,
  Layers,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  FileText,
  Zap,
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
    title: "Generate notes from any topic",
    desc: "Type a topic and instantly get structured notes built for revision.",
    icon: <Wand2 className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Convert your Todos into notes",
    desc: "Turn tasks into learning content — no workflow break, no confusion.",
    icon: <Layers className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Revise faster, remember longer",
    desc: "Designed for consistency, not just information dumping.",
    icon: <Brain className="h-5 w-5 text-brand-blue" />,
  },
];

const highlights = [
  {
    title: "Exam + interview ready format",
    desc: "Clear headings, short points, and focused structure for retention.",
    icon: <BadgeCheck className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Revision-first system",
    desc: "Notes stay saved for review — building a clean revision cycle.",
    icon: <BookOpen className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Less time, more clarity",
    desc: "No digging through unlimited resources just to start learning.",
    icon: <Lightbulb className="h-5 w-5 text-brand-blue" />,
  },
  {
    title: "Connected with Quiz flow",
    desc: "Learn → test instantly using AI Quiz & practice modules.",
    icon: <Zap className="h-5 w-5 text-brand-blue" />,
  },
];

const sampleOutline = [
  " Key definitions (simple + clear)",
  " Core concepts with examples",
  " Mini summary for last-minute revision",
  " Common pitfalls / confusion points",
];

const AiNoteUseCasePage = () => {
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
              Use Case • StudexaAI
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              AI Note
              <span className="block text-brand-blue">
                Learn faster. Revise smarter.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body sm:text-lg"
            >
              Most learners have unlimited resources — but no revision system.
              StudexaAI fixes this by generating structured notes that stay saved
              and connect directly with quizzes and practice.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                Revision-first
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <NotebookPen className="h-4 w-4 text-brand-blue" />
                AI-generated notes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl">
                <FileText className="h-4 w-4 text-brand-blue" />
                Saved for review
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
                    Why AI Note exists
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                    Notes that actually help you revise — not just read.
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-text-body sm:text-base">
                    AI Note solves broken revision cycles. Your notes are
                    structured, saved, and connected — so you can revise anytime
                    and instantly test yourself using AI Quiz and Practice.
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
                          Sample structure
                        </p>
                        <p className="mt-1 text-xs font-semibold text-text-muted">
                          Notes made for revision
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-page px-3 py-1 text-xs font-semibold text-text-muted">
                        <BookOpen className="h-4 w-4 text-brand-blue" />
                        Outline
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {sampleOutline.map((line) => (
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
                          <Layers className="h-5 w-5 text-brand-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-text-title">
                            Part of the StudexaAI loop
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-text-body">
                            Notes are connected with Todos and Quizzes — helping
                            you learn, practice, review, and improve daily.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-white/70 px-5 py-4 text-sm font-semibold text-text-body shadow-card backdrop-blur-xl">
                    <span className="text-text-muted">Loop:</span>{" "}
                    <span className="text-text-title">
                      Plan → Learn → Practice → Review → Improve
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
                    Ready to generate your first AI Note?
                  </p>
                  <p className="mt-1 text-sm text-text-body">
                    Create a free account and start building a revision system.
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

export default AiNoteUseCasePage;
