// src/pages/UserDashboard/UserDashboard.jsx

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  ArrowUpRight,
  ClipboardList,
  FileText,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Target,
  BookOpen,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard.jsx";
import StatDonutChart from "../../components/dashboard/StatDonutChart.jsx";
import LearningLoopCard from "../../components/dashboard/LearningLoopCard.jsx";
import PracticeMiniBars from "../../components/dashboard/PracticeMiniBars.jsx";
import QuickActionCard from "../../components/dashboard/QuickActionCard.jsx";
import DashboardStatsSkeleton from "../../components/dashboard/DashboardStatsSkeleton.jsx";

import { getDashboardStats } from "../../api/dashboardApi.js";
import { formatNumber, formatPercent } from "../../utils/format.js";

/* =====================================================
   UserDashboard (ULTIMATE — layout-safe + motion-safe)
   ✅ Route renders inside DashboardShell via <Outlet/>
   ✅ Skeleton never gets hidden by variant propagation
   ✅ Staggered animations for real content only
   ✅ Refresh button supported
===================================================== */

const easePremium = [0.2, 0.8, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easePremium },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const UserDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const loadResources = async () => {
    try {
      // Use the public content API directly
      const res = await fetch("http://localhost:5000/api/content?limit=3");
      const data = await res.json();
      setResources(data.content || []);
    } catch (e) {
      console.error("Failed to fetch dashboard resources", e);
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

      const data = await getDashboardStats();
      setStats(data || null);
      await loadResources();
    } catch (e) {
      setErr(e?.message || "Failed to load dashboard stats.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    let active = true;
    if (active) load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const derived = useMemo(() => {
    const totalTodos = Number(stats?.totalTodos ?? 0);
    const completedTodos = Number(stats?.completedTodos ?? 0);

    const pendingTodos = Number(
      stats?.pendingTodos ?? Math.max(0, totalTodos - completedTodos)
    );

    const todoCompletion =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const aiNotes = Number(stats?.aiNotes ?? 0);
    const quizzesTaken = Number(stats?.quizzesTaken ?? 0);
    const avgQuizScore = Number(stats?.avgQuizScore ?? 0);

    const logical = Number(stats?.logicalReasoningPractices ?? 0);
    const aptitude = Number(stats?.aptitudePractices ?? 0);
    const verbal = Number(stats?.verbalReasoningPractices ?? 0);

    const practicesTotal = logical + aptitude + verbal;

    const momentumScore = Math.min(
      100,
      Math.round(
        todoCompletion * 0.35 +
        Math.min(20, quizzesTaken) * 2.2 +
        Math.min(20, aiNotes) * 2.0 +
        Math.min(30, practicesTotal) * 1.6
      )
    );

    return {
      totalTodos,
      completedTodos,
      pendingTodos,
      todoCompletion,
      aiNotes,
      quizzesTaken,
      avgQuizScore,
      logical,
      aptitude,
      verbal,
      practicesTotal,
      momentumScore,
    };
  }, [stats]);

  const handleNavigate = (to) => {
    navigate(to);
  };

  // ✅ ABSOLUTE FIX: do NOT wrap skeleton with variant container
  if (loading) {
    return (
      <div className="space-y-6" aria-label="Loading dashboard" role="status">
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.section variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
                  <LayoutDashboard className="h-4 w-4 text-brand-blue" />
                  Dashboard Home
                  <span className="mx-1 text-text-muted/40">•</span>
                  <Sparkles className="h-4 w-4 text-brand-cyan" />
                  Plan → Learn → Practice
                </div>

                <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">
                  Your learning workspace
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-body">
                  StudexaAI keeps everything connected so your learning never
                  breaks:{" "}
                  <span className="font-semibold text-text-title">
                    Plan → Learn → Practice → Review → Improve
                  </span>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={load}
                  className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
                  type="button"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh stats
                </button>

                <div className="rounded-2xl border border-border bg-white/85 px-5 py-3 shadow-card">
                  <p className="text-[11px] font-semibold text-text-muted">
                    Momentum
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-brand-blue" />
                    <p className="text-sm font-extrabold text-text-title tabular-nums">
                      {formatPercent(derived.momentumScore)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* progress strip */}
            <div className="mt-6 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold text-text-title">
                  Today’s loop focus
                </p>
                <span className="text-[11px] font-semibold text-text-muted">
                  Keep it repeat-proof
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-brand-blue" />
                    <p className="text-xs font-extrabold text-text-title">
                      Plan
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Add 1 task you can finish in 25 minutes.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-blue" />
                    <p className="text-xs font-extrabold text-text-title">
                      Learn
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Generate notes for one topic and save it.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-card">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-cyan" />
                    <p className="text-xs font-extrabold text-text-title">
                      Practice
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Attempt fresh questions — no repeats.
                  </p>
                </div>
              </div>
            </div>

            {err ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {err}
              </div>
            ) : null}
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section variants={fadeUp}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* left stats grid */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-text-muted">
                    Overview
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-text-title">
                    Your stats snapshot
                  </h2>
                </div>
              </div>

              <div className="mt-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <StatCard
                    title="Todos"
                    value={formatNumber(derived.totalTodos)}
                    subtitle={`${formatNumber(
                      derived.completedTodos
                    )} completed • ${formatNumber(derived.pendingTodos)} pending`}
                    icon={ClipboardList}
                    onClick={() => handleNavigate("/dashboard/ai-todo")}
                  />

                  <StatCard
                    title="AI Notes"
                    value={formatNumber(derived.aiNotes)}
                    subtitle="Saved notes for revision"
                    icon={FileText}
                    onClick={() => handleNavigate("/dashboard/ai-note")}
                  />

                  <StatCard
                    title="Quizzes taken"
                    value={formatNumber(derived.quizzesTaken)}
                    subtitle="Unique attempts stored"
                    icon={Sparkles}
                    onClick={() => handleNavigate("/dashboard/ai-quiz")}
                  />

                  <StatCard
                    title="Practice attempts"
                    value={formatNumber(derived.practicesTotal)}
                    subtitle="Aptitude + LR + VR"
                    icon={CheckCircle2}
                    onClick={() => handleNavigate("/dashboard/aptitude")}
                  />
                </div>
              </div>

              {/* todo completion */}
              <div className="mt-5 rounded-2xl border border-border bg-white/70 px-5 py-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-text-title">
                    Todo completion
                  </p>
                  <p className="text-xs font-semibold text-text-muted tabular-nums">
                    {formatPercent(derived.todoCompletion)}
                  </p>
                </div>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-page">
                  <div
                    className="h-full rounded-full bg-brand-gradient transition-all duration-500"
                    style={{ width: `${derived.todoCompletion}%` }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-text-muted">
                  Tip: keep daily pending ≤ 3 for consistency.
                </p>
              </div>
            </div>
          </div>

          {/* right analytics */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
                <p className="text-xs font-semibold text-text-muted">
                  Quiz performance
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-text-title">
                    Average score
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-text-muted shadow-card">
                    <ArrowUpRight className="h-3.5 w-3.5 text-brand-blue" />
                    visual
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-center">
                  <StatDonutChart value={derived.avgQuizScore} />
                </div>

                <p className="mt-4 text-center text-xs font-semibold text-text-muted">
                  Based on completed quiz attempts
                </p>
              </div>

              <PracticeMiniBars stats={stats} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-text-muted">
                Quick actions
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-text-title">
                Start a session
              </h2>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Create Todo"
              desc="Plan your day in minutes."
              icon={ClipboardList}
              onClick={() => handleNavigate("/dashboard/ai-todo")}
            />

            <QuickActionCard
              title="Generate AI Note"
              desc="Learn faster. Revise anytime."
              icon={FileText}
              tone="blue"
              onClick={() => handleNavigate("/dashboard/ai-note")}
            />

            <QuickActionCard
              title="Start AI Quiz"
              desc="Unique questions. No repeats."
              icon={Sparkles}
              onClick={() => handleNavigate("/dashboard/ai-quiz")}
            />

            <QuickActionCard
              title="Start Practice"
              desc="Aptitude / LR / VR rounds."
              icon={CheckCircle2}
              tone="blue"
              onClick={() => handleNavigate("/dashboard/aptitude")}
            />
          </div>
        </div>
      </motion.section>

      {/* Learning loop */}
      <motion.section variants={fadeUp}>
        <LearningLoopCard stats={stats} onNavigate={handleNavigate} />
      </motion.section>

      {/* Latest Resources section */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-text-muted">New for you</p>
              <h2 className="mt-1 text-lg font-extrabold text-text-title">
                Latest from StudexaAI
              </h2>
            </div>
            <button
              onClick={() => handleNavigate("/dashboard/resources")}
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              View All Resources
            </button>
          </div>

          {resources.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-border rounded-2xl">
              <p className="text-sm text-text-muted">No public resources available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((res) => (
                <div
                  key={res._id}
                  onClick={() => handleNavigate("/dashboard/resources")}
                  className="group p-4 rounded-2xl border border-border bg-white shadow-card hover:shadow-card-hover transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${res.type === 'quiz' ? 'bg-amber-50 text-amber-600' :
                      res.type === 'test' ? 'bg-rose-50 text-rose-600' :
                        'bg-blue-50 text-blue-600'
                    }`}>
                    {res.type === 'quiz' ? <Sparkles size={18} /> :
                      res.type === 'test' ? <FileText size={18} /> :
                        <BookOpen size={18} />}
                  </div>
                  <h4 className="text-sm font-extrabold text-text-title group-hover:text-brand-blue transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                    {res.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default UserDashboard;
