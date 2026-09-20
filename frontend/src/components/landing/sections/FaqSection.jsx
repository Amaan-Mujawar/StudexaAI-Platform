// src/components/landing/sections/FaqSection.jsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

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

const FaqSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const faqs = useMemo(
    () => [
      {
        q: "Is StudexaAI really free?",
        a: "Yes. StudexaAI is built to be free for learners. The goal is to help students and working professionals build discipline and become interview-ready without paywalls.",
      },
      {
        q: "Will questions repeat in quiz/practice modules?",
        a: "No. StudexaAI is designed to enforce uniqueness so you don’t keep solving the same repeated questions again and again.",
      },
      {
        q: "Do I need to be a topper to use this?",
        a: "Not at all. StudexaAI is made for consistency. If you can show up daily, the loop will take care of the rest.",
      },
      {
        q: "Can I use it for placement preparation?",
        a: "Yes. Logical Reasoning, Aptitude, and Verbal Reasoning are built to reflect real screening and interview rounds.",
      },
      {
        q: "What is the StudexaAI Loop?",
        a: "It is the complete loop: Plan → Learn → Practice → Review → Improve → Repeat daily. This structure is why StudexaAI works long-term.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. StudexaAI uses secure, cookie-based authentication and modern backend practices to protect your account. We focus on safe session handling and clean access control across modules.",
      },
      {
        q: "How should I start using StudexaAI?",
        a: "Start with one small goal. Use AI TODO to create tasks, AI Note to revise faster, then use Quiz / Reasoning modules to practice. After that, review explanations and repeat daily — consistency is the real superpower.",
      },
      {
        q: "Can StudexaAI help with interviews?",
        a: "Yes. The system is built around interview readiness: aptitude + reasoning + verbal practice, with review-based improvement. The loop helps you become consistent without burnout.",
      },
    ],
    []
  );

  const leftFaqs = useMemo(() => faqs.filter((_, i) => i % 2 === 0), [faqs]);
  const rightFaqs = useMemo(() => faqs.filter((_, i) => i % 2 === 1), [faqs]);

  // ✅ start fully closed
  const [openLeft, setOpenLeft] = useState(-1);
  const [openRight, setOpenRight] = useState(-1);

  return (
    <section id="faq" className="relative w-full overflow-hidden bg-white">
      {/* premium ambient background (same family) */}
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
          className="absolute bottom-[-260px] right-[-180px] h-[520px] w-[520px] rounded-full bg-brand-blue/5 blur-3xl"
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
          <motion.div
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-brand-blue" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-bold tracking-tight text-text-title sm:text-4xl"
          >
            Everything you want to know — clearly.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-text-body"
          >
            If you’re curious, you’re already serious. Here are the most common
            questions people ask before starting.
          </motion.p>
        </motion.div>

        {/* FAQs (2-column accordion layout) */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {leftFaqs.map((f, pos) => {
              const isOpen = openLeft === pos;

              const toggle = () => {
                setOpenLeft(isOpen ? -1 : pos);
                setOpenRight(-1); // ✅ always close the other column
              };

              return (
                <motion.div
                  key={f.q}
                  variants={fadeUp}
                  className={[
                    "relative overflow-hidden rounded-2xl",
                    "border border-border bg-white/90 shadow-card backdrop-blur-xl",
                    "transition-all duration-300",
                    "focus-within:ring-4 focus-within:ring-brand-cyan/20",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={toggle}
                    className="relative flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-text-title sm:text-base">
                      {f.q}
                    </span>

                    <motion.span
                      aria-hidden
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { rotate: isOpen ? 180 : 0 }
                      }
                      transition={{ duration: 0.22, ease: easePremium }}
                      className="shrink-0 text-text-title/70"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: easePremium }}
                        className="relative overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <p className="text-sm leading-relaxed text-text-body">
                            {f.a}
                          </p>

                          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-text-muted">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-blue/80" />
                              Clear answers
                            </span>
                            <span className="opacity-40">•</span>
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-cyan/80" />
                              Loop-first learning
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {rightFaqs.map((f, pos) => {
              const isOpen = openRight === pos;

              const toggle = () => {
                setOpenRight(isOpen ? -1 : pos);
                setOpenLeft(-1); // ✅ always close the other column
              };

              return (
                <motion.div
                  key={f.q}
                  variants={fadeUp}
                  className={[
                    "relative overflow-hidden rounded-2xl",
                    "border border-border bg-white/90 shadow-card backdrop-blur-xl",
                    "transition-all duration-300",
                    "focus-within:ring-4 focus-within:ring-brand-cyan/20",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={toggle}
                    className="relative flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-text-title sm:text-base">
                      {f.q}
                    </span>

                    <motion.span
                      aria-hidden
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { rotate: isOpen ? 180 : 0 }
                      }
                      transition={{ duration: 0.22, ease: easePremium }}
                      className="shrink-0 text-text-title/70"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: easePremium }}
                        className="relative overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <p className="text-sm leading-relaxed text-text-body">
                            {f.a}
                          </p>

                          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-text-muted">
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-blue/80" />
                              Clear answers
                            </span>
                            <span className="opacity-40">•</span>
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-cyan/80" />
                              Loop-first learning
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* bottom helper block (static, premium) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <div className="card bg-surface-page p-6">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="icon-box">
                <HelpCircle className="h-6 w-6 text-brand-blue" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-text-title">
                  Still confused?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-body">
                  Reach out anytime — we’ll guide you to the right path inside
                  StudexaAI.
                </p>
              </div>

              <Link
                to="/contact"
                className="rounded-2xl border border-border bg-white px-4 py-3 text-left shadow-card transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
              >
                <p className="text-xs font-semibold text-text-muted">Need help?</p>
                <p className="mt-1 text-sm font-semibold text-text-title">
                  Visit Contact Page →
                </p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
