// src/pages/Landing/TermsPage.jsx

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

const TermsPage = () => {
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

        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
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
              Terms & Conditions
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-3 text-base leading-relaxed text-text-body sm:text-lg"
            >
              These Terms govern your access to and use of StudexaAI. Please read
              them carefully before using the platform.
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-text-body">
                  By accessing or using StudexaAI (“Platform”, “Services”), you
                  agree to be bound by these Terms & Conditions (“Terms”). If you
                  do not agree to these Terms, you must not use the Platform.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  2. What StudexaAI Provides
                </h2>
                <p className="text-text-body">
                  StudexaAI is a unified learning + productivity ecosystem that
                  helps students and working professionals plan, learn, revise,
                  practice, review, and improve daily through a connected
                  workflow.
                </p>
                <p className="text-text-body">
                  The platform may include modules such as:
                </p>
                <ul className="text-text-body">
                  <li>Todo management</li>
                  <li>AI Notes generation</li>
                  <li>AI Quiz generation</li>
                  <li>Aptitude practice</li>
                  <li>Logical Reasoning practice</li>
                  <li>Verbal Reasoning practice</li>
                  <li>Attempt history and review explanations</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  3. Eligibility (Including Learners Under 18)
                </h2>
                <p className="text-text-body">
                  StudexaAI may be used by students under 18 as it is a learning
                  platform. If you are a minor, you should use StudexaAI under
                  the guidance of a parent/guardian or teacher where applicable.
                </p>
                <p className="text-text-body">
                  By using the Platform, you represent that you are legally
                  capable of agreeing to these Terms, or that you have required
                  consent where applicable.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  4. Account Responsibility
                </h2>
                <p className="text-text-body">
                  If you create an account, you are responsible for maintaining
                  confidentiality of your login credentials and for all activity
                  under your account.
                </p>
                <ul className="text-text-body">
                  <li>Do not share your password.</li>
                  <li>Keep your email updated.</li>
                  <li>
                    Notify us immediately if you suspect unauthorized access.
                  </li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  5. Acceptable Use Policy
                </h2>
                <p className="text-text-body">
                  You agree to use StudexaAI only for lawful purposes and in
                  compliance with applicable laws. You must not:
                </p>
                <ul className="text-text-body">
                  <li>Attempt unauthorized access to any system or data.</li>
                  <li>Abuse, harass, defame, threaten, or harm other users.</li>
                  <li>Upload malicious code, viruses, or harmful programs.</li>
                  <li>
                    Scrape, copy, or reverse engineer the platform or its models
                    or systems.
                  </li>
                  <li>Exploit the platform for spam or deceptive content.</li>
                  <li>
                    Interfere with platform performance, security, or
                    availability.
                  </li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  6. AI-Generated Content (Notes, Quizzes, Explanations)
                </h2>
                <p className="text-text-body">
                  StudexaAI may generate content using AI. You understand and
                  agree that:
                </p>
                <ul className="text-text-body">
                  <li>
                    AI outputs may contain errors and should be verified for
                    accuracy.
                  </li>
                  <li>
                    StudexaAI does not guarantee correctness, completeness, or
                    suitability of generated content for exams/interviews.
                  </li>
                  <li>
                    You are responsible for how you use AI outputs in learning
                    or preparation.
                  </li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  7. Repeat-Proof Practice & Integrity
                </h2>
                <p className="text-text-body">
                  StudexaAI is designed to support non-repetitive practice
                  sessions (where applicable) and maintain attempt integrity
                  through lifecycle + history tracking.
                </p>
                <p className="text-text-body">
                  You agree not to attempt to bypass, manipulate, or exploit any
                  logic related to uniqueness enforcement, attempts, scoring,
                  history, or review features.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  8. Intellectual Property
                </h2>
                <p className="text-text-body">
                  All intellectual property rights related to StudexaAI
                  (including software, UI, backend services, algorithms, designs,
                  logos, text, and platform content) are owned by or licensed to
                  us.
                </p>
                <p className="text-text-body">
                  You are granted a limited, non-exclusive, non-transferable
                  right to use StudexaAI for personal learning and productivity
                  purposes. You must not:
                </p>
                <ul className="text-text-body">
                  <li>Copy, distribute, or resell the platform.</li>
                  <li>
                    Use the platform content for commercial publishing without
                    written permission.
                  </li>
                  <li>Remove branding or notices.</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  9. Privacy
                </h2>
                <p className="text-text-body">
                  Your privacy matters to us. Your use of StudexaAI is also
                  governed by our Privacy Policy. By using the Platform, you
                  agree to our collection and processing practices as described
                  in that policy.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  10. Disclaimer of Warranties
                </h2>
                <p className="text-text-body">
                  StudexaAI is provided on an “as is” and “as available” basis
                  without warranties of any kind (express or implied). We do not
                  guarantee that:
                </p>
                <ul className="text-text-body">
                  <li>The platform will be uninterrupted or error-free.</li>
                  <li>AI-generated content will always be accurate.</li>
                  <li>Any learning outcome or interview result will be achieved.</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  11. Limitation of Liability
                </h2>
                <p className="text-text-body">
                  To the maximum extent permitted by law, StudexaAI shall not be
                  liable for any direct, indirect, incidental, special,
                  consequential, or punitive damages arising out of or in
                  connection with:
                </p>
                <ul className="text-text-body">
                  <li>Your use or inability to use the Platform</li>
                  <li>Errors or interruptions</li>
                  <li>Loss of data, progress, or productivity</li>
                  <li>Reliance on AI-generated outputs</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  12. Termination
                </h2>
                <p className="text-text-body">
                  We may suspend or terminate access to StudexaAI at any time if
                  we reasonably believe:
                </p>
                <ul className="text-text-body">
                  <li>You violated these Terms</li>
                  <li>You misused the system or attempted exploitation</li>
                  <li>There is a security or abuse risk</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  13. Changes to Terms
                </h2>
                <p className="text-text-body">
                  We may update these Terms from time to time. Updated Terms will
                  be effective immediately upon posting. Continued use of
                  StudexaAI after changes means you accept the updated Terms.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  14. Governing Law & Jurisdiction
                </h2>
                <p className="text-text-body">
                  These Terms shall be governed by and construed in accordance
                  with the laws of India. Any disputes arising under these Terms
                  shall be subject to the exclusive jurisdiction of the courts
                  where applicable.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  15. Contact Us
                </h2>
                <p className="text-text-body">
                  If you have questions about these Terms, you can contact us:
                </p>

                <div className="not-prose mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-box">
                      <Mail className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-muted">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-text-title">
                        legal@studexaai.com
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

                <p className="mt-8 text-sm text-text-muted">
                  By using StudexaAI, you confirm that you have read, understood,
                  and agreed to these Terms & Conditions.
                </p>
              </div>

              {/* visible structure line */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-soft opacity-80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent" />
            </motion.div>

            {/* footer link strip */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-white/70 px-5 py-4 text-center shadow-card backdrop-blur-xl sm:flex-row sm:text-left"
            >
              <p className="text-sm font-semibold text-text-title">
                Want to review our Privacy Policy too?
              </p>
              <Link
                to="/privacy-policy"
                className="text-sm font-semibold text-brand-blue transition hover:underline"
              >
                View Privacy Policy →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default TermsPage;
