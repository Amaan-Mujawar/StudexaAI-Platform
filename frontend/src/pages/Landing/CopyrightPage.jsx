// src/pages/Landing/CopyrightPage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Mail, ShieldCheck } from "lucide-react";
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

const CopyrightPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <LandingNavbar />

      <main className="relative w-full">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-ai-glow opacity-50" />
          <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-cyan/20 blur-3xl glow-pulse" />
          <div className="absolute right-[-220px] top-[120px] h-[480px] w-[480px] rounded-full bg-brand-blue/10 blur-3xl float-slow" />
          <div className="absolute bottom-[-220px] left-[-220px] h-[440px] w-[440px] rounded-full bg-brand-blue/8 blur-3xl" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16"
        >
          {/* Header */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-semibold text-text-body shadow-card backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-brand-blue" />
              Legal
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl font-extrabold tracking-tight text-text-title sm:text-5xl"
            >
              Copyright Policy
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-3 text-base leading-relaxed text-text-body sm:text-lg"
            >
              StudexaAI respects intellectual property rights and expects the
              same from its community. This policy explains ownership, permitted
              use, and how to report infringement.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-text-muted shadow-card backdrop-blur-xl"
            >
              <ShieldCheck className="h-4 w-4 text-brand-blue" />
              Last Modified: <span className="text-text-title">12-07-2024</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              className="card overflow-hidden rounded-2xl border border-border bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8"
            >
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-text-title">
                  1. Ownership of Platform Content
                </h2>
                <p className="text-text-body">
                  Unless explicitly stated otherwise, all pages, UI components,
                  layouts, branding, design systems, text, graphics, and
                  platform content made available through StudexaAI are the
                  property of StudexaAI (or its licensors) and are protected
                  under applicable copyright and intellectual property laws.
                </p>
                <p className="text-text-body">
                  StudexaAI is built as a unified learning + productivity
                  ecosystem for students and working professionals — combining
                  task planning, AI-powered notes, quizzes, and repeat-proof
                  practice into one workflow. The platform architecture and
                  feature flows are also protected as proprietary intellectual
                  property.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  2. Restrictions (No Unauthorized Reuse)
                </h2>
                <p className="text-text-body">
                  You may not redistribute, reproduce, copy, publish, mirror,
                  modify, resell, or commercially exploit any portion of
                  StudexaAI without prior written permission.
                </p>
                <p className="text-text-body">
                  This includes (but is not limited to):
                </p>
                <ul className="text-text-body">
                  <li>Landing page content and marketing copy</li>
                  <li>UI components, layouts, and styling patterns</li>
                  <li>Quiz / practice question structures and attempt formats</li>
                  <li>Explanation formats, review flows, and progress logic</li>
                  <li>Brand assets (logo, name, icons, visuals)</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  3. User Content & AI-Generated Outputs
                </h2>
                <p className="text-text-body">
                  When you use StudexaAI, you may create or submit content such
                  as Todo tasks, notes, quiz prompts, feedback, or learning
                  inputs. You retain ownership of your original content.
                </p>
                <p className="text-text-body">
                  StudexaAI may also generate outputs using AI (such as AI
                  notes, quiz questions, or explanations). These outputs are
                  intended to support learning and practice inside the platform.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  4. Respect for Third-Party Rights
                </h2>
                <p className="text-text-body">
                  StudexaAI respects the copyrights, trademarks, and
                  intellectual property of others. We do not intend to host or
                  distribute copyrighted third-party content without proper
                  authorization.
                </p>
                <p className="text-text-body">
                  If you believe any content on StudexaAI infringes your
                  copyright or intellectual property rights, please notify us
                  with the required details so we can take appropriate action.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  5. Reporting Copyright Infringement
                </h2>
                <p className="text-text-body">
                  To report infringement, contact us and include:
                </p>
                <ul className="text-text-body">
                  <li>Your full name and contact details</li>
                  <li>
                    Proof that you are the copyright owner or authorized agent
                  </li>
                  <li>Clear identification of the copyrighted work</li>
                  <li>
                    Exact location on StudexaAI (URL, page name, screenshot,
                    etc.)
                  </li>
                  <li>A statement requesting removal / resolution</li>
                </ul>

                <div className="not-prose mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-box">
                      <Mail className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted">
                        Copyright Contact
                      </p>
                      <p className="text-sm font-semibold text-text-title">
                        copyright@studexaai.com
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    className="btn-secondary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
                  >
                    Go to Contact Page →
                  </Link>
                </div>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  6. Enforcement & Removal
                </h2>
                <p className="text-text-body">
                  StudexaAI may remove content, restrict access, or terminate
                  user accounts if infringement is confirmed or if repeated
                  violations occur, in line with our Terms & Conditions.
                </p>

                <p className="mt-8 text-sm text-text-muted">
                  For other policies, rules, and legal terms, please review our
                  Terms & Conditions.
                </p>
              </div>

              {/* visible structure line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
};

export default CopyrightPage;
