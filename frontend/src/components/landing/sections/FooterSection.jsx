// src/components/landing/sections/FooterSection.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Copyright } from "lucide-react";

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

const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="w-full bg-brand-navy text-white">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-16"
      >
        {/* Top */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12"
        >
          {/* Brand */}
          <div className="lg:col-span-5">
            {/* Logo / Brand */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img
                  src="/favicon.png"
                  alt="StudexaAI"
                  className="h-8 w-8 rounded-xl object-contain"
                  loading="lazy"
                  draggable="false"
                />
              </div>

              <div>
                <p className="text-base font-semibold text-white">StudexaAI</p>
                <p className="text-xs text-white/70">
                  Plan → Learn → Practice → Review → Improve
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
              StudexaAI is a free learning + productivity platform for students
              and professionals. Built to solve consistency, revision, and
              interview practice — in one loop.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90">
              ✅ 100% Free for learners
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {/* Quick Links */}
              <div>
                <p className="text-sm font-semibold text-white">Quick Links</p>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li>
                    <Link to="/" className="transition hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="transition hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases"
                      className="transition hover:text-white"
                    >
                      Use cases
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="transition hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Use cases */}
              <div>
                <p className="text-sm font-semibold text-white">Use cases</p>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li>
                    <Link
                      to="/use-cases/ai-todo"
                      className="transition hover:text-white"
                    >
                      AI TODO
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases/ai-note"
                      className="transition hover:text-white"
                    >
                      AI Note
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases/ai-quiz"
                      className="transition hover:text-white"
                    >
                      AI Quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases/aptitude"
                      className="transition hover:text-white"
                    >
                      Aptitude
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases/logical-reasoning"
                      className="transition hover:text-white"
                    >
                      Logical Reasoning
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/use-cases/verbal-reasoning"
                      className="transition hover:text-white"
                    >
                      Verbal Reasoning
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <p className="text-sm font-semibold text-white">Support</p>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  <li>
                    <Link to="/contact" className="transition hover:text-white">
                      Feedback / Suggestions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="transition hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="transition hover:text-white">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/copyright"
                      className="transition hover:text-white"
                    >
                      Copyright
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social (removed as requested) */}
            <div className="mt-10 hidden" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="inline-flex items-center gap-2 text-sm text-white/65">
            <Copyright className="h-4 w-4 text-white/60" />
            {year} StudexaAI. All rights reserved.
          </p>

          <p className="text-sm font-semibold text-white">
            Built with discipline. Built for growth.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
