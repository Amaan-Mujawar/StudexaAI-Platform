/* src/features/contest/components/BadgeDisplay.jsx */
const BADGE_META = {
    first_win: { emoji: "🏆", color: "text-amber-600 bg-amber-50 border-amber-200" },
    dsa_master: { emoji: "⚡", color: "text-violet-600 bg-violet-50 border-violet-200" },
    oop_master: { emoji: "🧩", color: "text-sky-600 bg-sky-50 border-sky-200" },
    sql_master: { emoji: "🗄️", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    streak_7: { emoji: "🔥", color: "text-orange-600 bg-orange-50 border-orange-200" },
    streak_30: { emoji: "💎", color: "text-blue-600 bg-blue-50 border-blue-200" },
};

const BadgeDisplay = ({ badges = [], size = "md", showEmpty = false }) => {
    if (badges.length === 0 && !showEmpty) return null;

    if (badges.length === 0) {
        return (
            <p className="text-xs text-text-muted italic">No badges yet — keep competing!</p>
        );
    }

    const pill = size === "sm" ? "text-[10px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((b) => {
                const meta = BADGE_META[b.id] ?? { emoji: "🎖️", color: "text-gray-600 bg-gray-50 border-gray-200" };
                return (
                    <span
                        key={b.id}
                        title={b.name}
                        className={`inline-flex items-center rounded-full border font-semibold ${pill} ${meta.color}`}
                    >
                        <span>{meta.emoji}</span>
                        <span>{b.name}</span>
                    </span>
                );
            })}
        </div>
    );
};

export default BadgeDisplay;
