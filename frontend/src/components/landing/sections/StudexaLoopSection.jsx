// src/components/landing/sections/StudexaLoopSection.jsx

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  RefreshCw,
  Target,
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

const StudexaLoopSection = () => {
  const steps = [
    {
      title: "Plan",
      desc: "Create tasks and organize your day with clarity.",
      icon: ClipboardList,
    },
    {
      title: "Learn",
      desc: "Turn topics and goals into notes for quick revision.",
      icon: BookOpen,
    },
    {
      title: "Practice",
      desc: "Solve quizzes and reasoning rounds — unique every time.",
      icon: Target,
    },
    {
      title: "Review",
      desc: "Understand mistakes using explanations and answer review.",
      icon: CalendarCheck,
    },
    {
      title: "Improve",
      desc: "Strengthen weak areas and repeat daily to level up.",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="studexa-loop" className="relative w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-brand-blue" />
            StudexaAI complete loop
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-bold tracking-tight text-text-title sm:text-4xl"
          >
            Plan → Learn → Practice → Review → Improve → Repeat daily
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-text-body"
          >
            This isn’t a “feature list”. It’s a learning system. StudexaAI is
            designed to keep you consistent and interview-ready with a daily
            improvement loop.
          </motion.p>
        </motion.div>

        {/* Loop steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={{ delay: idx * 0.03 }}
                className="relative"
              >
                <div className="card h-full p-6 text-center">
                  <div className="flex justify-center">
                    <div className="icon-box">
                      <Icon className="h-6 w-6 text-brand-blue" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-text-title">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-body">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow indicator (desktop) — no circle */}
                {idx !== steps.length - 1 ? (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:flex">
                    <ArrowRight className="h-5 w-5 text-text-title/70" />
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Placeholder for later premium animated loop */}
        {/* ✅ REMOVED as requested */}
      </div>
    </section>
  );
};

export default StudexaLoopSection;
