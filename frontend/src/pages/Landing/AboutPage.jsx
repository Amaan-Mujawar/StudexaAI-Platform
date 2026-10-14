// src/pages/Landing/AboutPage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Target,
  Brain,
  Rocket,
  ShieldCheck,
  Layers,
  RefreshCw,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";

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

const AboutPage = () => {
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
          <div className="absolute right-[-240px] top-[160px] h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-240px] left-[-240px] h-[520px] w-[520px] rounded-full bg-brand-blue/8 blur-3xl" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20"
        >
          {/* HERO */}
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
              About StudexaAI
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              A unified learning system built for{" "}
              <span className="text-brand-blue">consistency</span>,{" "}
              <span className="text-brand-blue">revision</span>, and{" "}
              <span className="text-brand-blue">interview-grade practice</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body sm:text-lg"
            >
              StudexaAI exists because learners today don’t lack resources — they
              lack structure. We bridge the gap between planning and preparation
              by connecting workflows into one loop:
              <span className="font-semibold text-text-title">
                {" "}
                Plan → Learn → Practice → Review → Improve.
              </span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                to="/use-cases"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                Explore Use Cases <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl"
            >
              <ShieldCheck className="h-4 w-4 text-brand-blue" />
              Built for students + working professionals
            </motion.div>
          </motion.div>

          {/* VALUE STRIP */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: <Target className="h-5 w-5 text-brand-blue" />,
                title: "Vision",
                desc: "Make structured learning effortless — for anyone who wants progress.",
              },
              {
                icon: <Rocket className="h-5 w-5 text-brand-blue" />,
                title: "Mission",
                desc: "Unify productivity + learning + practice into one repeatable daily workflow.",
              },
              {
                icon: <Layers className="h-5 w-5 text-brand-blue" />,
                title: "What we solve",
                desc: "Disorganized learning, broken revision cycles, and repetitive practice.",
              },
              {
                icon: <RefreshCw className="h-5 w-5 text-brand-blue" />,
                title: "Core loop",
                desc: "Plan → Learn → Practice → Review → Improve → Repeat daily.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="card group rounded-2xl border border-border bg-white/80 p-5 shadow-card backdrop-blur-xl transition hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="icon-box">{item.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-text-title">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-body">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* MAIN STORY */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Left: narrative */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-7"
            >
              <div className="card overflow-hidden rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
                <div className="prose prose-slate max-w-none">
                  <h2 className="text-2xl font-extrabold text-text-title">
                    Why StudexaAI exists
                  </h2>

                  <p className="text-text-body">
                    Today, learners have unlimited resources — YouTube,
                    documentation, courses, books, and AI tools. But most still
                    struggle with the real problem:
                    <span className="font-semibold text-text-title">
                      {" "}
                      planning properly, staying consistent, revising effectively,
                      and practicing in an interview-ready way.
                    </span>
                  </p>

                  <p className="text-text-body">
                    The market offers disconnected solutions:
                  </p>

                  <ul className="text-text-body">
                    <li>To-do apps for planning (but no learning connection)</li>
                    <li>AI note tools (but no structured revision loop)</li>
                    <li>MCQ systems (but often repetitive / low retention)</li>
                    <li>
                      Prep platforms that become predictable because questions
                      are reused
                    </li>
                  </ul>

                  <p className="text-text-body">
                    StudexaAI merges the best parts of all of them — into one
                    integrated system.
                  </p>

                  <h3 className="mt-8 text-xl font-bold text-text-title">
                    What makes it truly different
                  </h3>

                  <p className="text-text-body">
                    StudexaAI is built around one powerful rule:
                  </p>

                  <div className="not-prose mt-4 rounded-2xl border border-border bg-white px-5 py-4 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="icon-box">
                        <Brain className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-text-title">
                          Repeat-proof practice
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-text-body">
                          Questions must not repeat across attempts — so every
                          practice session stays fresh, meaningful, and
                          interview-grade.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-text-title">
                    Built for any learner
                  </h3>

                  <p className="text-text-body">
                    StudexaAI isn’t tied to one exam, one stream, or one career.
                    If you need any of these — StudexaAI works for you:
                  </p>

                  <ul className="text-text-body">
                    <li>workflow planning</li>
                    <li>topic learning</li>
                    <li>revision system</li>
                    <li>daily practice routines</li>
                    <li>interview preparation</li>
                  </ul>

                  <p className="mt-6 text-sm font-semibold text-text-muted">
                    Final one-liner:
                  </p>
                  <p className="text-text-body">
                    <span className="font-semibold text-text-title">
                      StudexaAI solves the problem of unstructured learning and
                      repetitive practice
                    </span>{" "}
                    by combining task planning, AI-powered learning, and fresh
                    interview-grade daily practice into one integrated platform
                    for students and working professionals.
                  </p>
                </div>

                {/* visible structure line */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
              </div>
            </motion.div>

            {/* Right: highlights */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-5"
            >
              <div className="card rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="icon-box">
                    <LineChart className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-text-title">
                      What we offer
                    </p>
                    <p className="text-sm text-text-body">
                      A single ecosystem with interconnected modules.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Todo system (Plan)",
                      desc: "Create and manage structured tasks — without scattered workflows.",
                    },
                    {
                      title: "AI Notes (Learn + Revise)",
                      desc: "Generate notes on any topic and revisit anytime.",
                    },
                    {
                      title: "AI Quiz (Test instantly)",
                      desc: "Generate quizzes for any topic to validate understanding quickly.",
                    },
                    {
                      title: "Daily Practice (Interview-grade)",
                      desc: "Aptitude + Logical Reasoning + Verbal Reasoning modules.",
                    },
                    {
                      title: "Review & History (Improve)",
                      desc: "Performance tracking, explanations, and attempt history to revise smarter.",
                    },
                  ].map((it, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card"
                    >
                      <p className="text-sm font-bold text-text-title">
                        {it.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-body">
                        {it.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/use-cases"
                    className="btn-secondary inline-flex flex-1 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
                  >
                    View Use Cases <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-primary inline-flex flex-1 items-center justify-center px-5 py-3 text-sm font-semibold"
                  >
                    Join the Community
                  </Link>
                </div>
              </div>

              {/* Micro CTA strip */}
              <motion.div
                variants={fadeUp}
                className="mt-6 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card backdrop-blur-xl"
              >
                <p className="text-sm font-semibold text-text-title">
                  Built with discipline. Built for growth.
                </p>
                <p className="mt-1 text-sm text-text-body">
                  StudexaAI is designed for people who take progress seriously —
                  and want a system that matches that mindset.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
