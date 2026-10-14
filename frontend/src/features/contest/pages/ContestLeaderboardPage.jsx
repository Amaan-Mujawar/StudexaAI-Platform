// src/features/contest/pages/ContestLeaderboardPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Trophy } from "lucide-react";
import { useContest } from "../context/ContestContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const MEDAL = ["🥇", "🥈", "🥉"];

const BADGE_EMOJI = {
    first_win: "🏆", dsa_master: "⚡", oop_master: "🧩",
    sql_master: "🗄️", streak_7: "🔥", streak_30: "💎",
};

const ContestLeaderboardPage = () => {
    const navigate = useNavigate();
    const { leaderboard, loadLeaderboard } = useContest();
    const { user } = useAuth();

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);

    return (
        <div className="flex min-h-[85vh] flex-col items-center px-4 py-4 sm:py-6">
            <div className="w-full max-w-2xl">
                {/* ── Back button ── */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/dashboard/contest")}
                        className="group flex items-center gap-2 text-[11px] font-bold text-text-muted transition hover:text-brand-blue"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-border transition group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5">
                            <ChevronLeft className="h-3 w-3" />
                        </div>
                        Back to Arena
                    </button>
                </div>

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex flex-col items-center text-center"
                >
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue shadow-brand shadow-brand-blue/10">
                        <Trophy className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-black text-text-title tracking-tight">Global Leaderboard</h1>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Live · Real-time updates</span>
                    </div>
                </motion.div>

                {/* ── Entries ── */}
                {leaderboard.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-card">
                        <p className="text-3xl mb-2">🏆</p>
                        <p className="font-black text-text-title">No contestants yet</p>
                        <p className="mt-1 text-sm text-text-muted">Be the first to complete a contest!</p>
                        <button
                            onClick={() => navigate("/dashboard/contest")}
                            className="mt-4 rounded-xl bg-brand-blue px-4 py-2 text-sm font-black text-white shadow-brand shadow-brand-blue/20 hover:bg-brand-blue-hover transition"
                        >
                            Start a Contest →
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        {leaderboard.map((entry, i) => {
                            const isMe = user && String(entry.userId) === String(user._id);
                            const medal = MEDAL[i] ?? null;

                            return (
                                <div
                                    key={entry.userId}
                                    className={`flex items-center gap-3.5 rounded-2xl border p-4 transition ${isMe
                                            ? "border-brand-blue/30 bg-brand-blue/5 shadow-brand shadow-brand-blue/10"
                                            : "border-border bg-white shadow-card hover:bg-gray-50/50"
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="w-8 shrink-0 text-center">
                                        {medal
                                            ? <span className="text-xl">{medal}</span>
                                            : <span className="text-xs font-black text-text-muted">#{entry.rank}</span>
                                        }
                                    </div>

                                    {/* Name + badges */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`truncate text-sm font-black ${isMe ? "text-brand-blue" : "text-text-title"}`}>
                                            {entry.name} {isMe && <span className="text-[10px] text-brand-blue/60">(You)</span>}
                                        </p>
                                        {entry.badges?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {entry.badges.slice(0, 4).map((b) => (
                                                    <span key={b.id} title={b.name} className="text-sm">
                                                        {BADGE_EMOJI[b.id] ?? "🎖️"}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Streak */}
                                    <div className="hidden sm:flex flex-col items-center shrink-0">
                                        <span className="text-base">🔥</span>
                                        <span className="text-[10px] font-black text-text-muted">{entry.contestStreak}d</span>
                                    </div>

                                    {/* Points */}
                                    <div className="shrink-0 text-right">
                                        <p className={`text-sm font-black tabular-nums ${isMe ? "text-brand-blue" : "text-text-title"}`}>
                                            {entry.totalContestPoints.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-semibold text-text-muted">pts</p>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-50">
                    Rankings update instantly when anyone submits a contest
                </p>
            </div>
        </div>
    );
};

export default ContestLeaderboardPage;
