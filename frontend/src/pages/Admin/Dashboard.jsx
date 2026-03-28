// src/pages/Admin/Dashboard.jsx  — Pro-grade analytics dashboard
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Activity,
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Zap,
  Target,
  BarChart2,
  Ticket,
  CheckCircle2,
  Clock,
  FileText,
  ScrollText,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { Line, Doughnut, Bar } from "react-chartjs-2";
import StatCard from "../../components/dashboard/StatCard.jsx";
import DashboardStatsSkeleton from "../../components/dashboard/DashboardStatsSkeleton.jsx";
import { getAnalytics, getAdvancedAnalytics } from "../../api/adminApi.js";

const easePremium = [0.2, 0.8, 0.2, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: easePremium } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "var(--color-text-title)",
      bodyColor: "var(--color-text-body)",
      borderColor: "var(--color-border)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
    },
  },
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [advanced, setAdvanced] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [basic, adv] = await Promise.all([getAnalytics(), getAdvancedAnalytics()]);
        setData(basic);
        setAdvanced(adv);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-6" role="status"><DashboardStatsSkeleton /></div>;

  if (error) return (
    <div className="rounded-3xl border border-border bg-white/75 p-10 shadow-card text-center">
      <Activity className="mx-auto h-12 w-12 text-status-error opacity-40 mb-4" />
      <p className="text-lg font-extrabold text-text-title">Analytics Unavailable</p>
      <p className="mt-2 text-sm text-text-muted">{error}</p>
      <button onClick={() => window.location.reload()} className="btn-primary mt-6 px-6 py-3">Retry</button>
    </div>
  );

  const trendSlot = (val) => val != null && val !== 0 ? (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${val > 0 ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"}`}>
      {val > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(val)}%
    </span>
  ) : null;

  /* ── Completion Doughnut ── */
  const completionLabels = advanced?.completionRates?.map(c => c.module) ?? [];
  const completionValues = advanced?.completionRates?.map(c => Math.round(c.completionRate)) ?? [];
  const doughnutData = {
    labels: completionLabels,
    datasets: [{
      data: completionValues,
      backgroundColor: ["rgba(31,75,153,0.85)", "rgba(20,184,166,0.75)", "rgba(251,191,36,0.8)", "rgba(239,68,68,0.7)"],
      borderWidth: 3,
      borderColor: "#fff",
      hoverBorderWidth: 4,
    }],
  };
  const doughnutOpts = {
    ...CHART_OPTS_BASE,
    plugins: { ...CHART_OPTS_BASE.plugins, legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, color: "var(--color-text-muted)", font: { size: 12, weight: "600" } } } },
    cutout: "72%",
  };

  /* ── Drop-off Bar chart ── */
  const dropLabels = advanced?.dropoutHeatmap?.map(d => `Q${d._id + 1}`) ?? [];
  const dropValues = advanced?.dropoutHeatmap?.map(d => d.count) ?? [];
  const barData = {
    labels: dropLabels,
    datasets: [{
      label: "Drop-offs",
      data: dropValues,
      backgroundColor: dropValues.map((_, i) => i < 3 ? "rgba(239,68,68,0.7)" : i < 7 ? "rgba(251,191,36,0.7)" : "rgba(20,184,166,0.7)"),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };
  const barOpts = {
    ...CHART_OPTS_BASE,
    plugins: { ...CHART_OPTS_BASE.plugins, tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { title: (items) => `After Question ${items[0].label}`, label: (item) => `${item.raw} students dropped off` } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "var(--color-text-muted)", font: { size: 11 } } },
      y: { grid: { color: "rgba(11,22,49,0.05)" }, ticks: { color: "var(--color-text-muted)", font: { size: 11 }, stepSize: 1 }, beginAtZero: true },
    },
  };

  /* ── Score Trend Line ── */
  const trendLabels = advanced?.scoreTrends?.map(d => d._id?.slice(5)) ?? [];
  const trendValues = advanced?.scoreTrends?.map(d => Math.round(d.avgScore)) ?? [];
  const lineData = {
    labels: trendLabels,
    datasets: [{
      label: "Avg Score",
      data: trendValues,
      fill: true,
      borderColor: "var(--color-brand-blue)",
      backgroundColor: "rgba(31,75,153,0.08)",
      tension: 0.4,
      pointBackgroundColor: "var(--color-brand-blue)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };
  const lineOpts = {
    ...CHART_OPTS_BASE,
    scales: {
      x: { grid: { display: false }, ticks: { color: "var(--color-text-muted)", font: { size: 11 } } },
      y: { grid: { color: "rgba(11,22,49,0.05)" }, ticks: { color: "var(--color-text-muted)", font: { size: 11 } }, beginAtZero: true },
    },
  };

  const { dau = 0, wau = 0, mau = 0 } = advanced?.activeUsers ?? {};

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">

      {/* ── Header ── */}
      <motion.section variants={fadeUp}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white/75 shadow-card backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-brand-blue/3" />
          <div className="relative p-6 sm:p-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card mb-3">
                <LayoutDashboard className="h-4 w-4 text-brand-blue" /> Admin
                <span className="mx-1 text-text-muted/40">•</span> Analytics
              </div>
              <h1 className="text-[26px] font-extrabold tracking-tight text-text-title sm:text-[34px]">Analytics Dashboard</h1>
              <p className="mt-2 text-sm leading-relaxed text-text-body max-w-2xl">
                Real-time platform telemetry — completion rates, active users, and engagement trends.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Active Users (DAU/WAU/MAU) ── */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
          <p className="text-xs font-semibold text-text-muted mb-1">Engagement</p>
          <h2 className="text-lg font-extrabold text-text-title mb-5">Active Users</h2>
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { label: "Daily (DAU)", value: dau, icon: Zap, color: "text-brand-blue" },
              { label: "Weekly (WAU)", value: wau, icon: TrendingUp, color: "text-status-success" },
              { label: "Monthly (MAU)", value: mau, icon: Users, color: "text-amber-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center justify-center py-4 gap-2">
                <Icon className={`h-6 w-6 ${color}`} />
                <p className="text-3xl font-extrabold text-text-title">{value}</p>
                <p className="text-xs font-semibold text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Basic KPI cards ── */}
      <motion.section variants={fadeUp}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={data?.overview?.totalUsers ?? 0} subtitle="Registered users" icon={Users} rightSlot={trendSlot(data?.overview?.userTrend)} />
          <StatCard title="New This Week" value={data?.overview?.newUsersWeek ?? 0} subtitle="Active registrations" icon={UserPlus} />
          <StatCard title="New This Month" value={data?.overview?.newUsersMonth ?? 0} subtitle="Last 30 days" icon={UserPlus} />
          <StatCard title="Avg Quiz Score" value={`${data?.overview?.avgQuizScore ?? 0}%`} subtitle="Across all modules" icon={Trophy} />
          <StatCard title="Quiz Attempts" value={data?.overview?.totalQuizzes ?? 0} subtitle="Completed" icon={Activity} />
          <StatCard title="Total Tickets" value={data?.overview?.ticketsTotal ?? 0} subtitle="Support requests" icon={Ticket} />
          <StatCard title="Tickets Resolved" value={data?.overview?.ticketsResolved ?? 0} subtitle="Closed" icon={CheckCircle2} />
          <StatCard title="Tickets Pending" value={data?.overview?.ticketsPending ?? 0} subtitle="Open / In progress" icon={Clock} />
          <StatCard title="Content Published" value={data?.overview?.contentPublished ?? 0} subtitle="Live items" icon={FileText} />
        </div>
      </motion.section>

      {/* ── Completion Rates + Drop-off Heatmap ── */}
      <motion.section variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Completion Doughnut */}
          <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
            <p className="text-xs font-semibold text-text-muted mb-1">Module Performance</p>
            <h2 className="text-lg font-extrabold text-text-title mb-1">Completion Rates</h2>
            <p className="text-xs text-text-muted mb-6">Percentage of started attempts that were finished.</p>
            {completionValues.every(v => v === 0) ? (
              <div className="h-56 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-text-muted">
                <Target size={36} className="mb-3 opacity-25" />
                <p className="text-sm font-semibold">No attempt data yet</p>
              </div>
            ) : (
              <div className="relative h-56">
                <Doughnut data={doughnutData} options={doughnutOpts} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: "-10%" }}>
                  <p className="text-3xl font-extrabold text-text-title">
                    {Math.round(completionValues.reduce((a, b) => a + b, 0) / (completionValues.length || 1))}%
                  </p>
                  <p className="text-[11px] font-semibold text-text-muted">Avg Rate</p>
                </div>
              </div>
            )}
            {/* Per-module completion rows */}
            <div className="mt-5 space-y-3">
              {advanced?.completionRates?.map(({ module, completionRate, totalAttempts, completedAttempts }) => (
                <div key={module} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-bold text-text-muted shrink-0">{module}</span>
                  <div className="flex-1 h-2 bg-surface-page rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-blue transition-all duration-700"
                      style={{ width: `${completionRate.toFixed(1)}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-text-title w-12 text-right">{completionRate.toFixed(0)}%</span>
                  <span className="text-[11px] text-text-muted">{completedAttempts}/{totalAttempts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off Heatmap */}
          <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
            <p className="text-xs font-semibold text-text-muted mb-1">Engagement Quality</p>
            <h2 className="text-lg font-extrabold text-text-title mb-1">Quiz Drop-off Points</h2>
            <p className="text-xs text-text-muted mb-6">Where students abandon quizzes — earlier is more critical.</p>
            {dropValues.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-text-muted">
                <BarChart2 size={36} className="mb-3 opacity-25" />
                <p className="text-sm font-semibold">No dropout data yet</p>
              </div>
            ) : (
              <div className="h-72">
                <Bar data={barData} options={barOpts} />
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Score Trend Line ── */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-text-muted">Trends</p>
              <h2 className="text-lg font-extrabold text-text-title">Average Score Over Time</h2>
            </div>
            <span className="text-[11px] font-semibold text-text-muted">Last 14 days</span>
          </div>
          {trendValues.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-text-muted">
              <TrendingUp size={36} className="mb-3 opacity-25" />
              <p className="text-sm font-semibold">No trend data yet</p>
            </div>
          ) : (
            <div className="h-56">
              <Line data={lineData} options={lineOpts} />
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Recent platform activity ── */}
      <motion.section variants={fadeUp}>
        <div className="rounded-3xl border border-border bg-white/75 p-6 shadow-card backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText className="h-5 w-5 text-brand-blue" />
            <h2 className="text-lg font-extrabold text-text-title">Recent Platform Activity</h2>
          </div>
          <p className="text-xs text-text-muted mb-5">Latest signups, tickets, content updates, and quiz completions.</p>
          {!advanced?.recentActivity?.length ? (
            <div className="h-32 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-text-muted">
              <Activity size={28} className="mb-2 opacity-25" />
              <p className="text-sm font-semibold">No recent activity yet</p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-[340px] overflow-y-auto">
              {advanced.recentActivity.map((item, idx) => {
                const date = item.date ? new Date(item.date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
                const metaText = item.meta?.ticketNumber || item.meta?.email || item.meta?.title || (item.meta?.score != null ? `${item.meta.score}%` : "");
                const iconMap = {
                  user_signup: UserPlus,
                  ticket_created: Ticket,
                  ticket_resolved: CheckCircle2,
                  content_published: FileText,
                  quiz_completed: Trophy,
                };
                const Icon = iconMap[item.type] || Activity;
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 py-2.5 px-3 rounded-xl border border-border bg-white/60 hover:bg-white/80 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-card text-brand-blue">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-title">{item.label}</p>
                      {metaText && <p className="text-xs text-text-muted truncate mt-0.5">{metaText}</p>}
                    </div>
                    <span className="text-[11px] font-semibold text-text-muted shrink-0">{date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.section>

    </motion.div>
  );
};

export default AdminDashboard;
