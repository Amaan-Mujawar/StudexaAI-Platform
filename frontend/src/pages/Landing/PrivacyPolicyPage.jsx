// src/pages/Landing/PrivacyPolicyPage.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Mail } from "lucide-react";
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

const PrivacyPolicyPage = () => {
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
              Privacy Policy
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-3 text-base leading-relaxed text-text-body sm:text-lg"
            >
              StudexaAI is committed to protecting your privacy and securing your
              information. This policy explains what we collect, why we collect
              it, and how we keep it safe — for students and working
              professionals.
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
                  1. Introduction
                </h2>
                <p className="text-text-body">
                  StudexaAI is a unified learning + productivity ecosystem
                  designed to help learners plan effectively, stay consistent,
                  revise properly, and practice in an interview-ready way —
                  without relying on multiple disconnected tools.
                </p>
                <p className="text-text-body">
                  This Privacy Policy outlines how we collect, use, disclose,
                  and protect the information you provide while using StudexaAI.
                </p>
                <p className="text-text-body">
                  By using StudexaAI, you acknowledge that you have read,
                  understood, and agreed to the practices described here.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  2. Information We Collect
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  2.1 Personal Information
                </h3>
                <p className="text-text-body">
                  When you register or use StudexaAI features, we may collect
                  personally identifiable information, including but not limited
                  to:
                </p>
                <ul className="text-text-body">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Profile / account details you voluntarily provide</li>
                </ul>
                <p className="text-text-body">
                  We collect only what is necessary to provide core platform
                  functionality and to improve the user experience.
                </p>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  2.2 Learning / Workflow Content You Create
                </h3>
                <p className="text-text-body">
                  StudexaAI is built around an integrated learning workflow.
                  While using the platform, you may create or submit content
                  such as:
                </p>
                <ul className="text-text-body">
                  <li>Tasks / To-do items</li>
                  <li>AI Notes inputs and generated notes</li>
                  <li>Quiz prompts, attempts, and your responses</li>
                  <li>Reasoning practice attempts</li>
                  <li>Review activity and progress history</li>
                </ul>
                <p className="text-text-body">
                  This content is used to deliver features like revision,
                  history, review, and loop-first improvement.
                </p>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  2.3 Usage Information
                </h3>
                <p className="text-text-body">
                  We may collect non-personally identifiable usage information
                  automatically, such as:
                </p>
                <ul className="text-text-body">
                  <li>IP address</li>
                  <li>Device information</li>
                  <li>Browser type</li>
                  <li>Operating system</li>
                  <li>Basic activity signals (for reliability and security)</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  3. How We Use Your Information
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  3.1 Platform Functionality (Core Use)
                </h3>
                <p className="text-text-body">
                  We use your information to provide StudexaAI’s integrated
                  loop:
                </p>
                <ul className="text-text-body">
                  <li>Plan (Todo system)</li>
                  <li>Learn + revise (AI Notes)</li>
                  <li>
                    Practice (AI Quizzes + Aptitude / Reasoning modules)
                  </li>
                  <li>Review (explanations, history, performance)</li>
                  <li>Improve and repeat daily</li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  3.2 Improvement and Quality
                </h3>
                <p className="text-text-body">
                  We may use collected data to:
                </p>
                <ul className="text-text-body">
                  <li>Improve user experience and system performance</li>
                  <li>Fix bugs and enhance feature stability</li>
                  <li>Measure effectiveness of the learning loop</li>
                  <li>Prevent abuse and enforce uniqueness rules</li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  3.3 Communications
                </h3>
                <p className="text-text-body">
                  We may contact you to:
                </p>
                <ul className="text-text-body">
                  <li>Provide support</li>
                  <li>Send important service updates</li>
                  <li>
                    Share platform updates or promotions only when you’ve
                    opted-in
                  </li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  4. Information Sharing and Disclosure
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  4.1 Third-Party Service Providers
                </h3>
                <p className="text-text-body">
                  We may share limited information with trusted third-party
                  service providers who help operate StudexaAI (e.g., hosting,
                  monitoring, analytics, email delivery). These providers are
                  bound by confidentiality obligations and are only allowed to
                  use the data as required to provide services to us.
                </p>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  4.2 Legal Requirements
                </h3>
                <p className="text-text-body">
                  We may disclose information if required to comply with law,
                  regulation, or legal process, or when we believe such
                  disclosure is necessary to:
                </p>
                <ul className="text-text-body">
                  <li>Protect platform integrity and user safety</li>
                  <li>Enforce Terms and policies</li>
                  <li>Respond to lawful requests</li>
                </ul>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  5. Data Security
                </h2>
                <p className="text-text-body">
                  We take reasonable measures to protect your information from
                  unauthorized access, loss, misuse, or alteration. However, no
                  method of transmission over the internet or electronic storage
                  is 100% secure. While we strive to protect your data, we
                  cannot guarantee absolute security.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  6. Your Rights and Choices
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  6.1 Access and Correction
                </h3>
                <p className="text-text-body">
                  You have the right to access, correct, or update your personal
                  information held by us. You can do so by contacting us using
                  the details below.
                </p>

                <h3 className="mt-4 text-lg font-semibold text-text-title">
                  6.2 Opt-Out
                </h3>
                <p className="text-text-body">
                  If you no longer wish to receive promotional communications,
                  you can opt out by following unsubscribe instructions (where
                  applicable).
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  7. Third-Party Links
                </h2>
                <p className="text-text-body">
                  StudexaAI may contain links to third-party websites or
                  services not operated by us. This Privacy Policy does not
                  apply to them. We recommend reviewing their policies before
                  interacting.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  8. Learners Under 18
                </h2>
                <p className="text-text-body">
                  StudexaAI is a learning platform that may be used by students
                  under the age of 18. If you are a minor, you should use the
                  platform under the guidance of a parent/guardian or teacher
                  where applicable.
                </p>
                <p className="text-text-body">
                  We do not intentionally request unnecessary sensitive personal
                  data from minors. If you believe a minor has provided personal
                  information that should be removed, please contact us and we
                  will take appropriate action.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  9. Changes to This Privacy Policy
                </h2>
                <p className="text-text-body">
                  We reserve the right to modify this Privacy Policy at any
                  time. Any changes will be effective immediately upon posting
                  the updated Privacy Policy on this page. We encourage you to
                  review it periodically.
                </p>

                <h2 className="mt-8 text-2xl font-bold text-text-title">
                  10. Contact Us
                </h2>
                <p className="text-text-body">
                  If you have any questions or concerns about this Privacy
                  Policy or our privacy practices, contact us:
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
                        privacy@studexaai.com
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
                  By using StudexaAI, you acknowledge that you have read,
                  understood, and agreed to the terms of this Privacy Policy.
                </p>
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

export default PrivacyPolicyPage;
