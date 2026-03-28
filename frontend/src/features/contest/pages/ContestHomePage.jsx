// src/features/contest/pages/ContestHomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trophy, Zap, Database, Layers } from "lucide-react";

import { useContest } from "../context/ContestContext.jsx";
import { fetchUserAttempts } from "../services/contestApi.js";

/* ── Animation ── */
const containerAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
};
const itemAnim = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ── Topic config ── */
const TOPICS = [
    {
        id: "DSA",
        label: "DSA",
        subtitle: "Data Structures & Algorithms",
        icon: Zap,
        color: "text-violet-600",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        hoverBg: "hover:bg-violet-500/15",
        tagEasy: "bg-green-100 text-green-700",
        tagMed: "bg-yellow-100 text-yellow-700",
        tagHard: "bg-red-100 text-red-700",
    },
    {
        id: "OOPs",
        label: "OOPs",
        subtitle: "Object-Oriented Programming",
        icon: Layers,
        color: "text-sky-600",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        hoverBg: "hover:bg-sky-500/15",
    },
    {
        id: "SQL",
        label: "SQL",
        subtitle: "Structured Query Language",
        icon: Database,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        hoverBg: "hover:bg-emerald-500/15",
    },
];

const DIFFICULTY_LABELS = ["Easy", "Medium", "Hard"];
const DIFF_COLORS = ["bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-red-100 text-red-700"];

const ContestHomePage = () => {
    const navigate = useNavigate();
    const { userStats, loadUserStats, startContest, loading } = useContest();
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [starting, setStarting] = useState(null);

    useEffect(() => {
        loadUserStats();
        fetchUserAttempts(3)
            .then(({ data }) => setRecentAttempts(data.attempts ?? []))
            .catch(() => { });
    }, [loadUserStats]);

    const handleStart = async (topic) => {
        if (starting) return;
        setStarting(topic);
        try {
            const result = await startContest(topic);
            const attempt = result?.attempt ?? result;
            sessionStorage.setItem(`contest_attempt_${attempt._id}`, JSON.stringify(attempt));
            navigate(`/dashboard/contest/${attempt._id}`);

        } catch (err) {
            toast.error(err?.message || "Failed to start contest.");
        } finally {
            setStarting(null);
        }
    };

    return (
        <div className="flex min-h-[70vh] w-full items-start justify-center p-4 pt-6">
            <motion.div
                variants={containerAnim}
                initial="hidden"
                animate="show"
                className="w-full max-w-2xl"
            >
                {/* ── Header ── */}
                <motion.div variants={itemAnim} className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue shadow-brand shadow-brand-blue/10">
                        <Trophy className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-black text-text-title tracking-tight sm:text-4xl">
                        Contest Arena
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-text-muted">
                        Compete on timed CS topic tests, earn points, and climb the global leaderboard.
                    </p>
                </motion.div>

                {/* ── Stats strip (only when user has played) ── */}
                {userStats && userStats.totalContestPoints > 0 && (
                    <motion.div
                        variants={itemAnim}
                        className="mb-6 grid grid-cols-3 gap-3"
                    >
                        {[
                            { label: "Total Points", value: userStats.totalContestPoints?.toLocaleString() ?? "0", emoji: "⭐" },
                            { label: "Global Rank", value: `#${userStats.rank}`, emoji: "🏅" },
                            { label: "Day Streak", value: userStats.contestStreak ?? 0, emoji: "🔥" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl border border-border bg-white p-3 text-center shadow-card">
                                <p className="text-lg font-black text-text-title">{s.emoji} {s.value}</p>
                                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* ── Topic cards ── */}
                <motion.div variants={itemAnim} className="mb-6 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        Choose a Topic to Compete
                    </p>
                    {TOPICS.map((t) => {
                        const Icon = t.icon;
                        const isStarting = starting === t.id;
                        return (
                            <motion.div
                                key={t.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex items-center gap-4 rounded-2xl border ${t.border} bg-white p-4 shadow-card transition-colors ${t.hoverBg} cursor-pointer`}
                                onClick={() => !starting && handleStart(t.id)}
                            >
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.bg}`}>
                                    <Icon className={`h-6 w-6 ${t.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-text-title">{t.label}</p>
                                    <p className="text-xs font-semibold text-text-muted">{t.subtitle}</p>
                                    <div className="mt-1.5 flex items-center gap-1.5">
                                        {DIFFICULTY_LABELS.map((d, i) => (
                                            <span key={d} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${DIFF_COLORS[i]}`}>
                                                {d}
                                            </span>
                                        ))}
                                        <span className="text-[10px] font-semibold text-text-muted">· 10 Qs · 30s each</span>
                                    </div>
                                </div>
                                <button
                                    disabled={!!starting}
                                    className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-xs font-black text-white shadow-brand shadow-brand-blue/20 transition-all hover:bg-brand-blue-hover disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isStarting ? "Starting…" : "Start →"}
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ── Recent attempts + leaderboard link ── */}
                {recentAttempts.length > 0 && (
                    <motion.div variants={itemAnim} className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                Recent Attempts
                            </p>
                            <button
                                onClick={() => navigate("/dashboard/contest/leaderboard")}
                                className="text-[11px] font-bold text-brand-blue hover:underline"
                            >
                                View Leaderboard →
                            </button>
                        </div>
                        <div className="space-y-2">
                            {recentAttempts.map((a) => (
                                <div
                                    key={a.attemptId}
                                    className="flex items-center justify-between rounded-xl border border-border bg-white p-3 shadow-card"
                                >
                                    <div>
                                        <p className="text-sm font-bold text-text-title">{a.topic}</p>
                                        <p className="text-xs text-text-muted">
                                            {a.correctCount}/{a.totalQuestions} correct · {a.accuracy}%
                                        </p>
                                    </div>
                                    <p className="text-sm font-black text-brand-blue">+{a.totalPoints} pts</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-50">
                    All scoring is server-side — earn points fairly and honestly
                </p>
            </motion.div>
        </div>
    );
};

export default ContestHomePage;
