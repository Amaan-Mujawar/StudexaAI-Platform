// src/components/landing/sections/VisionToVictorySection.jsx

import { motion, useReducedMotion } from "framer-motion";
import { Flag, Rocket, Trophy, Sparkles } from "lucide-react";

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

const VisionToVictorySection = () => {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      title: "Vision",
      desc: "Start with a clear goal: syllabus completion, exam prep, placement readiness, or daily consistency.",
      Icon: Flag,
      glow: "bg-brand-cyan/10",
      dot: "bg-brand-cyan",
    },
    {
      title: "Execution",
      desc: "Convert goals into tasks (AI TODO), learn with notes (AI Note), and practice daily with quizzes and reasoning modules.",
      Icon: Rocket,
      glow: "bg-brand-blue/10",
      dot: "bg-brand-blue",
    },
    {
      title: "Victory",
      desc: "Review explanations, track score history, fix weak areas — and repeat daily until your results become inevitable.",
      Icon: Trophy,
      glow: "bg-brand-cyan/10",
      dot: "bg-status-success",
    },
  ];

  const hoverLift = prefersReducedMotion
    ? undefined
    : {
        y: -4,
        boxShadow: "0 18px 55px rgba(83,181,255,0.18)",
      };

  const inViewFocus = prefersReducedMotion
    ? undefined
    : {
        scale: 1.01,
        transition: { duration: 0.35, ease: easePremium },
      };

  return (
    <section
      id="vision-to-victory"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* premium ambient background (different from UseCases but same family) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.15, ease: "easeOut" }}
          className="absolute left-[-220px] top-[-220px] h-[560px] w-[560px] rounded-full bg-brand-blue/5 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.25, ease: "easeOut", delay: 0.12 }}
          className="absolute bottom-[-280px] right-[-180px] h-[520px] w-[520px] rounded-full bg-brand-cyan/10 blur-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        {/* Header */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* ✅ premium pill */}
          <motion.div
            variants={fadeUp}
            className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-brand-blue" />
            From Vision to Victory
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-bold tracking-tight text-text-title sm:text-4xl"
          >
            Your growth becomes predictable when the system is strong.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-text-body"
          >
            Motivation fades. StudexaAI helps you win with structure — by turning
            goals into action, action into learning, and learning into results.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative mt-10"
        >
          {/* ✅ subtle connector line behind cards */}
          <div className="pointer-events-none absolute left-0 right-0 top-[38px] hidden lg:block">
            <div className="mx-auto h-[2px] w-[88%] rounded-full bg-gradient-to-r from-transparent via-brand-blue/25 to-transparent" />
            <div className="mx-auto mt-1 h-px w-[72%] rounded-full bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent opacity-70" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:place-items-center">
            {steps.map((step) => {
              const Icon = step.Icon;

              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  whileInView={inViewFocus}
                  whileHover={hoverLift}
                  className="h-full w-full"
                >
                  <div
                    className={[
                      "group relative h-full w-full overflow-hidden rounded-2xl",
                      "border border-border bg-white/90 shadow-card backdrop-blur-xl",
                      "transition-all duration-300",
                      "hover:border-brand-blue/25",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
                    ].join(" ")}
                  >
                    {/* subtle premium glow (unique soft style) */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div
                        className={[
                          "absolute left-[-120px] top-[-160px] h-[320px] w-[320px] rounded-full blur-3xl",
                          step.glow,
                        ].join(" ")}
                      />
                      <div className="absolute right-[-140px] bottom-[-160px] h-[320px] w-[320px] rounded-full bg-white/30 blur-3xl" />
                    </div>

                    {/* premium sheen */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -left-14 top-[-90px] h-[220px] w-[220px] rotate-12 rounded-full bg-white/40 blur-2xl" />
                    </div>

                    <div className="relative p-6 text-center">
                      <div className="flex items-start justify-between gap-4">
                        <motion.div
                          whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                          transition={{ duration: 0.2, ease: easePremium }}
                          className="relative mx-auto"
                        >
                          <div className="icon-box transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
                            <Icon className="h-6 w-6 text-brand-blue" />
                          </div>

                          {/* icon glow */}
                          <span
                            aria-hidden
                            className={[
                              "pointer-events-none absolute -inset-2 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                              step.glow,
                            ].join(" ")}
                          />
                        </motion.div>

                        {/* micro status dot */}
                        <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-text-muted">
                          <span
                            className={[
                              "h-2.5 w-2.5 rounded-full",
                              step.dot,
                              "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                            ].join(" ")}
                          />
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-text-title">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-text-body">
                        {step.desc}
                      </p>
                    </div>

                    {/* visible card outline structure */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />

                    {/* hover ring edge */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-brand-blue/12" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionToVictorySection;
