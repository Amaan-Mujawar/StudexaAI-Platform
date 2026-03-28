// src/components/landing/sections/UseCasesSection.jsx

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckSquare,
  FileText,
  LayoutGrid,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const easePremium = [0.2, 0.8, 0.2, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
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

const UseCasesSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const items = [
    {
      title: "AI TODO",
      desc: "Generate 3 focused tasks instantly from your goal.",
      to: "/use-cases/ai-todo",
      icon: CheckSquare,
      badge: "Productivity",
      glow: "bg-brand-blue/12",
      dot: "bg-brand-blue",
      ring: "ring-brand-blue/25",
    },
    {
      title: "AI Note",
      desc: "Turn topics or tasks into exam-ready notes with examples.",
      to: "/use-cases/ai-note",
      icon: FileText,
      badge: "Learning",
      glow: "bg-brand-cyan/15",
      dot: "bg-brand-blue",
      ring: "ring-brand-cyan/25",
    },
    {
      title: "AI Quiz",
      desc: "Generate unique quizzes with review + explanations.",
      to: "/use-cases/ai-quiz",
      icon: Sparkles,
      badge: "Practice",
      glow: "bg-brand-blue/12",
      dot: "bg-brand-cyan",
      ring: "ring-brand-blue/25",
    },
    {
      title: "Aptitude",
      desc: "Placement-style aptitude practice with results & review.",
      to: "/use-cases/aptitude",
      icon: LayoutGrid,
      badge: "Placement",
      glow: "bg-brand-cyan/15",
      dot: "bg-brand-cyan",
      ring: "ring-brand-cyan/25",
    },
    {
      title: "Logical Reasoning",
      desc: "Interview-style reasoning rounds with explanation-based learning.",
      to: "/use-cases/logical-reasoning",
      icon: Brain,
      badge: "Interview",
      glow: "bg-brand-blue/12",
      dot: "bg-status-success",
      ring: "ring-brand-blue/25",
    },
    {
      title: "Verbal Reasoning",
      desc: "Comprehension, inference, interpretation — practice smart.",
      to: "/use-cases/verbal-reasoning",
      icon: MessageSquareText,
      badge: "Interview",
      glow: "bg-brand-cyan/15",
      dot: "bg-status-success",
      ring: "ring-brand-cyan/25",
    },
  ];

  const hoverLift = prefersReducedMotion
    ? undefined
    : {
        y: -4,
        boxShadow: "0 18px 55px rgba(83,181,255,0.22)",
      };

  const inViewFocus = prefersReducedMotion
    ? undefined
    : {
        scale: 1.01,
        transition: { duration: 0.35, ease: easePremium },
      };

  return (
    <section
      id="use-cases"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* premium ambient background (same family as Hero + About) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.15, ease: "easeOut" }}
          className="absolute left-1/2 top-[-220px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.25, ease: "easeOut", delay: 0.12 }}
          className="absolute bottom-[-260px] right-[-180px] h-[460px] w-[460px] rounded-full bg-brand-blue/5 blur-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div className="max-w-2xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              Use cases
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-2 text-3xl font-bold tracking-tight text-text-title sm:text-4xl"
            >
              Built for real workflows — not just features
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-text-body"
            >
              Every module of StudexaAI supports the loop:
              <span className="font-semibold text-text-title">
                {" "}
                Plan → Learn → Practice → Review → Improve.
              </span>{" "}
              Choose what you need today and keep growing.
            </motion.p>
          </div>

          <motion.div variants={fadeUp}>
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { y: 0 }}
              transition={{ duration: 0.18, ease: easePremium }}
              className="inline-flex"
            >
              <Link
                to="/use-cases"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3"
              >
                View all use cases
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((it) => {
            const Icon = it.icon;

            return (
              <motion.div
                key={it.title}
                variants={fadeUp}
                whileInView={inViewFocus}
                whileHover={hoverLift}
                className="h-full"
              >
                <Link
                  to={it.to}
                  className={[
                    "group relative block h-full overflow-hidden rounded-2xl",
                    "border border-border bg-white/90 shadow-card backdrop-blur-xl",
                    "transition-all duration-300",
                    "hover:border-brand-blue/25",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                  ].join(" ")}
                  aria-label={`Explore ${it.title}`}
                >
                  {/* premium hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div
                      className={[
                        "absolute -left-24 top-[-140px] h-[260px] w-[260px] rounded-full blur-2xl",
                        it.glow,
                      ].join(" ")}
                    />
                    <div className="absolute -right-24 bottom-[-140px] h-[260px] w-[260px] rounded-full bg-brand-blue/8 blur-2xl" />
                  </div>

                  {/* subtle sheen */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -left-10 top-[-70px] h-[180px] w-[180px] rotate-12 rounded-full bg-white/40 blur-2xl" />
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        whileHover={
                          prefersReducedMotion ? undefined : { y: -1 }
                        }
                        transition={{ duration: 0.2, ease: easePremium }}
                        className="relative"
                      >
                        <div className="icon-box transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]">
                          <Icon className="h-6 w-6 text-brand-blue" />
                        </div>

                        {/* icon glow */}
                        <span
                          aria-hidden
                          className={[
                            "pointer-events-none absolute -inset-2 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                            it.glow,
                          ].join(" ")}
                        />
                      </motion.div>

                      <span className="badge">{it.badge}</span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-text-title">
                      {it.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-text-body">
                      {it.desc}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-text-title">
                      Explore
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </div>

                  {/* bottom outline detail (visible card structure) */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />

                  {/* focus/hover ring edge */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-brand-blue/12" />

                  {/* status dot (micro detail, adds life without clutter) */}
                  <div className="pointer-events-none absolute right-5 top-5 hidden sm:block">
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        it.dot,
                        "block opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;
