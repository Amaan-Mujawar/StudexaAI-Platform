// src/pages/Landing/UseCasesPage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  ListChecks,
  NotebookPen,
  Brain,
  Sigma,
  Puzzle,
  BookOpen,
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

const useCases = [
  {
    title: "AI TODO",
    desc: "Convert goals into a structured daily task plan instantly.",
    to: "/use-cases/ai-todo",
    icon: <ListChecks className="h-5 w-5 text-brand-blue" />,
    badge: "Plan",
  },
  {
    title: "AI Note",
    desc: "Generate topic-based notes to learn faster and revise anytime.",
    to: "/use-cases/ai-note",
    icon: <NotebookPen className="h-5 w-5 text-brand-blue" />,
    badge: "Learn",
  },
  {
    title: "AI Quiz",
    desc: "Test instantly with unique quizzes — no repeated questions ever.",
    to: "/use-cases/ai-quiz",
    icon: <Brain className="h-5 w-5 text-brand-blue" />,
    badge: "Practice",
  },
  {
    title: "Aptitude",
    desc: "Placement-ready aptitude rounds with review and progress history.",
    to: "/use-cases/aptitude",
    icon: <Sigma className="h-5 w-5 text-brand-blue" />,
    badge: "Interview",
  },
  {
    title: "Logical Reasoning",
    desc: "Interview-style reasoning practice with smart attempt structure.",
    to: "/use-cases/logical-reasoning",
    icon: <Puzzle className="h-5 w-5 text-brand-blue" />,
    badge: "Reason",
  },
  {
    title: "Verbal Reasoning",
    desc: "Reading + inference + completion practice — built for clarity.",
    to: "/use-cases/verbal-reasoning",
    icon: <BookOpen className="h-5 w-5 text-brand-blue" />,
    badge: "Communicate",
  },
];

const UseCasesPage = () => {
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
              Use Cases
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              One platform. Multiple workflows.
              <span className="block text-brand-blue">All connected.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body sm:text-lg"
            >
              StudexaAI is built to remove fragmented learning workflows by
              unifying planning, learning, revision, and daily interview practice
              into one loop — without repetition.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-7 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-border bg-white/70 px-5 py-4 text-left shadow-card backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="icon-box mt-0.5">
                    <Layers className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-text-title">
                      A library of workflows
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-body">
                      Modular use cases designed to fit both students and working
                      professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 px-5 py-4 text-left shadow-card backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="icon-box mt-0.5">
                    <Zap className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-text-title">
                      Start instantly
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-body">
                      Jump into a module and begin in seconds — no setup
                      friction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 px-5 py-4 text-left shadow-card backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="icon-box mt-0.5">
                    <ShieldCheck className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-text-title">
                      Repeat-proof practice
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-body">
                      Fresh attempts, meaningful revision, real improvement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Use Cases Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-14 max-w-6xl"
          >
            <motion.div
              variants={fadeUp}
              className="card overflow-hidden rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-muted">
                    StudexaAI Use Cases
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-title sm:text-3xl">
                    Choose your starting point
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-body sm:text-base">
                    Each use case is designed like a building block in the same
                    learning ecosystem: Plan → Learn → Practice → Review → Improve.
                  </p>
                </div>

                <Link
                  to="/"
                  className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
                >
                  Back to Home <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {useCases.map((uc) => (
                  <Link
                    key={uc.title}
                    to={uc.to}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-card transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-border-soft hover:shadow-card-hover"
                  >
                    {/* glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100">
                      <div className="absolute left-1/2 top-[-120px] h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-brand-cyan/15 blur-3xl" />
                    </div>

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="icon-box">{uc.icon}</div>
                        <div>
                          <h3 className="text-base font-extrabold text-text-title">
                            {uc.title}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-text-muted">
                            {uc.badge}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-border bg-surface-page px-3 py-1 text-xs font-semibold text-text-muted transition group-hover:border-border-soft group-hover:text-text-title">
                        Open →
                      </span>
                    </div>

                    <p className="relative z-10 mt-3 text-sm leading-relaxed text-text-body">
                      {uc.desc}
                    </p>

                    <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-semibold text-text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue/60" />
                      Built for daily consistency
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                >
                  Need help choosing? Contact Us
                </Link>
                <Link
                  to="/privacy-policy"
                  className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* visible structure line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default UseCasesPage;
