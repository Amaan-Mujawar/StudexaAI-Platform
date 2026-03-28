// src/components/landing/sections/TestimonialsSection.jsx

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

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

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rushikesh Bawane",
      role: "Engineering Student",
      text: "StudexaAI genuinely fixed my daily study routine. The AI TODO makes planning effortless, and AI Notes helps me revise faster without feeling overwhelmed. The Plan → Learn → Practice loop keeps me consistent even on low-motivation days.",
      glow: "bg-brand-cyan/10",
      dot: "bg-brand-cyan",
    },
    {
      name: "Ninad Ubale",
      role: "Final Year Student",
      text: "This feels like a real placement preparation system, not just random practice questions. I use Aptitude + Logical Reasoning daily, and the explanations make learning much faster. Best part: the practice stays fresh because questions don’t repeat.",
      glow: "bg-brand-blue/10",
      dot: "bg-brand-blue",
    },
    {
      name: "Sahil Inamdar",
      role: "Software Engineer",
      text: "StudexaAI fits perfectly into my schedule. I use AI TODO to plan focused tasks and AI Notes for quick revision before interviews. It feels premium, clean, and actually useful — not bloated. The loop makes progress feel predictable.",
      glow: "bg-brand-cyan/10",
      dot: "bg-brand-cyan",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* premium ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.15, ease: "easeOut" }}
          className="absolute left-1/2 top-[-240px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-blue/5 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.25, ease: "easeOut", delay: 0.12 }}
          className="absolute bottom-[-260px] right-[-180px] h-[520px] w-[520px] rounded-full bg-brand-cyan/10 blur-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
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
            className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-brand-blue" />
            Our Testimonials
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-bold tracking-tight text-text-title sm:text-4xl"
          >
            People love the loop. That’s the point.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base leading-relaxed text-text-body"
          >
            StudexaAI isn’t just another tool — it’s a daily system for
            learning, practice, and improvement. Here’s what users feel after
            using it.
          </motion.p>
        </motion.div>

        {/* Testimonials grid (STATIC CARDS: no hover / no lift) */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="h-full">
              <div
                className={[
                  "relative h-full overflow-hidden rounded-2xl",
                  "border border-border bg-white/90 shadow-card backdrop-blur-xl",
                ].join(" ")}
              >
                {/* static soft glow (no hover dependency) */}
                <div className="pointer-events-none absolute inset-0 opacity-100">
                  <div
                    className={[
                      "absolute left-[-120px] top-[-160px] h-[320px] w-[320px] rounded-full blur-3xl opacity-60",
                      t.glow,
                    ].join(" ")}
                  />
                  <div className="absolute right-[-140px] bottom-[-160px] h-[320px] w-[320px] rounded-full bg-white/25 blur-3xl" />
                </div>

                {/* static subtle sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-60">
                  <div className="absolute -left-14 top-[-90px] h-[220px] w-[220px] rotate-12 rounded-full bg-white/35 blur-2xl" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative">
                      <div className="icon-box">
                        <Quote className="h-6 w-6 text-brand-blue" />
                      </div>

                      {/* icon glow (static) */}
                      <span
                        aria-hidden
                        className={[
                          "pointer-events-none absolute -inset-2 rounded-full blur-md opacity-60",
                          t.glow,
                        ].join(" ")}
                      />
                    </div>

                    {/* micro dot (always visible, static) */}
                    <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-text-muted">
                      <span
                        className={["h-2.5 w-2.5 rounded-full", t.dot].join(
                          " "
                        )}
                      />
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-text-body">
                    “{t.text}”
                  </p>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-text-title">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>

                {/* bottom outline detail */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />

                {/* edge ring (static) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-brand-blue/8" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
