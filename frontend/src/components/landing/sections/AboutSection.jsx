// src/components/landing/sections/AboutSection.jsx

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Sparkles,
} from "lucide-react";

const easePremium = [0.2, 0.8, 0.2, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const CARD_CLASS =
  "group relative flex min-h-[150px] flex-col justify-between rounded-xl border border-border bg-white/90 p-5 shadow-card backdrop-blur-xl transition-all duration-300";

const AboutSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const hoverLift = prefersReducedMotion
    ? undefined
    : {
        y: -4,
        boxShadow: "0 14px 40px rgba(83,181,255,0.22)",
      };

  const inViewFocus = prefersReducedMotion
    ? undefined
    : {
        scale: 1.01,
        transition: { duration: 0.35, ease: easePremium },
      };

  return (
    <section id="about" className="relative w-full overflow-hidden bg-white">
      {/* ambient animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-[-200px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-240px] right-[-160px] h-[440px] w-[440px] rounded-full bg-brand-blue/5 blur-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-14 lg:grid-cols-2">
          {/* LEFT — feature loop stack */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="relative order-2 flex flex-col gap-5 lg:order-1"
          >
            {/* visible connector (all screens) */}
            <div className="pointer-events-none absolute left-5 top-4 h-[calc(100%-32px)] w-[2px] rounded-full bg-gradient-to-b from-brand-blue/50 via-brand-cyan/50 to-transparent opacity-80" />

            {/* animated draw overlay */}
            <motion.div
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease: easePremium }}
              className="pointer-events-none absolute left-5 top-4 h-[calc(100%-32px)] w-[2px] origin-top rounded-full bg-gradient-to-b from-brand-blue/70 via-brand-cyan/70 to-transparent blur-[0.3px]"
            />

            {/* Card 1 */}
            <motion.div
              variants={fadeUp}
              whileInView={inViewFocus}
              whileHover={hoverLift}
              className={CARD_CLASS}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="icon-box">
                    <Target className="h-5 w-5 text-brand-blue" />
                  </div>
                  <span className="absolute -inset-2 rounded-full bg-brand-blue/10 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-text-title">
                    Plan with clarity
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-body">
                    Build a daily study rhythm using smart tasks and structured
                    flows, not random motivation.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-brand-blue/80" />
                Structured daily flow
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp}
              whileInView={inViewFocus}
              whileHover={hoverLift}
              className={CARD_CLASS}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="icon-box">
                    <BookOpen className="h-5 w-5 text-brand-blue" />
                  </div>
                  <span className="absolute -inset-2 rounded-full bg-brand-cyan/10 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-text-title">
                    Learn smarter
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-body">
                    Convert topics and todos into clean AI notes and
                    revision-friendly explanations.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-brand-cyan/80" />
                AI notes + revision
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp}
              whileInView={inViewFocus}
              whileHover={hoverLift}
              className={CARD_CLASS}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="icon-box">
                    <Brain className="h-5 w-5 text-brand-blue" />
                  </div>
                  <span className="absolute -inset-2 rounded-full bg-status-success/10 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-text-title">
                    Practice without repetition
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-body">
                    Quiz + practice modules ensure uniqueness and continuous
                    improvement over time.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-status-success" />
                Never repeated questions
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — narrative block (UNCHANGED) */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="order-1 flex flex-col justify-center lg:order-2"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              About StudexaAI
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="relative mt-4 text-3xl font-extrabold tracking-tight text-text-title sm:text-4xl"
            >
              A complete loop for disciplined learning + productivity
              <span className="absolute -bottom-1 left-0 h-[5px] w-full bg-brand-cyan/20 blur-md" />
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-relaxed text-text-body"
            >
              StudexaAI exists because most learners struggle with planning,
              consistency, revision, and interview practice — especially when
              practice systems keep repeating questions. StudexaAI fixes this by
              making learning structured, fast, and repeatable daily.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-center gap-3 text-sm font-semibold text-text-muted"
            >
              {["Plan", "Learn", "Practice"].map((step, i) => (
                <motion.span
                  key={step}
                  initial={{ opacity: 0.4 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      i === 0 && "bg-brand-blue",
                      i === 1 && "bg-brand-cyan",
                      i === 2 && "bg-status-success",
                    ].join(" ")}
                  />
                  {step}
                  {i < 2 && <span className="ml-2 opacity-40">→</span>}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7">
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { y: 0 }}
                transition={{ duration: 0.18, ease: easePremium }}
                className="inline-flex group"
              >
                <Link
                  to="/about"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold focus-visible:ring-4 focus-visible:ring-brand-cyan/25"
                >
                  Explore About Us
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl transition-all hover:-translate-y-0.5">
                <span className="h-2 w-2 rounded-full bg-brand-blue/80" />
                Built for discipline
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl transition-all hover:-translate-y-0.5">
                <span className="h-2 w-2 rounded-full bg-brand-cyan/80" />
                Fast + revision-friendly
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
