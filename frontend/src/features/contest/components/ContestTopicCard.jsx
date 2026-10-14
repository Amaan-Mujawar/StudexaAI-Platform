/* src/features/contest/components/ContestTopicCard.jsx */
const TOPIC_META = {
    DSA: {
        icon: "⚡",
        gradient: "from-violet-500 to-purple-600",
        bg: "bg-violet-50 border-violet-200",
        description: "Data Structures & Algorithms — arrays, trees, graphs, sorting, searching and more.",
        breakdown: { Easy: 4, Medium: 4, Hard: 2 },
    },
    OOPs: {
        icon: "🧩",
        gradient: "from-sky-500 to-cyan-600",
        bg: "bg-sky-50 border-sky-200",
        description: "Object-Oriented Programming — classes, inheritance, polymorphism and SOLID principles.",
        breakdown: { Easy: 4, Medium: 3, Hard: 2 },
    },
    SQL: {
        icon: "🗄️",
        gradient: "from-emerald-500 to-green-600",
        bg: "bg-emerald-50 border-emerald-200",
        description: "Structured Query Language — joins, subqueries, window functions, and schema design.",
        breakdown: { Easy: 4, Medium: 3, Hard: 2 },
    },
};

const ContestTopicCard = ({ topic, onStart, loading }) => {
    const meta = TOPIC_META[topic] ?? {
        icon: "🏆",
        gradient: "from-gray-500 to-gray-600",
        bg: "bg-gray-50 border-gray-200",
        description: topic,
        breakdown: {},
    };

    return (
        <div className={`rounded-3xl border ${meta.bg} shadow-card hover:shadow-card-hover transition-all duration-200 group overflow-hidden`}>
            {/* Header band */}
            <div className={`bg-gradient-to-r ${meta.gradient} px-5 pt-5 pb-4`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta.icon}</span>
                    <div>
                        <p className="text-base font-black text-white">{topic}</p>
                        <p className="text-[11px] font-semibold text-white/80">10 Questions · 30s each</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-text-body leading-relaxed">{meta.description}</p>

                {/* Difficulty breakdown */}
                <div className="flex items-center gap-2">
                    {Object.entries(meta.breakdown).map(([label, count]) => {
                        const colors = {
                            Easy: "bg-green-100 text-green-700 border-green-200",
                            Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
                            Hard: "bg-red-100 text-red-700 border-red-200",
                        };
                        return (
                            <span
                                key={label}
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${colors[label]}`}
                            >
                                {count} {label}
                            </span>
                        );
                    })}
                </div>

                <button
                    onClick={() => onStart(topic)}
                    disabled={loading}
                    className={`w-full rounded-2xl bg-gradient-to-r ${meta.gradient} py-2.5 text-sm font-black text-white shadow-md
            hover:opacity-90 active:scale-95 transition-all duration-150
            disabled:cursor-not-allowed disabled:opacity-60`}
                >
                    {loading ? "Starting…" : "Start Contest →"}
                </button>
            </div>
        </div>
    );
};

export default ContestTopicCard;
