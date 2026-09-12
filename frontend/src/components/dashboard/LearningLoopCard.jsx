// src/components/dashboard/LearningLoopCard.jsx

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  NotebookPen,
  Sparkles,
  LayoutGrid,
  Brain,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

import cx from "../../utils/cx.js";

/* =====================================================
   LearningLoopCard (FINAL)
   ✅ expects `stats` object (dashboard stats response)
   ✅ internal calc = momentum + loop progress
   ✅ navigates via onNavigate(route)
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easePremium },
  },
};

const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));

const StepPill = ({ icon: Icon, title, desc, active = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ease-premium",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20",
        active
          ? "border-brand-blue/25 bg-brand-blue/8"
          : "border-border bg-white hover:bg-brand-blue/6 hover:border-brand-blue/20"
      )}
      aria-label={title}
    >
      {/* premium faint glass tint */}
      <div className="pointer-events-none absolute inset-0 bg-white/35 opacity-70" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-cyan/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="relative flex items-start gap-3">
        <span
          className={cx(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white shadow-card transition",
            active ? "border-brand-blue/25" : "border-border"
          )}
        >
          <Icon
            className={cx(
              "h-5 w-5",
              active ? "text-brand-blue" : "text-text-title"
            )}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-text-title">
                {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {desc}
              </p>
            </div>

            <span
              className={cx(
                "mt-0.5 inline-flex items-center gap-1 text-xs font-semibold transition",
                active
                  ? "text-brand-blue"
                  : "text-text-muted group-hover:text-brand-blue"
              )}
            >
              Open
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const LearningLoopCard = ({ stats, onNavigate, className = "" }) => {
  const loop = useMemo(() => {
    const totalTodos = Number(stats?.totalTodos ?? 0);
    const completedTodos = Number(stats?.completedTodos ?? 0);
    const pendingTodos = Number(stats?.pendingTodos ?? 0);

    const aiNotes = Number(stats?.aiNotes ?? 0);

    const quizzesTaken = Number(stats?.quizzesTaken ?? 0);
    const avgQuizScore = Number(stats?.avgQuizScore ?? 0);

    const logicalReasoningPractices = Number(stats?.logicalReasoningPractices ?? 0);
    const aptitudePractices = Number(stats?.aptitudePractices ?? 0);
    const verbalReasoningPractices = Number(stats?.verbalReasoningPractices ?? 0);

    const practicesTotal =
      logicalReasoningPractices + aptitudePractices + verbalReasoningPractices;

    // heuristic loop progress
    const plan = totalTodos > 0 ? clamp((completedTodos / totalTodos) * 100) : 0;
    const learn = aiNotes > 0 ? clamp(Math.min(aiNotes, 20) * 5) : 0;
    const practice = practicesTotal > 0 ? clamp(Math.min(practicesTotal, 20) * 5) : 0;
    const review = quizzesTaken > 0 ? clamp(Math.min(quizzesTaken, 20) * 5) : 0;
    const improve = quizzesTaken > 0 ? clamp(avgQuizScore) : 0;

    const overall = Math.round((plan + learn + practice + review + improve) / 5);

    return {
      plan,
      learn,
      practice,
      review,
      improve,
      overall,
      pendingTodos,
      practicesTotal,
      avgQuizScore,
    };
  }, [stats]);

  const steps = useMemo(
    () => [
      {
        id: "plan",
        title: "Plan (Todo)",
        desc:
          loop.pendingTodos > 0
            ? `${loop.pendingTodos} pending tasks waiting.`
            : "Your plan board is clean and ready.",
        icon: ListTodo,
        to: "/dashboard/ai-todo",
      },
      {
        id: "learn",
        title: "Learn (AI Notes)",
        desc: "Turn any topic into crisp revision notes.",
        icon: NotebookPen,
        to: "/dashboard/ai-note",
      },
      {
        id: "practice",
        title: "Practice (Rounds)",
        desc: `Aptitude + reasoning sessions: ${loop.practicesTotal}.`,
        icon: LayoutGrid,
        to: "/dashboard/aptitude",
      },
      {
        id: "review",
        title: "Review (AI Quiz)",
        desc: "Instant quizzes. No repeats. Real learning.",
        icon: Sparkles,
        to: "/dashboard/ai-quiz",
      },
      {
        id: "improve",
        title: "Improve (Score)",
        desc:
          loop.avgQuizScore > 0
            ? `Your avg quiz score is ${loop.avgQuizScore}%.`
            : "Complete a quiz to unlock your improvement stats.",
        icon: Brain,
        to: "/dashboard/ai-quiz",
      },
      {
        id: "verbal",
        title: "Verbal Reasoning",
        desc: "Inference + comprehension practice.",
        icon: MessageSquareText,
        to: "/dashboard/verbal-reasoning",
      },
    ],
    [loop]
  );

  return (
    <motion.div
      variants={item}
      className={cx(
        "relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl",
        className
      )}
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white/45 opacity-70" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-cyan/12 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-muted">
              Your StudexaAI Loop
            </p>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-text-title sm:text-2xl">
              Plan → Learn → Practice → Review → Improve
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-body">
              This is your personal learning workspace. Every action you take
              here compounds — and your progress stays measurable, reviewable,
              and repeat-proof.
            </p>
          </div>

          {/* overall meter */}
          <div className="shrink-0 rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
            <p className="text-[11px] font-semibold text-text-muted">
              Loop momentum
            </p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-3xl font-extrabold tracking-tight text-text-title tabular-nums">
                {loop.overall}%
              </p>
              <p className="pb-1 text-xs font-semibold text-text-muted">
                today-ready
              </p>
            </div>
            <div className="mt-2 h-2 w-[220px] overflow-hidden rounded-full bg-surface-page">
              <div
                className="h-full rounded-full bg-brand-gradient transition-all duration-500"
                style={{ width: `${loop.overall}%` }}
              />
            </div>
          </div>
        </div>

        {/* cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <StepPill
              key={s.id}
              icon={s.icon}
              title={s.title}
              desc={s.desc}
              active={false}
              onClick={() => {
                if (typeof onNavigate === "function") onNavigate(s.to);
              }}
            />
          ))}
        </div>

        {/* micro footer */}
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-white px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-text-title">
              Pro tip: keep your loop daily.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-body">
              Small consistent sessions outperform long irregular marathons.
              One quiz + one practice round per day is enough to build momentum.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
            onClick={() => {
              if (typeof onNavigate === "function") onNavigate("/dashboard/ai-quiz");
            }}
          >
            Start a quick quiz
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningLoopCard;
