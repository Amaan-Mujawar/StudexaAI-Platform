// src/features/contest/pages/ContestResultPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw, Trophy, LayoutDashboard } from "lucide-react";

const BADGE_EMOJI = {
    first_win: "🏆", dsa_master: "⚡", oop_master: "🧩",
    sql_master: "🗄️", streak_7: "🔥", streak_30: "💎",
};

const ContestResultPage = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const raw = sessionStorage.getItem(`contest_result_${attemptId}`);
        if (raw) {
            try { setResult(JSON.parse(raw)); }
            catch { navigate("/dashboard/contest", { replace: true }); }
        } else {
            navigate("/dashboard/contest", { replace: true });
        }
    }, [attemptId, navigate]);

    if (!result) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
                <div className="relative mb-6">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
                    <Trophy className="absolute inset-0 m-auto h-6 w-6 text-brand-blue animate-pulse" />
                </div>
                <p className="text-lg font-black text-text-title">Compiling Results…</p>
            </div>
        );
    }

    const accuracy = result.totalQuestions > 0
        ? Math.round((result.correctCount / result.totalQuestions) * 100)
        : 0;

    const grade =
        accuracy >= 90 ? { label: "Excellent! 🎉", color: "text-green-600" }
            : accuracy >= 70 ? { label: "Great Job! 👏", color: "text-sky-600" }
                : accuracy >= 50 ? { label: "Good Effort! 💪", color: "text-amber-600" }
                    : { label: "Keep Practicing! 📚", color: "text-red-500" };

    return (
        <div className="flex min-h-[85vh] flex-col items-center px-4 py-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full max-w-2xl"
            >
                {/* ── Header ── */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-brand-blue">
                        Contest Result
                    </div>
                    <h1 className="text-3xl font-black text-text-title tracking-tight">
                        {grade.label}
                    </h1>
                </div>

                {/* ── Score card ── */}
                <div className="mb-4 rounded-2xl border border-border bg-white p-6 shadow-card">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-black text-brand-blue">+{result.totalPoints}</p>
                            <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">Points Earned</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-text-title">{result.correctCount}/{result.totalQuestions}</p>
                            <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">Correct</p>
                        </div>
                        <div>
                            <p className={`text-3xl font-black ${accuracy >= 70 ? "text-green-600" : accuracy >= 50 ? "text-amber-600" : "text-red-500"}`}>{accuracy}%</p>
                            <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">Accuracy</p>
                        </div>
                    </div>
                </div>

                {/* ── Streak ── */}
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-card">
                    <span className="text-2xl">🔥</span>
                    <div>
                        <p className="font-black text-text-title">{result.streak}-Day Streak!</p>
                        <p className="text-xs text-text-muted">Contest daily to keep your streak alive.</p>
                    </div>
                </div>

                {/* ── New badges ── */}
                {result.newBadges?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-4 shadow-card"
                    >
                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-brand-blue">
                            🎖️ New Badges Unlocked!
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {result.newBadges.map((b) => (
                                <div key={b.id} className="flex items-center gap-1.5 rounded-full border border-brand-blue/20 bg-white px-3 py-1.5">
                                    <span>{BADGE_EMOJI[b.id] ?? "🎖️"}</span>
                                    <span className="text-xs font-bold text-text-title">{b.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Actions ── */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate("/dashboard/contest")}
                        className="group flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-brand-blue py-3.5 text-sm font-black text-white shadow-brand shadow-brand-blue/20 transition-all hover:bg-brand-blue-hover active:scale-[0.98]"
                    >
                        <RotateCcw className="h-4 w-4 transition group-hover:rotate-[-45deg]" />
                        Try Another Topic
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/contest/leaderboard")}
                        className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-white py-3.5 text-sm font-black text-text-title transition-all hover:bg-brand-blue/5 hover:border-brand-blue/20 hover:text-brand-blue active:scale-[0.98]"
                    >
                        <Trophy className="h-4 w-4" />
                        View Leaderboard
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate("/dashboard/contest")}
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-text-muted hover:text-brand-blue transition"
                    >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Return to Contest Arena
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ContestResultPage;
