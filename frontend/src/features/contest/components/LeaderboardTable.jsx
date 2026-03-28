/* src/features/contest/components/LeaderboardTable.jsx */

import { useAuth } from "../../../context/AuthContext.jsx";
import BadgeDisplay from "./BadgeDisplay.jsx";


const MEDAL = ["🥇", "🥈", "🥉"];

const LeaderboardTable = ({ entries = [], loading = false }) => {
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100" />
                ))}
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-white/70 px-6 py-10 text-center shadow-card">
                <p className="text-3xl">🏆</p>
                <p className="mt-2 text-sm font-bold text-text-title">No contestants yet</p>
                <p className="text-xs text-text-muted">Be the first to complete a contest!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map((entry) => {
                const isMe = user && String(entry.userId) === String(user._id);
                const medal = MEDAL[entry.rank - 1] ?? null;

                return (
                    <div
                        key={entry.userId}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition
              ${isMe
                                ? "border-brand-blue/30 bg-brand-blue/6 shadow-card"
                                : "border-border bg-white/70 hover:bg-white/90 shadow-card"
                            }`}
                    >
                        {/* Rank */}
                        <div className="w-8 text-center">
                            {medal ? (
                                <span className="text-xl">{medal}</span>
                            ) : (
                                <span className="text-xs font-black text-text-muted">#{entry.rank}</span>
                            )}
                        </div>

                        {/* Name + badges */}
                        <div className="flex-1 min-w-0">
                            <p className={`truncate text-sm font-bold ${isMe ? "text-brand-blue" : "text-text-title"}`}>
                                {entry.name} {isMe && <span className="text-[10px] font-black text-brand-blue/70">(You)</span>}
                            </p>
                            <BadgeDisplay badges={entry.badges?.slice(0, 3) ?? []} size="sm" />
                        </div>

                        {/* Streak */}
                        <div className="hidden sm:flex flex-col items-center gap-0.5">
                            <span className="text-base">🔥</span>
                            <span className="text-[10px] font-black text-text-muted">{entry.contestStreak}d</span>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                            <p className="text-sm font-black text-text-title tabular-nums">{entry.totalContestPoints.toLocaleString()}</p>
                            <p className="text-[10px] font-semibold text-text-muted">pts</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LeaderboardTable;
